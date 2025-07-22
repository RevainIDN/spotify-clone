import axios from "axios";

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

		const accessToken = response.data.access_token;
		console.log('Access Token:', accessToken);
		return accessToken;
	} catch (error) {
		console.error('Ошибка получения токена Spotify:', error);
		return null;
	}
};