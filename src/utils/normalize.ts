import { type Collection, isCollectionOfType, isArtistTracks } from "./typeGuard"
import { type Playlist, type PlaylistTrack } from "../types/collection/playlistTypes";
import { type Album } from "../types/collection/albumTypes";
import { type Track } from "../types/collection/generalTypes";

export interface NormalizedTrack {
	track: Track;
	added_at: string | null;
}

export function normalizeTracks(collection: Collection): NormalizedTrack[] {
	if (isCollectionOfType<Playlist>(collection, "playlist")) {
		return collection.tracks.items.map((item: PlaylistTrack) => ({
			track: item.track,
			added_at: item.added_at
		}));
	}

	if (isCollectionOfType<Album>(collection, "album")) {
		return collection.tracks.items.map((track: Track) => ({
			track,
			added_at: null
		}));
	}

	if (isArtistTracks(collection)) {
		return collection.tracks.map((track: Track) => ({
			track,
			added_at: null
		}));
	}

	return [];
}