import axios from "axios";

// Получает информацию об альбоме по его ID
export async function getAlbum(token: string, id: string | undefined) {
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