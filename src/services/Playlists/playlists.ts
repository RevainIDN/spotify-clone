import axios from "axios";
import { type Playlist } from "../../types/playlists/categoriesPlaylistsTypes";
import { type SimplifiedMappedPlaylistItem } from "../../types/playlists/generalTypes"

export const mapPlaylistToSimplified = (playlist: Playlist | null): SimplifiedMappedPlaylistItem | null => {
	if (!playlist) return null;
	return {
		id: playlist.id,
		name: playlist.name,
		images: playlist.images,
		description: playlist.description,
		ownerName: playlist.owner.display_name
	};
};

const getNewReleases = async (token: string | null) => {
	if (!token) {
		console.error("Token is null, skipping request");
		throw new Error("No access token provided");
	}
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

const getPopPlaylists = async (token: string | null) => {
	if (!token) {
		console.error("Token is null, skipping request");
		throw new Error("No access token provided");
	}
	try {
		const response = await axios.get("https://api.spotify.com/v1/search?q=pop&type=playlist&limit=20", {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching pop playlists:", error);
		throw error;
	}
}

const getRockPlaylists = async (token: string | null) => {
	if (!token) {
		console.error("Token is null, skipping request");
		throw new Error("No access token provided");
	}
	try {
		const response = await axios.get("https://api.spotify.com/v1/search?q=rock&type=playlist&limit=20", {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching rock playlists:", error);
		throw error;
	}
}

const getRelaxPlaylists = async (token: string | null) => {
	if (!token) {
		console.error("Token is null, skipping request");
		throw new Error("No access token provided");
	}
	try {
		const response = await axios.get("https://api.spotify.com/v1/search?q=relax&type=playlist&limit=20", {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching relax playlists:", error);
		throw error;
	}
}

export default { getNewReleases, getPopPlaylists, getRockPlaylists, getRelaxPlaylists };