import axios from "axios";
import { type Playlist } from "../../types/collection/categoriesPlaylistsTypes";
import { type FullArtist } from "../../types/collection/artistTypes";
import { type SimplifiedMappedPlaylistItem, type SimplifiedMappedAlbumItem, type SimplifiedMappedArtistItem, type SimplifiedMappedTrackItem, type Track } from "../../types/collection/generalTypes"
import { type ArtistAlbumItems } from "../../types/collection/artistTypes";
import { type SavedAlbumObject } from "../../types/user/userCollectionsTypes";

export const mapPlaylistToSimplified = (playlist: Playlist | null): SimplifiedMappedPlaylistItem | null => {
	if (!playlist) return null;
	return {
		id: playlist.id,
		name: playlist.name,
		images: playlist.images,
		description: playlist.description,
		ownerName: playlist.owner.display_name,
		artists: [],
		type: 'playlist'
	};
};

export const mapAlbumToSimplified = (album: ArtistAlbumItems | null): SimplifiedMappedAlbumItem | null => {
	if (!album) return null;
	return {
		album_group: album.album_group,
		album_type: album.album_type,
		id: album.id,
		name: album.name,
		images: album.images,
		release_date: album.release_date,
		type: 'album'
	};
};

export const mapSavedAlbumToSimplified = (saved: SavedAlbumObject | null): SimplifiedMappedAlbumItem | null => {
	if (!saved) return null;
	const album = saved.album;
	return {
		album_group: undefined,
		album_type: album.album_type,
		id: album.id,
		name: album.name,
		images: album.images,
		release_date: album.release_date,
		type: "album"
	};
};

export const mapArtistToSimplified = (artist: FullArtist | null): SimplifiedMappedArtistItem | null => {
	if (!artist) return null;
	return {
		id: artist.id,
		name: artist.name,
		images: artist.images,
		popularity: artist.popularity,
		type: artist.type
	};
}

export const mapTrackToSimplified = (track: Track | null): SimplifiedMappedTrackItem | null => {
	if (!track) return null;
	return {
		id: track.id,
		name: track.name,
		images: track.album.images,
		duration_ms: track.duration_ms,
		artists: track.artists.map((artist: any) => ({
			id: artist.id,
			name: artist.name,
			type: artist.type
		})),
		type: 'track'
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
				limit: 20
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