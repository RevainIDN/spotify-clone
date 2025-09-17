import { type Playlist } from './categoriesPlaylistsTypes';
import { type Album } from './albumTypes';
import { type FullArtist } from './artistTypes';

export interface SimplifiedMappedPlaylistItem {
	id: string;
	name: string;
	images: Image[];
	description?: string;
	ownerName: string;
	artists: {
		id: string;
		name: string;
		type: string;
	}[];
	type: 'playlist';
}

export interface SimplifiedMappedAlbumItem {
	album_group: string | undefined;
	album_type: string;
	id: string;
	name: string;
	images: Image[];
	release_date: string;
	type: 'album';
}

export interface SimplifiedMappedArtistItem {
	id: string;
	name: string;
	images: Image[];
	popularity: number;
	type: 'artist';
}

export interface SimplifiedMappedTrackItem {
	id: string;
	name: string;
	images: Image[];
	duration_ms: number;
	artists: {
		id: string;
		name: string;
		type: string;
	}[];
	type: 'track';
}

export type SimplifiedMappedItem =
	| SimplifiedMappedPlaylistItem
	| SimplifiedMappedAlbumItem
	| SimplifiedMappedArtistItem;

export interface RawCombinedResults {
	playlists: {
		href: string;
		items: Playlist[];
	};
	albums: {
		href: string;
		items: Album[];
	};
	artists: {
		href: string;
		items: FullArtist[];
	};
	tracks: {
		href: string;
		items: Track[];
	};
}

export interface CombinedResults {
	playlists: {
		href: string;
		items: SimplifiedMappedPlaylistItem[];
	};
	albums: {
		href: string;
		items: SimplifiedMappedAlbumItem[];
	};
	artists: {
		href: string;
		items: SimplifiedMappedArtistItem[];
	};
	tracks: {
		href: string;
		items: SimplifiedMappedTrackItem[];
	};
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