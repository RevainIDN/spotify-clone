import { type ArtistAlbumItems } from "../types/collection/artistTypes";
import { type SimplifiedMappedAlbumItem } from "../types/collection/generalTypes";

// Преобразует полные данные альбома в упрощённый формат для отображения
export const mapAlbumToSimplified = (album: ArtistAlbumItems | null): SimplifiedMappedAlbumItem | null => {
	if (!album) return null;
	return {
		album_group: album.album_group,
		album_type: album.album_type,
		id: album.id,
		name: album.name,
		images: album.images,
		release_date: album.release_date,
		type: 'album'
	};
};