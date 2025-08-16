import { type Image, type Artist, type Track, type TracksBase } from "./generalTypes";

export interface Album {
	album_type: string;
	total_tracks: number;
	available_markets: string[];
	external_urls: ExternalUrls;
	href: string;
	id: string;
	images: Image[];
	name: string;
	release_date: string;
	release_date_precision: string;
	restrictions?: Restrictions;
	type: string;
	uri: string;
	artists: Artist[];
	tracks: TracksBase<Track>;
	copyrights: Copyright[];
	external_ids: ExternalIds;
	genres: string[];
	label: string;
	popularity: number;
}

export interface ExternalUrls {
	spotify: string;
}

export interface Restrictions {
	reason: string;
}

export interface Tracks {
	href: string;
	limit: number;
	next: string | null;
	offset: number;
	previous: string | null;
	total: number;
	items: Track[];
}

export interface Copyright {
	text: string;
	type: string;
}

export interface ExternalIds {
	isrc?: string;
	ean?: string;
	upc?: string;
}