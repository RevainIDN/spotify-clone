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

// Таблица треков коллекции с поддержкой фильтрации, сортировки, лайков и воспроизведения.
export default function CollectionTrackList({ collectionData, isShuffled, filterValue, sortType, sortOrder, sortViewMode }: CollectionTrackListProps) {
	const [selectedTrackState, setSelectedTrackState] = useState<string | null>(null);

	const { playTrack } = usePlaybackControls({
		collectionData,
		isShuffled
	});

	// Нормализует треки для унификации структуры данных из разных типов коллекций.
	const tracks = useMemo(() => {
		return collectionData ? normalizeTracks(collectionData) : [];
	}, [collectionData]);

	// Определяет, является ли коллекция плейлистом для отображения дополнительной информации (альбом, дата добавления).
	const isPlaylist = !isArtistTracks(collectionData) && collectionData.type === 'playlist';

	// Получение статусов лайков для всех треков коллекции по их индексам.
	const trackIds = useMemo(() => tracks.map(track => track.track.id), [tracks]);

	const { likedTracks, toggleLike } = useLikedTracks(trackIds);

	// Фильтрует треки по названию, артисту или альбому в соответствии с поисковым запросом (игнорируя регистр).
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

	// Сортирует отфильтрованные треки по выбранному критерию (Title/Artist/Album/Date added/Duration/Custom order) и направлению.
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
					{/* Колонки таблицы имеют разную ширину в зависимости от типа коллекции и режима отображения */}
					<col style={isPlaylist ? { width: '5%' } : { width: '4%' }} />
					<col style={isPlaylist ? (sortViewMode === 'Compact' ? { width: '20%' } : { width: '35%' }) : { width: '90%' }} />
					{/* Колонка артиста показывается только в режиме Compact для плейлистов */}
					{isPlaylist ? (sortViewMode === 'Compact' && <col style={{ width: '20%' }} />) : null}
					{/* Колонка альбома показывается для плейлистов */}
					{isPlaylist ? <col style={sortViewMode === 'List' ? { width: '35%' } : { width: '25%' }} /> : null}
					{/* Колонка даты добавления показывается для плейлистов */}
					{isPlaylist ? <col style={sortViewMode === 'List' ? { width: '20%' } : { width: '15%' }} /> : null}
					<col style={{ width: '5%' }} />
				</colgroup>
				<thead className={trackListStyles.tableHead}>
					<tr>
						<th>#</th>
						<th>TITLE</th>
						{/* Заголовки колонок появляются только если они нужны для текущего режима */}
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

						// Получаем статус лайка для текущего трека по индексу в массиве
						const isLiked = likedTracks?.[index] ?? false;

						return (
							<CollectionTrack
								key={`${track.track.id}-${track.added_at ?? index}`}
								playTrack={playTrack}
								sortViewMode={sortViewMode}
								track={track}
								index={index}
								// Передаём информацию о контексте отображения (плейлист или альбом) для условного рендера
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