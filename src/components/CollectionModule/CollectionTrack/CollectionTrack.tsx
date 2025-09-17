import trackStyles from './CollectionTrack.module.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type NormalizedTrack } from '../../../utils/normalize';

import { useSelector } from 'react-redux';
import { type RootState } from '../../../store';

import { formatDuration } from '../../../utils/formatDuration'
import { formatDate } from '../../../utils/formatDate'

interface CollectionTrackProps {
	playTrack: (uri: string, availableMarkets: string[]) => void;
	sortViewMode: 'List' | 'Compact';
	track: NormalizedTrack;
	index: number;
	displayedIn: 'playlist' | 'album' | 'artist' | 'search';
	selectedTrackState: string | null;
	setSelectedTrackState: (id: string) => void;
}

export default function CollectionTrack({ playTrack, sortViewMode, track, index, displayedIn, selectedTrackState, setSelectedTrackState }: CollectionTrackProps) {
	const { currentTrackUri, isPlaying } = useSelector((state: RootState) => state.player);
	const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
	const navigate = useNavigate();

	return (
		<tr
			key={`${track.track.id}-${track.added_at ?? index}`}
			className={`
    								${selectedTrackState === track.track.id ? trackStyles.selectedTrack : trackStyles.track}
    								${track.track.available_markets.length === 0 ? trackStyles.unavailableTrack : ''}
  									`}
			onClick={() => {
				setSelectedTrackState(track.track.id)
			}}
			onMouseEnter={() => setHoveredTrack(track.track.id)}
			onMouseLeave={() => setHoveredTrack(null)}
		>
			<th
				className={trackStyles.trackNumber}
				onClick={() => playTrack(track.track.uri, track.track.available_markets)}
			>
				{displayedIn === 'search' ? (
					<div className={trackStyles.coverWrapper}>
						<img
							className={trackStyles.trackCover}
							src={
								track.track.album?.images?.[2]?.url ??
								track.track.album?.images?.[0]?.url ??
								'/default-cover.png'
							}
							alt={track.track.name}
						/>
						{(currentTrackUri === track.track.uri && track.track.available_markets.length > 0) ||
							(hoveredTrack === track.track.id && track.track.available_markets.length > 0) ||
							(selectedTrackState === track.track.id && track.track.available_markets.length > 0) ? (
							<button className={trackStyles.playOverlay}>
								<img
									src={
										isPlaying && currentTrackUri === track.track.uri
											? '/Track/pause.svg'
											: '/Track/play.svg'
									}
									alt="play"
								/>
							</button>
						) : null}
					</div>
				) : (
					<>
						{(currentTrackUri === track.track.uri && track.track.available_markets.length > 0) ||
							(hoveredTrack === track.track.id && track.track.available_markets.length > 0) ||
							(selectedTrackState === track.track.id && track.track.available_markets.length > 0) ? (
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
							<span
								className={
									currentTrackUri === track.track.uri
										? trackStyles.trackActive
										: selectedTrackState === track.track.id
											? trackStyles.selectedTrack
											: ''
								}
							>
								{index + 1}
							</span>
						)}
					</>
				)}
			</th>
			{/* Track Info */}
			{sortViewMode === 'Compact' && (
				<th className={trackStyles.trackInfoCompact}><span className={
					currentTrackUri === track.track.uri
						? trackStyles.trackActive
						: selectedTrackState === track.track.id
							? trackStyles.selectedTrackName
							: trackStyles.trackNameCompact
				}>
					{track.track.name}
				</span></th>
			)}
			{/* Track Information */}
			{sortViewMode === 'List' && (
				<th className={trackStyles.trackImg}>
					{/* Track Cover */}
					{displayedIn !== 'album' && displayedIn !== 'search' && (
						<img
							className={trackStyles.trackCover}
							src={
								track.track.album?.images?.[2]?.url ?? track.track.album?.images?.[0]?.url ?? '/default-cover.png'
							}
							alt={track.track.name}
						/>
					)}
					{/* Track Info */}
					<div className={trackStyles.trackInfo}>
						{/* Track Name */}
						<span className={
							currentTrackUri === track.track.uri
								? trackStyles.trackActive
								: selectedTrackState === track.track.id
									? trackStyles.selectedTrackName
									: trackStyles.trackName
						}>
							{track.track.name}
						</span>
						{/* Track Artists */}
						{displayedIn !== 'artist' && (
							<ul className={trackStyles.trackArtistList}>
								{track.track.artists.map((artist, index) => (
									<li className={trackStyles.trackArtist} key={artist.id || index} onClick={() => navigate(`/artist/${artist.id}`)}>
										{artist.name}
										{index < track.track.artists.length - 1 && ', '}
									</li>
								))}
							</ul>
						)}
					</div>
				</th>
			)}
			{/* Track Artist */}
			{displayedIn === 'playlist' && sortViewMode === 'Compact' && (
				<th className={trackStyles.trackInfoCompact}>
					<ul className={trackStyles.trackArtistList}>
						{track.track.artists.map((artist, index) => (
							<li className={trackStyles.trackArtist} key={artist.id || index} onClick={() => navigate(`/artist/${artist.id}`)}>
								{artist.name}
								{index < track.track.artists.length - 1 && ', '}
							</li>
						))}
					</ul>
				</th>
			)}
			{/* Track Album */}
			{displayedIn === 'playlist' && <th className={trackStyles.trackAlbum} onClick={() => navigate(`/album/${track.track.album?.id}`)}><span>{track.track.album?.name ?? 'Unknown Album'}</span></th>}
			{/* Track Date */}
			{displayedIn === 'playlist' && <th className={trackStyles.trackDate}><span>{track.added_at ? formatDate(track.added_at) : '-'}</span></th>}
			{/* Track Duration */}
			<th className={trackStyles.trackDuration}><span>{formatDuration(track.track.duration_ms)}</span></th>
		</tr>
	)
}