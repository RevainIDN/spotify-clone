// Типы для новых релизов Spotify

import { type Image, type Artist } from "./generalTypes";

export interface NewReleasesResponse {
	albums: {
		href: string;
		items: NewReleases[];
		limit: number;
		next: string | null;
		offset: number;
		previous: string | null;
		total: number;
	};
}

export interface NewReleases {
	album_type: string;
	artists: Artist[];
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
	total_tracks: number;
	type: string;
	uri: string;
}