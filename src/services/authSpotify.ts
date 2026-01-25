import generatePKCECodes from 'pkce-challenge';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const SCOPES = [
	'user-read-email',
	'user-read-private',
	'user-read-playback-state',
	'user-top-read',
	'user-modify-playback-state',
	'playlist-read-private',
	'user-library-modify',
	'user-library-read',
	'user-follow-read',
	'user-follow-modify',
	'playlist-modify-public',
	'playlist-modify-private',
	'user-read-recently-played',
	'ugc-image-upload',
].join(' ');

// Перенаправляет пользователя на страницу авторизации Spotify с PKCE потоком
// Генерирует code_verifier и code_challenge для безопасной авторизации
export const redirectToSpotifyLogin = async () => {
	try {
		const pkce = await generatePKCECodes();
		const codeVerifier = pkce.code_verifier;
		const codeChallenge = pkce.code_challenge;

		localStorage.setItem('spotify_code_verifier', codeVerifier);

		const authUrl =
			`https://accounts.spotify.com/authorize?` +
			`client_id=${CLIENT_ID}` +
			`&response_type=code` +
			`&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
			`&scope=${encodeURIComponent(SCOPES)}` +
			`&code_challenge_method=S256` +
			`&code_challenge=${codeChallenge}`;

		window.location.href = authUrl;
	} catch (error) {
		console.error('Ошибка при генерации PKCE кодов:', error);
	}
};

// Обменивает authorization code на access и refresh токены через Spotify API
// Использует code_verifier из localStorage для верификации в PKCE потоке
export const getUserSpotifyAccessToken = async (code: string) => {
	const codeVerifier = localStorage.getItem('spotify_code_verifier');
	if (!codeVerifier) {
		console.error('code_verifier not found in localStorage');
		throw new Error('code_verifier not found');
	}

	const body = new URLSearchParams({
		client_id: CLIENT_ID,
		grant_type: 'authorization_code',
		code,
		redirect_uri: REDIRECT_URI,
		code_verifier: codeVerifier,
	});

	try {
		const response = await fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: body.toString(),
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error('Ошибка обмена кода:', errorData);
			throw new Error('Token exchange failed');
		}

		const data = await response.json();

		localStorage.setItem('spotify_access_token', data.access_token);
		if (data.refresh_token) {
			localStorage.setItem('spotify_refresh_token', data.refresh_token);
		}

		return data;
	} catch (error) {
		console.error('Ошибка в getUserSpotifyAccessToken:', error);
		throw error;
	}
};

// Обновляет access токен используя refresh токен
// Вызывается при истечении времени жизни текущего токена
export const refreshSpotifyAccessToken = async (refreshToken: string) => {
	const body = new URLSearchParams({
		grant_type: 'refresh_token',
		refresh_token: refreshToken,
		client_id: CLIENT_ID,
	});

	try {
		const response = await fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: body.toString(),
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error('Ошибка обновления токена:', errorData);
			throw new Error('Token refresh failed');
		}

		const data = await response.json();

		localStorage.setItem('spotify_access_token', data.access_token);
		if (data.refresh_token) {
			localStorage.setItem('spotify_refresh_token', data.refresh_token);
		}

		return {
			access_token: data.access_token,
			refresh_token: data.refresh_token || refreshToken,
		};
	} catch (error) {
		console.error('Ошибка в refreshSpotifyAccessToken:', error);
		throw error;
	}
};