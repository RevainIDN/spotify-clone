export interface SimplifiedMappedPlaylistItem {
	id: string;
	name: string;
	images: Image[];
	description?: string;
	ownerName: string;
}

export interface Image {
	height: number | null;
	url: string;
	width: number | null;
}

export interface Artist {
	external_urls: {
		spotify: string;
	};
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
}