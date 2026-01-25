import { type RawCombinedResults } from "../types/collection/generalTypes";

// Результат поиска с рассчитанным скором релевантности
export type BestResultItem = {
	id: string;
	name: string;
	images: { url: string }[];
	type: string;
	popularity?: number;
	score: number;
	artistName?: string;
	artistId?: string;
	ownerName?: string;
	ownerId?: string;
	uri?: string;
	available_markets?: string[];
};

// Рассчитывает релевантность названия к запросу (от 0.2 до 1.0)
function calcRelevance(name: string, query: string): number {
	const n = name.toLowerCase();
	const q = query.toLowerCase();

	if (n === q) return 1.0;
	if (n.startsWith(q)) return 0.8;
	if (n.includes(q)) return 0.5;
	return 0.2;
}

// Выбирает лучший результат из всех типов поиска (треки, артисты, альбомы, плейлисты) на основе релевантности и популярности
export function pickBestResult(results: RawCombinedResults, query: string): BestResultItem | null {
	if (!results) return null;

	const candidates: BestResultItem[] = [];

	// Tracks
	if (results.tracks?.items?.length > 0) {
		for (const t of results.tracks.items.filter((x): x is NonNullable<typeof x> => !!x)) {
			const relevance = calcRelevance(t.name, query);
			const popularity = Math.min((t.popularity ?? 50) / 100, 1); // 0-1
			const typePriority = 0.05;
			const score = relevance * 0.7 + popularity * 0.3 + typePriority;

			candidates.push({
				id: t.id,
				name: t.name,
				images: t.album?.images ?? [],
				type: "track",
				popularity: t.popularity,
				score,
				uri: t.uri,
				available_markets: t.available_markets
			});
		}
	}

	// Artists
	if (results.artists?.items?.length > 0) {
		for (const a of results.artists.items.filter((x): x is NonNullable<typeof x> => !!x)) {
			const relevance = calcRelevance(a.name, query);
			const popularity = Math.min((a.popularity ?? 50) / 100, 1);
			const typePriority = 0;
			const score = relevance * 0.7 + popularity * 0.3 + typePriority;

			candidates.push({
				id: a.id,
				name: a.name,
				images: a.images ?? [],
				type: "artist",
				popularity: a.popularity,
				score
			});
		}
	}

	// Albums
	if (results.albums?.items?.length > 0) {
		for (const al of results.albums.items.filter((x): x is NonNullable<typeof x> => !!x)) {
			const relevance = calcRelevance(al.name, query);
			const popularity = Math.min((al.popularity ?? 50) / 100, 1);
			const typePriority = 0.03;
			const score = relevance * 0.7 + popularity * 0.3 + typePriority;

			const firstArtist = al.artists?.[0];

			candidates.push({
				id: al.id,
				name: al.name,
				images: al.images ?? [],
				type: "album",
				popularity: al.popularity,
				score,
				artistName: firstArtist?.name,
				artistId: firstArtist?.id
			});
		}
	}

	// Playlists
	if (results.playlists?.items?.length > 0) {
		for (const pl of results.playlists.items.filter((x): x is NonNullable<typeof x> => !!x)) {
			const relevance = calcRelevance(pl.name, query);
			const popularity = 0.3;
			const score = relevance * 0.7 + popularity * 0.3;

			const owner = pl.owner;

			candidates.push({
				id: pl.id,
				name: pl.name,
				images: pl.images ?? [],
				type: "playlist",
				score,
				ownerName: owner?.display_name,
				ownerId: owner?.id
			});
		}
	}

	if (candidates.length === 0) return null;

	candidates.sort((a, b) => b.score - a.score);

	return candidates[0];
}