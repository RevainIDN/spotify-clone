import axios from "axios";

// Получает результаты поиска по категориям: альбомы, исполнители, плейлисты (максимум 50)
export async function getDataCategory(token: string, query: string) {
	if (!token) {
		console.error("Token is null, skipping request");
		throw new Error("No access token provided");
	}

	try {
		const response = await axios.get(
			`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				params: {
					type: 'album,artist,playlist',
					limit: 50
				}
			}
		);
		return response.data;
	} catch (error) {
		console.error("Ошибка при поиске плейлистов:", error);
		throw error;
	}
}