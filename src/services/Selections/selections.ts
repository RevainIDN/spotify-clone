import axios from "axios";

// Получает новые релизы текущего года (максимум 20 альбомов)
export const getNewReleases = async (token: string | null) => {
	if (!token) {
		console.error("Token is null, skipping request");
		throw new Error("No access token provided");
	}

	const today = new Date();
	const year = today.getFullYear();

	try {
		const response = await axios.get("https://api.spotify.com/v1/search", {
			headers: {
				Authorization: `Bearer ${token}`
			},
			params: {
				q: `tag:new year:${year}`,
				type: "album",
				limit: 20
			}
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching new releases:", error);
		throw error;
	}
}

// Получает популярные треки жанра поп текущего года (максимум 20 альбомов)
export const getPopularTracks = async (token: string | null) => {
	if (!token) {
		console.error("Token is null, skipping request");
		throw new Error("No access token provided");
	}
	try {
		const response = await axios.get("https://api.spotify.com/v1/search", {
			headers: {
				Authorization: `Bearer ${token}`
			},
			params: {
				q: "tag:new genre:pop",
				type: "album",
				limit: 20,
				market: "US"
			}
		});
		return response.data.albums.items;
	} catch (error) {
		console.error("Error fetching popular tracks:", error);
		throw error;
	}
}