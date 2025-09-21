import { type Playlist } from "../collection/playlistTypes";

export interface UserPlaylistsResponse {
	href: string;
	items: Playlist[];
	limit: number;
	next: string | null;
	offset: number;
	previous: string | null;
	total: number;
}