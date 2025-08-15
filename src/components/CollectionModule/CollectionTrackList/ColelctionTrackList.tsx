import trackListStyles from './ColelctionTrackList.module.css'
import { type Playlist } from '../../../types/playlists/playlistTypes'

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../store';
import { usePlaybackControls } from '../../../hooks/usePlaybackControls';

import { formatDate } from '../../../utils/formatDate';
import { formatDuration } from '../../../utils/formatDuration';


interface ColelctionTrackListProps {
	collectionData: Playlist;
	isShuffled: boolean;
	filterValue: string;
	sortType: string;
	sortOrder: 'asc' | 'desc';
	sortViewMode: 'List' | 'Compact';
}

export default function ColelctionTrackList({ collectionData, isShuffled, filterValue, sortType, sortOrder, sortViewMode }: ColelctionTrackListProps) {
	const { currentTrackUri, isPlaying } = useSelector((state: RootState) => state.player);
	const [selectedTrackState, setSelectedTrackState] = useState<string | null>(null);
	const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

	const { playTrack } = usePlaybackControls({
		collectionData,
		isShuffled
	});

	// Фильтрация треков
	const filteredValues = (collectionData?.tracks.items || []).filter(track => {
		if (
			!track.track ||
			!track.track.album?.images?.[2] ||
			!track.track.name ||
			!track.track.artists?.length ||
			!track.track.album.name ||
			!track.added_at ||
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
				return (new Date(a.added_at).getTime() - new Date(b.added_at).getTime()) * direction;
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
				<col style={sortViewMode === 'List' ? { width: '5%' } : { width: '5%' }} />
				<col style={sortViewMode === 'List' ? { width: '35%' } : { width: '30%' }} />
				{sortViewMode === 'Compact' && <col style={{ width: '25%' }} />}
				<col style={sortViewMode === 'List' ? { width: '35%' } : { width: '25%' }} />
				<col style={sortViewMode === 'List' ? { width: '20%' } : { width: '15%' }} />
				<col style={sortViewMode === 'List' ? { width: '5%' } : { width: '5%' }} />
			</colgroup>
			<thead className={trackListStyles.tableHead}>
				<tr>
					<th>#</th>
					<th>TITLE</th>
					{sortViewMode === 'Compact' && <th>ARTIST</th>}
					<th>ALBUM</th>
					<th>DATE ADDED</th>
					<th>TIME</th>
				</tr>
			</thead>
			<tbody>
				{sortedValues.map((track, index) => (
					<tr
						key={track.track.id}
						className={`
    								${selectedTrackState === track.track.id ? trackListStyles.selectedTrack : trackListStyles.track}
    								${track.track.available_markets.length === 0 ? trackListStyles.unavailableTrack : ''}
  									`}
						onClick={() => {
							setSelectedTrackState(track.track.id)
						}}
						onMouseEnter={() => setHoveredTrack(track.track.id)}
						onMouseLeave={() => setHoveredTrack(null)}
					>
						<th className={trackListStyles.trackNumber} onClick={() => playTrack(track.track.uri, track.track.available_markets)}>
							{currentTrackUri === track.track.uri && track.track.available_markets.length > 0 ||
								hoveredTrack === track.track.id && track.track.available_markets.length > 0 ||
								selectedTrackState === track.track.id && track.track.available_markets.length > 0 ? (
								<button>
									<img
										src={
											isPlaying && currentTrackUri === track.track.uri
												? '/Track/pause.svg'
												: '/Track/play.svg'
										}
										alt="play"
									/>
								</button>
							) : (
								<span className={
									currentTrackUri === track.track.uri
										? trackListStyles.trackActive
										: selectedTrackState === track.track.id
											? trackListStyles.selectedTrack
											: ''
								}>
									{index + 1}
								</span>
							)}
						</th>
						{sortViewMode === 'Compact' && (
							<th className={trackListStyles.trackInfoCompact}><span className={
								currentTrackUri === track.track.uri
									? trackListStyles.trackActive
									: selectedTrackState === track.track.id
										? trackListStyles.selectedTrackName
										: trackListStyles.trackNameCompact
							}>
								{track.track.name}
							</span></th>
						)}
						{sortViewMode === 'List' && (
							<th className={trackListStyles.trackImg}>
								<img
									className={trackListStyles.trackCover}
									src={track.track.album.images[2].url}
									alt={track.track.name}
								/>
								<div className={trackListStyles.trackInfo}>
									<span className={
										currentTrackUri === track.track.uri
											? trackListStyles.trackActive
											: selectedTrackState === track.track.id
												? trackListStyles.selectedTrackName
												: trackListStyles.trackName
									}>
										{track.track.name}
									</span>
									<ul className={trackListStyles.trackArtistList}>
										{track.track.artists.map((artist, index) => (
											<li className={trackListStyles.trackArtist} key={artist.id || index}>
												{artist.name}
												{index < track.track.artists.length - 1 && ', '}
											</li>
										))}
									</ul>
								</div>
							</th>
						)}
						{sortViewMode === 'Compact' && (
							<th className={trackListStyles.trackInfoCompact}>
								<ul className={trackListStyles.trackArtistList}>
									{track.track.artists.map((artist, index) => (
										<li className={trackListStyles.trackArtist} key={artist.id || index}>
											{artist.name}
											{index < track.track.artists.length - 1 && ', '}
										</li>
									))}
								</ul>
							</th>
						)}
						<th className={trackListStyles.trackAlbum}><span>{track.track.album.name}</span></th>
						<th className={trackListStyles.trackDate}><span>{formatDate(track.added_at)}</span></th>
						<th className={trackListStyles.trackDuration}><span>{formatDuration(track.track.duration_ms)}</span></th>
					</tr>
				))}
			</tbody>
		</table>
	)
}