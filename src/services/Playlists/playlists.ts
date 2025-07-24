import axios from "axios";

const getNewReleases = async (token: string) => {
	try {
		const response = await axios.get("https://api.spotify.com/v1/browse/new-releases", {
			headers: {
				Authorization: `Bearer ${token}`
			},
			params: {
				limit: 20,
				country: 'US'
			}
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching new releases:", error);
		throw error;
	}
}

export default getNewReleases;