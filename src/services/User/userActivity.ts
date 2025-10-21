import axios from "axios";

export async function getIsUserSubscribedToPlaylist(token: string, id: string) {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/playlists/${id}/followers/contains`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
		return response.data
	} catch (error) {
		console.log(error)
	}
}

export async function followPlaylist(token: string, id: string | undefined) {
	try {
		const response = await axios.put(
			`https://api.spotify.com/v1/playlists/${id}/followers`,
			{ public: false },
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json"
				},
			}
		);
		return response.status;
	} catch (error) {
		console.log(error)
	}
}

export async function unfollowPlaylist(token: string, id: string | undefined) {
	try {
		const response = await axios.delete(
			`https://api.spotify.com/v1/playlists/${id}/followers`,
			{
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		)
		return response.status;
	} catch (error) {
		console.log(error)
	}
}