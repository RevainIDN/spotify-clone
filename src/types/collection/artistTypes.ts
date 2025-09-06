import { type Image, type Artist, type Track } from "./generalTypes";

export interface FullArtist extends Artist {
	followers: {
		href: string | null;
		total: number;
	};
	genres: string[];
	images: Image[];
	popularity: number;
}

export interface ArtistTracks {
	tracks: Track[];
}

export interface ArtistAlbums {
	href: string;
	items: ArtistAlbumItems[];
	limit: number;
	next: string;
	offset: number;
	previous: string;
	total: number;
}

export interface ArtistAlbumItems {
	album_type: string;
	total_tracks: number;
	available_markets: string[];
	external_urls: {
		spotify: string;
	};
	href: string;
	id: string;
	images: Image[];
	name: string;
	release_date: string;
	release_date_precision: string;
	restrictions?: {
		reason: string;
	};
	type: string;
	uri: string;
	artists: Artist[];
	album_group?: string;
}