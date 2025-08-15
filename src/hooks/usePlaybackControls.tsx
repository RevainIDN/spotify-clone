import axios from 'axios';
import { type Playlist } from '../types/playlists/playlistTypes';

import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../store';
import { setCurrentTrackUri, setIsPlaying } from '../store/playerSlice';

interface UseSpotifyPlayerControlsProps {
	collectionData?: Playlist;
	isShuffled: boolean;
}

export const usePlaybackControls = ({
	collectionData,
	isShuffled
}: UseSpotifyPlayerControlsProps) => {
	const dispatch = useDispatch<AppDispatch>();

	const token = useSelector((state: RootState) => state.auth.accessToken)
	const { deviceId, player } = useSelector((state: RootState) => state.player);

	const playPlaylist = async () => {
		if (!deviceId || !token || !collectionData || !player) {
			console.warn('Нет deviceId, token или данных плейлиста');
			return;
		}

		const uris = collectionData.tracks.items
			.filter(t => t.track && t.track.uri && t.track.available_markets.length > 0)
			.map(t => t.track.uri);

		if (uris.length === 0) {
			console.warn('Нет доступных треков для воспроизведения');
			return;
		}

		try {
			const state = await player.getCurrentState();
			const currentUri = state?.track_window.current_track.uri;
			const isTrackFromThisPlaylist = currentUri && uris.includes(currentUri);

			if (isTrackFromThisPlaylist) {
				if (state?.paused) {
					await player.resume();
					dispatch(setIsPlaying(true));
				} else {
					await player.pause();
					dispatch(setIsPlaying(false));
				}
			} else {
				await axios.put(
					`https://api.spotify.com/v1/me/player/shuffle?state=${isShuffled}&device_id=${deviceId}`,
					{},
					{ headers: { Authorization: `Bearer ${token}` } }
				);

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
		if (!player || !deviceId || !token) {
			console.warn('Плеер ещё не готов или отсутствует deviceId/token');
			return;
		}

		if (availableMarkets.length === 0) {
			return;
		}

		await axios.put(
			`https://api.spotify.com/v1/me/player/shuffle?state=false&device_id=${deviceId}`,
			{},
			{ headers: { Authorization: `Bearer ${token}` } }
		);

		try {
			const state = await player.getCurrentState();
			const currentUri = state?.track_window.current_track.uri;

			if (currentUri === uri) {
				if (state?.paused) {
					await player.resume();
					dispatch(setIsPlaying(true));
				} else {
					await player.pause();
					dispatch(setIsPlaying(false));
				}
			} else {
				const uris = collectionData?.tracks.items
					.filter(t => t.track && t.track.uri && t.track.available_markets.length > 0)
					.map(t => t.track.uri);

				const offsetIndex = uris?.indexOf(uri);

				if (uris && offsetIndex !== undefined && offsetIndex >= 0) {
					await axios.put(
						`https://api.spotify.com/v1/me/player/play`,
						{
							uris,
							offset: { position: offsetIndex >= 0 ? offsetIndex : 0 }
						},
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
			}
		} catch (error) {
			console.error('Ошибка при переключении воспроизведения:', error);
		}
	};

	return { playPlaylist, playTrack };
};