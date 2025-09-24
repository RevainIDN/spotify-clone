import { type Playlist } from "../types/collection/categoriesPlaylistsTypes";
import { type SimplifiedMappedPlaylistItem } from "../types/collection/generalTypes";

export const mapPlaylistToSimplified = (playlist: Playlist | null): SimplifiedMappedPlaylistItem | null => {
	if (!playlist) return null;
	return {
		id: playlist.id,
		name: playlist.name,
		images: playlist.images,
		description: playlist.description,
		ownerName: playlist.owner.display_name,
		artists: [],
		type: 'playlist'
	};
};