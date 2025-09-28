import axios from "axios";
import generatePKCECodes from 'pkce-challenge';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = 'http://127.0.0.1:5174/callback';
const SCOPES = [
	'user-read-email',
	'user-read-private',
	'user-read-playback-state',
	'user-top-read',
	'user-modify-playback-state',
	'playlist-read-private',
	'user-library-read',
	'user-follow-read'
].join(' ');

export const getSpotifyAccessToken = async () => {
	const clientId = import.meta.env.VITE_CLIENT_ID;
	const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

	const authString = `${clientId}:${clientSecret}`;
	const authBase64 = btoa(authString);

	try {
		const response = await axios.post(
			'https://accounts.spotify.com/api/token',
			'grant_type=client_credentials',
			{
				headers: {
					Authorization: `Basic ${authBase64}`,
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);

		return response.data.access_token;
	} catch (error) {
		console.error('Ошибка получения токена Spotify:', error);
		return null;
	}
};

export const redirectToSpotifyLogin = async () => {
	try {
		const pkce = await generatePKCECodes();
		const codeVerifier = pkce.code_verifier;
		const codeChallenge = pkce.code_challenge;

		console.log('Generated code_verifier:', codeVerifier);
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