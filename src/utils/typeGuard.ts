import { type Playlist } from "../types/collection/playlistTypes";
import { type Album } from "../types/collection/albumTypes";
import { type FullArtist } from "../types/collection/artistTypes";
import { type ArtistTracks } from "../types/collection/artistTypes";
import { type UserProfile } from "../types/user/userProfileTypes";
import { type UserPublicProfile } from "../types/user/userPublicProfileTypes";

export type Collection = Playlist | Album | FullArtist | ArtistTracks | UserProfile | UserPublicProfile;

type TypedCollection = Playlist | Album | FullArtist;

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