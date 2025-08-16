export interface SimplifiedMappedPlaylistItem {
	id: string;
	name: string;
	images: Image[];
	description?: string;
	ownerName: string;
	type: string;
}

export interface Image {
	height: number | null;
	url: string;
	width: number | null;
}

export interface Artist {
	external_urls: {
		spotify: string;
	};
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
}

export interface Track {
	album: {
		album_type: string;
		total_tracks: number;
		available_markets: string[];
		external_urls: {
			spotify: string;
		};
		href: string;
		id: string;
		images: Array<{
			url: string;
			height: number;
			width: number;
		}>;
		name: string;
		release_date: string;
		release_date_precision: string;
		restrictions?: {
			reason: string;
		};
		type: string;
		uri: string;
		artists: Artist[];
	};
	artists: Artist[];
	available_markets: string[];
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: {
		isrc?: string;
		ean?: string;
		upc?: string;
	};
	external_urls: {
		spotify: string;
	};
	href: string;
	id: string;
	is_playable: boolean;
	linked_from?: any;
	restrictions?: {
		reason: string;
	};
	name: string;
	popularity: number;
	preview_url: string | null;
	track_number: number;
	type: string;
	uri: string;
	is_local: boolean;
}

export interface TracksBase<T> {
	href: string;
	limit: number;
	next: string | null;
	offset: number;
	previous: string | null;
	total: number;
	items: T[];
}