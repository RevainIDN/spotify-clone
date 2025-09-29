import axios from "axios";

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