import { type Track } from "../types/collection/generalTypes";
import { type SimplifiedMappedTrackItem } from "../types/collection/generalTypes";

export const mapTrackToSimplified = (track: Track | null): SimplifiedMappedTrackItem | null => {
	if (!track) return null;
	return {
		id: track.id,
		name: track.name,
		images: track.album.images,
		duration_ms: track.duration_ms,
		artists: track.artists.map((artist: any) => ({
			id: artist.id,
			name: artist.name,
			type: artist.type
		})),
		type: 'track'
	};
};