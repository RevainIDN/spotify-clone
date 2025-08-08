import { useEffect, useState } from 'react';
import { getUserSpotifyAccessToken, redirectToSpotifyLogin, refreshSpotifyAccessToken } from '../services/authSpotify';

export const useSpotifyAuth = () => {
	const [token, setToken] = useState<string>('');
	const [refreshToken, setRefreshToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const url = new URL(window.location.href);
		const code = url.searchParams.get('code');

		const fetchToken = async () => {
			if (code) {
				try {
					const data = await getUserSpotifyAccessToken(code);
					setToken(data.access_token);
					setRefreshToken(data.refresh_token || null);
					window.history.replaceState({}, document.title, '/');
				} catch (error) {
					console.error('Ошибка получения токена:', error);
				}
				return;
			}

			const savedToken = localStorage.getItem('spotify_access_token');
			const savedRefreshToken = localStorage.getItem('spotify_refresh_token');
			if (savedToken && savedRefreshToken) {
				setToken(savedToken);
				setRefreshToken(savedRefreshToken);
			} else {
				redirectToSpotifyLogin();
			}
			setLoading(false);
		};

		fetchToken();
	}, []);

	useEffect(() => {
		if (!refreshToken) return;

		const refreshInterval = setInterval(async () => {
			try {
				const { access_token, refresh_token } = await refreshSpotifyAccessToken(refreshToken);
				setToken(access_token);
				setRefreshToken(refresh_token);
			} catch (error) {
				console.error('Ошибка при обновлении токена:', error);
				redirectToSpotifyLogin();
			}
		}, 50 * 60 * 1000);

		return () => clearInterval(refreshInterval);
	}, [refreshToken]);

	return { token, refreshToken, loading };
};