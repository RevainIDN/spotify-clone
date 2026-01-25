import { type SavedAlbumObject } from "../types/user/userCollectionsTypes";
import { type SimplifiedMappedAlbumItem } from "../types/collection/generalTypes";

// Преобразует сохранённый альбом (из библиотеки пользователя) в упрощённый формат
export const mapSavedAlbumToSimplified = (saved: SavedAlbumObject | null): SimplifiedMappedAlbumItem | null => {
	if (!saved) return null;
	const album = saved.album;
	return {
		album_group: undefined,
		album_type: album.album_type,
		id: album.id,
		name: album.name,
		images: album.images,
		release_date: album.release_date,
		type: "album"
	};
};