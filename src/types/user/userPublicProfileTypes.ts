import { type Playlist } from '../collection/playlistTypes'

export interface UserPublicProfile {
	display_name: string;
	external_urls: {
		spotify: string;
	};
	followers: {
		href: string | null;
		total: number;
	};
	href: string;
	id: string;
	images: Array<{
		url: string;
		height: number | null;
		width: number | null;
	}>;
	type: 'user';
	uri: string;
}

interface PlaylistsBase<T> {
	href: string;
	limit: number;
	next: string | null;
	offset: number;
	previous: string | null;
	total: number;
	items: T[];
}

export type UserPublicPlaylists = PlaylistsBase<Playlist>;