import { type Playlist } from "../types/collection/playlistTypes";
import { type Album } from "../types/collection/albumTypes";
import { type FullArtist } from "../types/collection/artistTypes";
import { type ArtistTracks } from "../types/collection/artistTypes";
import { type UserProfile } from "../types/user/userProfileTypes";
import { type UserPublicProfile } from "../types/user/userPublicProfileTypes";
import { type LikedSongsCollection } from "../types/collection/likedSongsTypes";

export type Collection = Playlist | Album | FullArtist | ArtistTracks | UserProfile | UserPublicProfile | LikedSongsCollection;

type TypedCollection = Playlist | Album | FullArtist | LikedSongsCollection;

export function isCollectionOfType<T extends TypedCollection>(
	collection: Collection,
	type: T["type"]
): collection is T {
	return "type" in collection && collection.type === type;
}

export function isArtistTracks(collection: unknown): collection is ArtistTracks {
	return (
		typeof collection === "object" &&
		collection !== null &&
		"tracks" in collection &&
		Array.isArray((collection as ArtistTracks).tracks)
	);
}

export function isUserProfile(collection: unknown): collection is UserProfile {
	return (
		typeof collection === "object" &&
		collection !== null &&
		"id" in collection &&
		"display_name" in collection
	);
}

export function isUserPublicProfile(collection: unknown): collection is UserPublicProfile {
	return (
		typeof collection === "object" &&
		collection !== null &&
		"id" in collection &&
		"display_name" in collection &&
		(collection as UserPublicProfile).type === "user" &&
		"followers" in collection
	);
}

export function isLikedSongsCollection(collection: unknown): collection is LikedSongsCollection {
	return (
		typeof collection === "object" &&
		collection !== null &&
		"id" in collection &&
		(collection as LikedSongsCollection).id === "liked-songs" &&
		"tracks" in collection &&
		Array.isArray((collection as LikedSongsCollection).tracks.items)
	);
}