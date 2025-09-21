import axios from "axios";

export async function getUserPlaylists(token: string) {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/me/playlists`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}