import axios from 'axios';

export async function getLikedTracks(token: string) {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/me/tracks`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

export async function checkLikedTracks(token: string, trackIds: string[]) {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/me/tracks/contains?ids=${trackIds.join(',')}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

export async function saveLikedTrack(token: string, trackId: string) {
	try {
		await axios.put(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, null, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
	} catch (error) {
		console.error(error);
	}
}

export async function deleteLikedTrack(token: string, trackId: string) {
	try {
		await axios.delete(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
	} catch (error) {
		console.error(error);
	}
}