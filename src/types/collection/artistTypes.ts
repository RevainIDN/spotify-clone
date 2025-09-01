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