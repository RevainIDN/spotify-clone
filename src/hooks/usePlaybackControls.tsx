import axios from 'axios';
import { type Playlist } from '../types/collection/playlistTypes';
import { type Album } from '../types/collection/albumTypes';
import { type FullArtist } from '../types/collection/artistTypes';
import { type ArtistTracks } from '../types/collection/artistTypes';
import { type UserProfile } from '../types/user/userProfileTypes';
import { type UserPublicProfile } from '../types/user/userPublicProfileTypes';
import { type LikedSongsCollection } from '../types/collection/likedSongsTypes';
import { normalizeTracks } from '../utils/normalize';

import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../store';
import { setCurrentTrackUri, setIsPlaying } from '../store/playerSlice';

interface UseSpotifyPlayerControlsProps {
	collectionData?: Playlist | Album | FullArtist | ArtistTracks | UserProfile | UserPublicProfile | LikedSongsCollection;
	isShuffled: boolean;
}

// Хук управления воспроизведением музыки через Spotify Web Playback SDK и REST API.
// Поддерживает воспроизведение полных коллекций с перемешиванием и отдельных треков.
export const usePlaybackControls = ({
	collectionData,
	isShuffled
}: UseSpotifyPlayerControlsProps) => {
	const dispatch = useDispatch<AppDispatch>();

	// Получаем токен доступа и параметры плеера (deviceId и Spotify player instance).
	const token = useSelector((state: RootState) => state.auth.accessToken)
	const { deviceId, player } = useSelector((state: RootState) => state.player);

	const playCollection = async () => {
		// Проверяем наличие всех необходимых параметров для воспроизведения.
		if (!deviceId || !token || !collectionData || !player) {
			console.warn('Нет deviceId, token или данных плейлиста');
			return;
		}

		// Нормализуем данные коллекции в массив треков.
		const tracks = normalizeTracks(collectionData);
		// Фильтруем только доступные в нашем регионе и извлекаем их URI.
		const uris = tracks
			.filter(t => t.track && t.track.uri && t.track.available_markets.length > 0)
			.map(t => t.track.uri);

		if (uris.length === 0) {
			console.warn('Нет доступных треков для воспроизведения');
			return;
		}

		try {
			// Получаем текущее состояние плеера (какой трек сейчас играет).
			const state = await player.getCurrentState();
			const currentUri = state?.track_window.current_track.uri;
			// Проверяем, является ли текущий трек частью выбранной коллекции.
			const isTrackFromThisPlaylist = currentUri && uris.includes(currentUri);

			// Если трек уже из этой коллекции, то просто переключаем пауза/воспроизведение.
			if (isTrackFromThisPlaylist) {
				if (state?.paused) {
					await player.resume();
					dispatch(setIsPlaying(true));
				} else {
					await player.pause();
					dispatch(setIsPlaying(false));
				}
			} else {
				// Если это новая коллекция, устанавливаем режим перемешивания.
				await axios.put(
					`https://api.spotify.com/v1/me/player/shuffle?state=${isShuffled}&device_id=${deviceId}`,
					{},
					{ headers: { Authorization: `Bearer ${token}` } }
				);

				// Запускаем воспроизведение коллекции.
				await axios.put(
					`https://api.spotify.com/v1/me/player/play`,
					{ uris },
					{
						headers: {
							Authorization: `Bearer ${token}`,
							'Content-Type': 'application/json',
						},
						params: { device_id: deviceId }
					}
				);

				// Получаем информацию о текущем воспроизводимом треке и обновляем Redux.
				const res = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
					headers: { Authorization: `Bearer ${token}` }
				});
				if (res.data?.item?.uri) {
					dispatch(setCurrentTrackUri(res.data.item.uri));
					dispatch(setIsPlaying(true));
				}
			}

		} catch (error) {
			console.error('Ошибка при запуске плейлиста:', error);
		}
	};

	const playTrack = async (uri: string, availableMarkets: string[]) => {
		// Проверяем готовность плеера и наличие необходимых данных.
		if (!player || !deviceId || !token) {
			console.warn('Плеер ещё не готов или отсутствует deviceId/token');
			return;
		}

		// Если трек недоступен в нашем регионе, не пытаемся его воспроизводить.
		if (availableMarkets.length === 0) {
			return;
		}

		// Отключаем перемешивание при воспроизведении одного трека.
		await axios.put(
			`https://api.spotify.com/v1/me/player/shuffle?state=false&device_id=${deviceId}`,
			{},
			{ headers: { Authorization: `Bearer ${token}` } }
		);

		try {
			// Получаем текущее состояние плеера.
			const state = await player.getCurrentState();
			const currentUri = state?.track_window.current_track.uri;

			// Если трек уже воспроизводится, просто переключаем пауза/воспроизведение.
			if (currentUri === uri) {
				if (state?.paused) {
					await player.resume();
					dispatch(setIsPlaying(true));
				} else {
					await player.pause();
					dispatch(setIsPlaying(false));
				}
			} else {
				// Для нового трека формируем список всех доступных треков.
				let uris: string[] = [];

				// Если есть контекст коллекции, берём треки из неё и находим позицию нового трека в списке.
				if (collectionData) {
					const tracks = normalizeTracks(collectionData);
					uris = tracks
						.filter(t => t.track && t.track.uri && t.track.available_markets.length > 0)
						.map(t => t.track.uri);
				} else {
					// Если нет контекста, воспроизводим только выбранный трек.
					uris = [uri];
				}

				// Запускаем воспроизведение с нужной позиции в списке.
				await axios.put(
					`https://api.spotify.com/v1/me/player/play`,
					{ uris, offset: { position: uris.indexOf(uri) >= 0 ? uris.indexOf(uri) : 0 } },
					{
						headers: {
							Authorization: `Bearer ${token}`,
							'Content-Type': 'application/json',
						},
						params: { device_id: deviceId }
					}
				);
				dispatch(setIsPlaying(true));
				dispatch(setCurrentTrackUri(uri));
			}
		} catch (error) {
			console.error('Ошибка при переключении воспроизведения:', error);
		}
	};

	return { playCollection, playTrack };
};