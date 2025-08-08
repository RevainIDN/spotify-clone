import axios from "axios";

export async function getAlbum(token: string, id: string) {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/albums/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}