import { useEffect, useState, useCallback, useRef } from 'react';
import { checkLikedTracks, saveLikedTrack, deleteLikedTrack } from '../services/User/likedTracks';
import { useSelector, useDispatch } from 'react-redux';
import { setNotification } from '../store/general';
import type { RootState, AppDispatch } from '../store';

const globalLikedCache: Record<string, boolean> = {};

export function useLikedTracks(trackIds: string[] | null) {
	const token = useSelector((state: RootState) => state.auth.accessToken);
	const [likedTracks, setLikedTracks] = useState<boolean[]>([]);
	const dispatch = useDispatch<AppDispatch>();

	const likedCache = useRef(globalLikedCache);

	// Проверка, какие треки лайкнуты
	useEffect(() => {
		if (!token || !trackIds?.length) {
			setLikedTracks(prev => (prev.length === 0 ? prev : []));
			return;
		}

		let cancelled = false;

		const fetchLikedTracks = async () => {
			try {
				const uncachedIds = trackIds.filter(id => !(id in likedCache.current));
				if (uncachedIds.length === 0) {
					const finalArray = trackIds.map(id => likedCache.current[id] || false);
					setLikedTracks(finalArray);
					return;
				}

				for (let i = 0; i < uncachedIds.length; i += 50) {
					const chunk = uncachedIds.slice(i, i + 50);
					const result = await checkLikedTracks(token, chunk);

					if (Array.isArray(result)) {
						chunk.forEach((id, idx) => {
							likedCache.current[id] = result[idx];
						});
					} else {
						chunk.forEach(id => {
							likedCache.current[id] = false;
						});
					}
				}

				if (!cancelled) {
					const finalArray = trackIds.map(id => likedCache.current[id] || false);

					setLikedTracks(prev => {
						const isSame = prev.length === finalArray.length && prev.every((v, i) => v === finalArray[i]);
						return isSame ? prev : finalArray;
					});
				}
			} catch (error) {
				console.error('Failed to fetch liked tracks:', error);
				if (!cancelled) {
					setLikedTracks(trackIds.map(() => false));
				}
			}
		};

		fetchLikedTracks();

		return () => {
			cancelled = true;
		};
	}, [trackIds, token]);

	// Переключатель лайков
	const toggleLike = useCallback(
		async (trackId: string, index: number) => {
			if (!token) return;

			try {
				if (likedTracks[index]) {
					await deleteLikedTrack(token, trackId);
					setLikedTracks(prev => {
						const copy = [...prev];
						copy[index] = false;
						return copy;
					});
					dispatch(setNotification('Removed from the "Liked Songs" playlist'));
				} else {
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