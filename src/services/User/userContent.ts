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

export async function getUserFollowingAlbums(token: string) {
	try {
		const response = await axios.get('https://api.spotify.com/v1/me/albums', {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
		return response.data
	} catch (error) {
		console.error(error)
	}
}

export async function getUserFollowingArtists(token: string) {
	try {
		const response = await axios.get('https://api.spotify.com/v1/me/following?type=artist', {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
		return response.data
	} catch (error) {
		console.error(error)
	}
}

export async function getUserRecentlyPlayedTracks(token: string) {
	try {
		const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
			headers: {
				Authorization: `Bearer ${token}`
			},
			params: {
				limit: 30
			}
		})
		return response.data
	} catch (error) {
		console.error(error);
	}
}