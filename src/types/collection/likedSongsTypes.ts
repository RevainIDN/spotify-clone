// Типы для коллекции "Лайкнутые песни"

import { type Track } from "./generalTypes";

export interface SavedTrack {
	added_at: string;
	track: Track;
}

export interface LikedTracksResponse {
	href: string;
	items: SavedTrack[];
	limit: number;
	next: string | null;
	offset: number;
	previous: string | null;
	total: number;
}

export interface LikedSongsCollection {
	type: "playlist";
	id: string;
	name: string;
	description?: string;
	tracks: {
		items: SavedTrack[];
		total: number;
	};
}