import { type Track } from "./generalTypes";

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
	images: Array<{
		url: string;
		height: number | null;
		width: number | null;
	}>;
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
	tracks: {
		href: string;
		limit: number;
		next: string | null;
		offset: number;
		previous: string | null;
		total: number;
		items: PlaylistTrack[];
	};
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