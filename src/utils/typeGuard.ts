import { type Playlist } from "../types/collection/playlistTypes";
import { type Album } from "../types/collection/albumTypes";

export type Collection = Playlist | Album;

export function isCollectionOfType<T extends Collection>(
	collection: Collection,
	type: T["type"]
): collection is T {
	return collection.type === type;
}