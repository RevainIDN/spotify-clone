import { useEffect, useState } from 'react';
import { type NavigateFunction } from 'react-router-dom';
import { getUserSpotifyAccessToken, redirectToSpotifyLogin, refreshSpotifyAccessToken } from '../services/authSpotify';

// Управляет полным OAuth-потоком авторизации через Spotify
// Получает код из URL после редиректа, обменивает на токен и периодически его обновляет
export const useSpotifyAuth = (navigate: NavigateFunction) => {
	const [token, setToken] = useState<string>('');
	const [refreshToken, setRefreshToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const url = new URL(window.location.href);
		const code = url.searchParams.get('code');

		// Проверяем наличие auth code в URL (он приходит после редиректа от Spotify)
		const fetchToken = async () => {
			if (code) {
				try {
					// Обмениваем code на access token напрямую в Spotify API (с использованием PKCE)
					const data = await getUserSpotifyAccessToken(code);
					setToken(data.access_token);
					setRefreshToken(data.refresh_token || null);

					// Сохраняем токены в localStorage для дальнейшего использования
					localStorage.setItem('spotify_access_token', data.access_token);
					if (data.refresh_token) {
						localStorage.setItem('spotify_refresh_token', data.refresh_token);
					}
					navigate('/', { replace: true });
				} catch (error) {
					console.error('Ошибка получения токена:', error);
				} finally {
					setLoading(false);
				}
				return;
			}

			// Если code нет, пытаемся загрузить сохранённые токены
			const savedToken = localStorage.getItem('spotify_access_token');
			const savedRefreshToken = localStorage.getItem('spotify_refresh_token');
			if (savedToken && savedRefreshToken) {
				setToken(savedToken);
				setRefreshToken(savedRefreshToken);
				setLoading(false);
			} else {
				// Если токенов нет, перенаправляем на Spotify для авторизации
				redirectToSpotifyLogin();
			}
			setLoading(false);
		};

		fetchToken();
	}, []);

	useEffect(() => {
		if (!refreshToken) return;

		// Обновляем токен каждые 50 минут (Spotify токен действует 1 час)
		const refreshInterval = setInterval(async () => {
			try {
				const { access_token, refresh_token } = await refreshSpotifyAccessToken(refreshToken);
				setToken(access_token);
				setRefreshToken(refresh_token);

				// Сохраняем обновленные токены
				localStorage.setItem('spotify_access_token', access_token);
				if (refresh_token) {
					localStorage.setItem('spotify_refresh_token', refresh_token);
				}
			} catch (error) {
				console.error('Ошибка при обновлении токена:', error);
				redirectToSpotifyLogin();
			}
		}, 50 * 60 * 1000);

		return () => clearInterval(refreshInterval);
	}, [refreshToken]);

	return { token, refreshToken, loading };
};