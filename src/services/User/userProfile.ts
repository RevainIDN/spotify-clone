import axios from "axios";

// Получает информацию о текущем авторизованном пользователе
export async function getUserProfileData(token: string) {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/me`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

// Получает топ-треки или топ-исполнителей текущего пользователя
export async function getUserTopItems(token: string, type: 'artists' | 'tracks') {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/me/top/${type}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

// Получает публичную информацию об указанном пользователе
export async function getPublicUserProfileData(token: string, type: string | undefined) {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/users/${type}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

// Получает все плейлисты указанного пользователя
export async function getPublicUserPlaylistsData(token: string, type: string | undefined) {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/users/${type}/playlists`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}