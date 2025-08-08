import axios from "axios";

export async function getPlaylist(token: string, id: string | undefined) {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}