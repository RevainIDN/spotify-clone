import trackStyles from './CollectionTrack.module.css'
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { type NormalizedTrack } from '../../../utils/normalize';

import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../../store';
import { toggleDropdown, closeDropdown } from '../../../store/dropdownSlice';

import { formatDuration } from '../../../utils/formatDuration'
import { formatDate } from '../../../utils/formatDate'

import PlaylistDropdown from '../../common/PlaylistDropdown';

interface CollectionTrackProps {
	playTrack: (uri: string, availableMarkets: string[]) => void;
	sortViewMode: 'List' | 'Compact';
	track: NormalizedTrack;
	index: number;
	displayedIn: 'playlist' | 'album' | 'artist' | 'search' | 'my-profile';
	selectedTrackState: string | null;
	setSelectedTrackState: (id: string) => void;
	isLiked?: boolean;
	onToggleLike?: () => void;
}

export default function CollectionTrack({ playTrack, sortViewMode, track, index, displayedIn, selectedTrackState, setSelectedTrackState, isLiked, onToggleLike }: CollectionTrackProps) {
	const { currentTrackUri, isPlaying } = useSelector((state: RootState) => state.player);
	const { openedDropdownUri } = useSelector((state: RootState) => state.dropdown);
	const dispatch = useDispatch<AppDispatch>();

	const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
	const dropdownButtonRef = useRef<HTMLButtonElement | null>(null);
	const navigate = useNavigate();

	const isDropdownOpen = openedDropdownUri === track.track.uri;

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
			style={sortViewMode === 'Compact' ? { height: '30px' } : {}}
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
							<div className={trackStyles.trackArtistsContainer}>
								<ul className={trackStyles.trackArtistList}>
									{track.track.artists.map((artist, index) => (
										<li className={trackStyles.trackArtist} key={artist.id || index} onClick={() => navigate(`/artist/${artist.id}`)}>
											{artist.name}
											{index < track.track.artists.length - 1 && ', '}
										</li>
									))}
								</ul>
							</div>
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
			{(displayedIn === 'playlist' || displayedIn === 'my-profile') && <th className={trackStyles.trackAlbum}><span onClick={() => navigate(`/album/${track.track.album?.id}`)}>{track.track.album?.name ?? 'Unknown Album'}</span></th>}
			{/* Track Date */}
			{displayedIn === 'playlist' && <th className={trackStyles.trackDate}><span>{track.added_at ? formatDate(track.added_at) : '-'}</span></th>}
			{/* Track Duration */}
			<th className={trackStyles.trackDuration}>
				<span>{formatDuration(track.track.duration_ms)}</span>
				{(selectedTrackState === track.track.id || hoveredTrack === track.track.id) && (
					<div className={trackStyles.trackOptions}>
						<button
							className={trackStyles.addToPlaylist}
							ref={dropdownButtonRef}
							onClick={(e) => {
								e.stopPropagation();
								dispatch(toggleDropdown(track.track.uri));
							}}
						>
							<svg width="16" height="16" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" >
								<rect x="17" y="31" width="24" height="4" rx="2" transform="rotate(-90 17 31)" fill='#FFFFFFB2' />
								<rect x="7" y="17" width="24" height="4" rx="2" fill='#FFFFFFB2' />
								<circle cx="19" cy="19" r="17.75" stroke='#FFFFFFB2' strokeWidth="2.5" />
							</svg>
						</button>
						<button
							className={trackStyles.addToFavorites}
							onClick={(e) => {
								e.stopPropagation();
								onToggleLike?.();
							}}>
							<img
								src={isLiked ? '/Player/favorite-active.svg' : '/Player/add-to-favorite.svg'}
								alt="Add to Fav"
							/>
						</button>
					</div>
				)}
				{isDropdownOpen && (
					<PlaylistDropdown
						trackUri={track.track.uri}
						onClose={() => dispatch(closeDropdown())}
						anchorRef={dropdownButtonRef}
					/>
				)}
			</th>
		</tr>
	)
}