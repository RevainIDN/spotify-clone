import { type Image, type Track, type TracksBase } from "../collection/generalTypes";
import { type FullArtist } from "../collection/artistTypes";

export interface UserProfile {
	country: string;
	display_name: string;
	email: string;
	explicit_content: {
		filter_enabled: boolean;
		filter_locked: boolean;
	};
	external_urls: {
		spotify: string;
	};
	followers: {
		href: string | null;
		total: number;
	};
	href: string;
	id: string;
	images: Image[];
	product: string;
	type: string;
	uri: string;
}

export interface UserTopArtists extends TracksBase<FullArtist> { }
export interface UserTopTracks extends TracksBase<Track> { }