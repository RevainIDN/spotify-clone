import { type Playlist } from "../types/collection/categoriesPlaylistsTypes";
import { type SimplifiedMappedPlaylistItem } from "../types/collection/generalTypes";

// Преобразует полные данные плейлиста в упрощённый формат для отображения
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