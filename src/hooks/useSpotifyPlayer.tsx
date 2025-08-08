import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setDeviceId, setPlayer, setIsReady } from '../store/playerSlice';
import { refreshSpotifyAccessToken } from '../services/authSpotify';

export const useSpotifyPlayer = (token: string) => {
	const dispatch = useDispatch();
	const playerRef = useRef<Spotify.Player | null>(null);

	useEffect(() => {
		if (!token) {
			dispatch(setIsReady(false));
			return;
		}

		if (!window.Spotify) {
			const script = document.createElement('script');
			script.id = 'spotify-sdk';
			script.src = 'https://sdk.scdn.co/spotify-player.js';
			script.async = true;
			document.body.appendChild(script);
		}

		window.onSpotifyWebPlaybackSDKReady = () => {
			if (!token) {
				console.warn('Токен отсутствует при инициализации Spotify Player');
				return;
			}

			try {
				const player = new window.Spotify.Player({
					name: 'React Spotify Clone Player',
					getOAuthToken: (cb) => cb(token),
					volume: 0.2,
				});

				player.addListener('ready', ({ device_id }) => {
					console.log('Player готов с device_id:', device_id);
					dispatch(setDeviceId(device_id));
					dispatch(setPlayer(player));
					dispatch(setIsReady(true));
				});

				player.addListener('not_ready', ({ device_id }) => {
					console.log('Player не готов, device_id:', device_id);
					dispatch(setIsReady(false));
				});

				player.addListener('authentication_error', async ({ message }) => {
					console.error('Ошибка авторизации:', message);
					dispatch(setIsReady(false));
					const refreshToken = localStorage.getItem('spotify_refresh_token');
					if (refreshToken) {
						try {
							const { access_token } = await refreshSpotifyAccessToken(refreshToken);
							player.disconnect();
							playerRef.current = new window.Spotify.Player({
								name: 'React Spotify Clone Player',
								getOAuthToken: (cb) => cb(access_token),
								volume: 0.5,
							});
							playerRef.current.connect();
							dispatch(setPlayer(playerRef.current));
						} catch (error) {
							console.error('Не удалось обновить токен:', error);
						}
					}
				});

				player.addListener('initialization_error', ({ message }) => {
					console.error('Ошибка инициализации:', message);
					dispatch(setIsReady(false));
				});

				player.addListener('account_error', ({ message }) => {
					console.error('Ошибка аккаунта:', message);
					dispatch(setIsReady(false));
				});

				player.addListener('player_state_changed', (state) => {
					console.log('Состояние плеера изменено:', state);
				});

				player.connect().then((success) => {
					if (success) {
						console.log('Spotify Player успешно подключен');
					} else {
						console.error('Не удалось подключить Spotify Player');
					}
				});

				playerRef.current = player;
			} catch (error) {
				console.error('Ошибка при создании Spotify Player:', error);
			}
		};

		return () => {
			if (playerRef.current) {
				playerRef.current.disconnect();
				playerRef.current = null;
			}
			dispatch(setIsReady(false));
			window.onSpotifyWebPlaybackSDKReady = () => { };
		};
	}, [token, dispatch]);

	return {};
};