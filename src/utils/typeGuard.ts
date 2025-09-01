import { type Playlist } from "../types/collection/playlistTypes";
import { type Album } from "../types/collection/albumTypes";
import { type FullArtist } from "../types/collection/artistTypes";
import { type ArtistTracks } from "../types/collection/artistTypes";

export type Collection = Playlist | Album | FullArtist | ArtistTracks;

type TypedCollection = Playlist | Album | FullArtist;

export function isCollectionOfType<T extends TypedCollection>(
	collection: Collection,
	type: T["type"]
): collection is T {
	return "type" in collection && collection.type === type;
}

export function isArtistTracks(collection: any): collection is ArtistTracks {
	return collection && "tracks" in collection && Array.isArray(collection.tracks);
}