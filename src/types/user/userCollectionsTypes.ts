import { type Image } from "../collection/generalTypes";
import { type Playlist } from "../collection/playlistTypes";
import { type Album } from "../collection/albumTypes";

export interface UserPlaylistsResponse {
	href: string;
	items: Playlist[];
	limit: number;
	next: string | null;
	offset: number;
	previous: string | null;
	total: number;
}

export interface SavedAlbumObject {
	added_at: string;
	album: Album;
}

export interface UserAlbumsResponse {
	href: string;
	limit: number;
	next: string | null;
	offset: number;
	previous: string | null;
	total: number;
	items: SavedAlbumObject[];
}

interface ArtistFull {
	external_urls: {
		spotify: string;
	};
	followers: {
		href: string | null;
		total: number;
	}
	genres: string[];
	href: string;
	id: string;
	images: Image[];
	name: string;
	popularity: number;
	type: 'artist';
	uri: string;
}

export interface UserFollowedArtistsResponse {
	artists: {
		href: string;
		limit: number;
		next: string | null;
		cursors: {
			after?: string;
			before?: string;
		}
		total: number;
		items: ArtistFull[];
	};
}