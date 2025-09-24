import { type FullArtist } from "../types/collection/artistTypes";
import { type SimplifiedMappedArtistItem } from "../types/collection/generalTypes";

export const mapArtistToSimplified = (artist: FullArtist | null): SimplifiedMappedArtistItem | null => {
	if (!artist) return null;
	return {
		id: artist.id,
		name: artist.name,
		images: artist.images,
		popularity: artist.popularity,
		type: artist.type
	};
}