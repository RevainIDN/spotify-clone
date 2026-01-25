// Типы для треков и недавно прослушанных треков

import { type Track } from './generalTypes';

interface RecentlyPlayedContext {
	type: string;
	href: string;
	external_urls: {
		spotify: string;
	};
	uri: string;
}

interface RecentlyPlayedItem {
	track: Track;
	played_at: string;
	context: RecentlyPlayedContext | null;
}

export interface RecentlyPlayedResponse {
	href: string;
	limit: number;
	next: string | null;
	cursors: {
		after: string | null;
		before: string | null;
	};
	total: number;
	items: RecentlyPlayedItem[];
}