import { type Playlist } from "../../../types/collection/playlistTypes";
import { type Album } from "../../../types/collection/albumTypes";
import { type FullArtist } from "../../../types/collection/artistTypes";
import { type ArtistTracks } from "../../../types/collection/artistTypes";

export type Collection = Playlist | Album | FullArtist | ArtistTracks;

export interface BaseControlsProps {
	collectionData: Collection;
	isShuffled: boolean;
	setIsShuffled: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TrackCollectionControlsProps extends BaseControlsProps {
	collectionData: Playlist | Album;
	enableFilters?: true;
	filterValue: string;
	setFilterValue: React.Dispatch<React.SetStateAction<string>>;
	sortType: string;
	setSortType: React.Dispatch<React.SetStateAction<string>>;
	sortOrder: "asc" | "desc";
	setSortOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	sortViewMode: "List" | "Compact";
	setSortViewMode: React.Dispatch<React.SetStateAction<"List" | "Compact">>;
	playlistId?: string;
}

export interface ArtistControlsProps extends BaseControlsProps {
	collectionData: ArtistTracks;
	enableFollow?: true;
}

export type CollectionControlsProps =
	| TrackCollectionControlsProps
	| ArtistControlsProps;