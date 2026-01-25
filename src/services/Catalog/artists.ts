import axios from "axios";

// Получает информацию об исполнителе по его ID
export async function getArtist(token: string, id: string | undefined) {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/artists/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

// Получает топ-треки исполнителя
export async function getArtistTopTracks(token: string, id: string | undefined) {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/artists/${id}/top-tracks`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

// Получает все альбомы исполнителя (максимум 50)
export async function getArtistAlbums(token: string, id: string | undefined) {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/artists/${id}/albums`, {
			headers: {
				Authorization: `Bearer ${token}`
			},
			params: {
				limit: 50
			}
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}