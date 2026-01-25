import axios from "axios";

// Получает список категорий браузера Spotify (максимум 20)
export async function getCategories(token: string) {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/browse/categories`, {
			headers: {
				Authorization: `Bearer ${token}`
			},
			params: {
				limit: 20,
				locale: 'en_US'
			}
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

// Осуществляет поиск по запросу: треки, альбомы, исполнители, плейлисты (максимум 50 результатов)
export async function getSearchResult(token: string, query: string) {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}`, {
			headers: {
				Authorization: `Bearer ${token}`
			},
			params: {
				type: 'track,album,artist,playlist',
				limit: 50
			}
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}