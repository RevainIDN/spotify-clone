import { type Track } from "../types/collection/generalTypes";
import { type SimplifiedMappedTrackItem } from "../types/collection/generalTypes";

// Преобразует полные данные трека в упрощённый формат для отображения
export const mapTrackToSimplified = (track: Track | null): SimplifiedMappedTrackItem | null => {
	if (!track) return null;
	return {
		id: track.id,
		name: track.name,
		images: track.album.images,
		duration_ms: track.duration_ms,
		uri: track.uri,
		available_markets: track.available_markets,
		album: {
			id: track.album.id,
		},
		artists: track.artists.map((artist: any) => ({
			id: artist.id,
			name: artist.name,
			type: artist.type
		})),
		type: 'track'
	};
};