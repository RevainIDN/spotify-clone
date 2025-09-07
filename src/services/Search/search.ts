import axios from "axios";

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