import { type Track, type Image, type TracksBase } from "./generalTypes";

export interface Playlist {
	collaborative: boolean;
	description: string;
	external_urls: {
		spotify: string;
	};
	followers?: {
		href: string | null;
		total: number;
	};
	href: string;
	id: string;
	images: Image[];
	name: string;
	owner: {
		display_name: string;
		external_urls: {
			spotify: string;
		};
		href: string;
		id: string;
		type: string;
		uri: string;
	};
	primary_color?: string | null;
	public: boolean;
	snapshot_id: string;
	tracks: TracksBase<PlaylistTrack>;
	type: string;
	uri: string;
}

export interface PlaylistTrack {
	added_at: string;
	added_by: {
		external_urls: {
			spotify: string;
		};
		href: string;
		id: string;
		type: string;
		uri: string;
	};
	is_local: boolean;
	track: Track;
}