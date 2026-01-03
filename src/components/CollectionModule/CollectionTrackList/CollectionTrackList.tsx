import trackListStyles from './CollectionTrackList.module.css'
import { type Collection } from '../../../utils/typeGuard';
import { normalizeTracks } from '../../../utils/normalize';
import { useState, useMemo } from 'react';
import { usePlaybackControls } from '../../../hooks/usePlaybackControls';
import { useLikedTracks } from '../../../hooks/useLikedTracks';
import { isArtistTracks } from '../../../utils/typeGuard';

import CollectionTrack from '../CollectionTrack/CollectionTrack';

interface CollectionTrackListProps {
	collectionData: Collection;
	isShuffled: boolean;
	filterValue: string;
	sortType: string;
	sortOrder: 'asc' | 'desc';
	sortViewMode: 'List' | 'Compact';
}

export default function CollectionTrackList({ collectionData, isShuffled, filterValue, sortType, sortOrder, sortViewMode }: CollectionTrackListProps) {
	const [selectedTrackState, setSelectedTrackState] = useState<string | null>(null);

	const { playTrack } = usePlaybackControls({
		collectionData,
		isShuffled
	});

	// Нормализация треков
	const tracks = useMemo(() => {
		return collectionData ? normalizeTracks(collectionData) : [];
	}, [collectionData]);

	// Определение типа коллекции
	const isPlaylist = !isArtistTracks(collectionData) && collectionData.type === 'playlist';

	// Получение статусов лайков треков
	const trackIds = useMemo(() => tracks.map(track => track.track.id), [tracks]);

	const { likedTracks, toggleLike } = useLikedTracks(trackIds);

	// Фильтрация треков
	const filteredValues = tracks.filter(track => {
		if (
			!track.track ||
			!track.track.name ||
			!track.track.artists?.length ||
			!track.track.duration_ms
		) {
			return false;
		}

		const search = filterValue.toLowerCase();
		return (
			track.track.name.toLowerCase().includes(search) ||
			track.track.artists.some(artist => artist.name.toLowerCase().includes(search)) ||
			track.track.album.name.toLowerCase().includes(search)
		);
	});

	// Сортировка треков
	const sortedValues = [...filteredValues].sort((a, b) => {
		const direction = sortOrder === 'asc' ? 1 : -1;

		switch (sortType) {
			case 'Title':
				return a.track.name.localeCompare(b.track.name) * direction;
			case 'Artist':
				return a.track.artists[0].name.localeCompare(b.track.artists[0].name) * direction;
			case 'Album':
				return a.track.album.name.localeCompare(b.track.album.name) * direction;
			case 'Date added':
				const aTime = a.added_at ? new Date(a.added_at).getTime() : 0
				const bTime = b.added_at ? new Date(b.added_at).getTime() : 0
				return (aTime - bTime) * direction
			case 'Duration':
				return (a.track.duration_ms - b.track.duration_ms) * direction;
			case 'Custom order':
			default:
				return 0;
		}
	});

	return (
		<>
			<table className={trackListStyles.tracks}>
				<colgroup>
					<col style={isPlaylist ? { width: '5%' } : { width: '4%' }} />
					<col style={isPlaylist ? { width: '35%' } : { width: '90%' }} />
					{isPlaylist ? (sortViewMode === 'Compact' && <col style={{ width: '20%' }} />) : null}
					{isPlaylist ? <col style={sortViewMode === 'List' ? { width: '35%' } : { width: '25%' }} /> : null}
					{isPlaylist ? <col style={sortViewMode === 'List' ? { width: '20%' } : { width: '15%' }} /> : null}
					<col style={{ width: '5%' }} />
				</colgroup>
				<thead className={trackListStyles.tableHead}>
					<tr>
						<th>#</th>
						<th>TITLE</th>
						{isPlaylist && sortViewMode === 'Compact' && <th>ARTIST</th>}
						{isPlaylist && <th>ALBUM</th>}
						{isPlaylist && <th>DATE ADDED</th>}
						<th>TIME</th>
					</tr>
				</thead>
				<tbody>
					{sortedValues.map((track, index) => {
						if (!track.track) {
							return null;
						}

						const isLiked = likedTracks?.[index] ?? false;

						return (
							<CollectionTrack
								key={`${track.track.id}-${track.added_at ?? index}`}
								playTrack={playTrack}
								sortViewMode={sortViewMode}
								track={track}
								index={index}
								displayedIn={isPlaylist ? 'playlist' : 'album'}
								selectedTrackState={selectedTrackState}
								setSelectedTrackState={setSelectedTrackState}
								isLiked={isLiked}
								onToggleLike={() => toggleLike(track.track.id, index)}
							/>
						)
					})}
				</tbody>
			</table>
		</>
	)
}