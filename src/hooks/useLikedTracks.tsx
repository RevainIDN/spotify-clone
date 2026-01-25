import { useEffect, useState, useCallback, useRef } from 'react';
import { checkLikedTracks, saveLikedTrack, deleteLikedTrack } from '../services/User/likedTracks';
import { useSelector, useDispatch } from 'react-redux';
import { setNotification } from '../store/general';
import type { RootState, AppDispatch } from '../store';

// Глобальный кэш статуса лайков треков для оптимизации повторных запросов.
const globalLikedCache: Record<string, boolean> = {};

// Хук для управления статусом лайков треков с кэшированием на уровне приложения.
export function useLikedTracks(trackIds: string[] | null) {
	const token = useSelector((state: RootState) => state.auth.accessToken);
	// Массив, где каждый элемент — булев статус лайка для соответствующего трека.
	const [likedTracks, setLikedTracks] = useState<boolean[]>([]);
	const dispatch = useDispatch<AppDispatch>();

	// Используем ref для доступа к глобальному кэшу, чтобы избежать пересоздания при каждом рендере.
	const likedCache = useRef(globalLikedCache);

	// Загрузка статусов лайков для списка треков с кэшированием результатов.
	useEffect(() => {
		// Если нет токена или треков, очищаем состояние.
		if (!token || !trackIds?.length) {
			setLikedTracks(prev => (prev.length === 0 ? prev : []));
			return;
		}

		// Флаг для отмены запроса при размонтировании компонента.
		let cancelled = false;

		const fetchLikedTracks = async () => {
			try {
				// Определяем, какие треки ещё не закэшированы.
				const uncachedIds = trackIds.filter(id => !(id in likedCache.current));
				// Если все треки уже в кэше, используем закэшированные значения.
				if (uncachedIds.length === 0) {
					const finalArray = trackIds.map(id => likedCache.current[id] || false);
					setLikedTracks(finalArray);
					return;
				}

				// Обработка ID порциями по 50 (ограничение API Spotify).
				for (let i = 0; i < uncachedIds.length; i += 50) {
					const chunk = uncachedIds.slice(i, i + 50);
					const result = await checkLikedTracks(token, chunk);

					// Сохраняем результаты в глобальный кэш.
					if (Array.isArray(result)) {
						chunk.forEach((id, idx) => {
							likedCache.current[id] = result[idx];
						});
					} else {
						// Если ошибка, считаем все треки не лайкнутыми.
						chunk.forEach(id => {
							likedCache.current[id] = false;
						});
					}
				}

				// Если запрос не был отменён, обновляем состояние.
				if (!cancelled) {
					const finalArray = trackIds.map(id => likedCache.current[id] || false);

					// Оптимизация: обновляем состояние только если данные изменились.
					setLikedTracks(prev => {
						const isSame = prev.length === finalArray.length && prev.every((v, i) => v === finalArray[i]);
						return isSame ? prev : finalArray;
					});
				}
			} catch (error) {
				console.error('Failed to fetch liked tracks:', error);
				// В случае ошибки считаем все треки не лайкнутыми.
				if (!cancelled) {
					setLikedTracks(trackIds.map(() => false));
				}
			}
		};

		fetchLikedTracks();

		// Отмена запроса при размонтировании или смене зависимостей.
		return () => {
			cancelled = true;
		};
	}, [trackIds, token]);

	// Функция для добавления/удаления трека из "Понравившихся композиций".
	const toggleLike = useCallback(
		async (trackId: string, index: number) => {
			if (!token) return;

			try {
				// Если трек уже лайкнут, удаляем его.
				if (likedTracks[index]) {
					await deleteLikedTrack(token, trackId);
					// Обновляем локальное состояние статуса лайка.
					setLikedTracks(prev => {
						const copy = [...prev];
						copy[index] = false;
						return copy;
					});
					dispatch(setNotification('Removed from the "Liked Songs" playlist'));
				} else {
					// Если трек не лайкнут, добавляем его.
					await saveLikedTrack(token, trackId);
					setLikedTracks(prev => {
						const copy = [...prev];
						copy[index] = true;
						return copy;
					});
					dispatch(setNotification('Added to the "Liked Songs" playlist'));
				}
			} catch (error) {
				console.error(error);
				dispatch(setNotification('Something went wrong'));
			}
		},
		[token, likedTracks, dispatch]
	);

	return { likedTracks, toggleLike };
}