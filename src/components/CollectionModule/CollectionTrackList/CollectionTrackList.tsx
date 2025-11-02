import trackListStyles from './CollectionTrackList.module.css'
import { type Collection } from '../../../utils/typeGuard';
import { normalizeTracks } from '../../../utils/normalize';
import { useState, useEffect } from 'react';
import { usePlaybackControls } from '../../../hooks/usePlaybackControls';
import { isArtistTracks } from '../../../utils/typeGuard';

import { checkLikedTracks } from '../../../services/User/likedTracks';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../store';

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
	const [isTracksLiked, setIsTracksLiked] = useState<boolean[] | null>(null);

	const token = useSelector((state: RootState) => state.auth.accessToken);

	const { playTrack } = usePlaybackControls({
		collectionData,
		isShuffled
	});

	// Нормализация треков
	const tracks = collectionData ? normalizeTracks(collectionData) : []

	const isPlaylist = !isArtistTracks(collectionData) && collectionData.type === 'playlist';

	useEffect(() => {
		if (!token) return;

		const tracksId = tracks.map(track => track.track.id);

		const checkIfTrackIsLiked = async () => {
			try {
				const response = await checkLikedTracks(token, tracksId);
				setIsTracksLiked(response);
			} catch (error) {
				console.error('Ошибка при проверке лайка трека:', error);
			}
		};

		checkIfTrackIsLiked();
	}, [token, tracks]);

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

					const isLiked = isTracksLiked ? isTracksLiked[index] : false;

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
						/>
					)
				})}
			</tbody>
		</table>
	)
}