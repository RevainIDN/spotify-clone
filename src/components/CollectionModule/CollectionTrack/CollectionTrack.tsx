import trackStyles from './CollectionTrack.module.css'
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

// Отдельная строка трека в таблице коллекции с поддержкой разных режимов отображения и функциями лайка и добавления в плейлист.
export default function CollectionTrack({ playTrack, sortViewMode, track, index, displayedIn, selectedTrackState, setSelectedTrackState, isLiked, onToggleLike }: CollectionTrackProps) {
	const { currentTrackUri, isPlaying } = useSelector((state: RootState) => state.player);
	const { openedDropdown } = useSelector((state: RootState) => state.dropdown);
	const dispatch = useDispatch<AppDispatch>();

	const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
	const dropdownButtonRef = useRef<HTMLButtonElement | null>(null);
	const navigate = useNavigate();
	const location = useLocation();

	// Проверяет, открыт ли дропдаун добавления в плейлист для данного трека.
	const isDropdownOpen =
		openedDropdown?.uri === track.track.uri &&
		openedDropdown?.source === 'list'

	// Закрывает дропдаун при изменении маршрута.
	useEffect(() => {
		dispatch(closeDropdown());
	}, [location.pathname, dispatch]);

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
			{/* Столбец с номером трека или обложкой (в зависимости от контекста) */}
			<th
				className={trackStyles.trackNumber}
				onClick={() => playTrack(track.track.uri, track.track.available_markets)}
			>
				{/* В поиске показываем обложку трека вместо номера */}
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
							/* Показываем кнопку Play/Pause поверх обложки при наведении/выборе трека */
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
						{/* При наведении/выборе трека показываем кнопку Play/Pause, иначе показываем номер трека с разным стилем в зависимости от состояния */}
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
							/* Номер трека меняет цвет: зелёный если это текущий трек, определённый цвет если это выбранный трек, иначе стандартный */
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
			{/* В режиме Compact показываем только название трека с динамическим стилем */}
			{sortViewMode === 'Compact' && (
				<th className={trackStyles.trackInfoCompact}><span className={
					/* Текущий трек зелёный, выбранный трек имеет определённый стиль, иначе обычный */
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
			{/* В режиме List показываем подробную информацию: обложка, название, артист и другие детали */}
			{sortViewMode === 'List' && (
				<th className={trackStyles.trackImg}>
					{/* Track Cover - скрывается для альбомов и поиска, так как обложка там одна для всех треков */}
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
						{/* Название трека меняет цвет в зависимости от состояния: зелёный если текущий, определённый цвет если выбранный */}
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
						{/* Артисты показываются только если это не страница артиста (чтобы избежать дублирования) */}
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
			{/* Артисты показываются в отдельной колонке в режиме Compact только для плейлистов */}
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
			{/* Колонка с альбомом показывается только для плейлистов и профиля, так как в альбоме все треки принадлежат одному альбому */}
			{(displayedIn === 'playlist' || displayedIn === 'my-profile') && <th className={trackStyles.trackAlbum}><span onClick={() => navigate(`/album/${track.track.album?.id}`)}>{track.track.album?.name ?? 'Unknown Album'}</span></th>}
			{/* Track Date */}
			{/* Дата добавления показывается только для плейлистов */}
			{displayedIn === 'playlist' && <th className={trackStyles.trackDate}><span>{track.added_at ? formatDate(track.added_at) : '-'}</span></th>}
			{/* Track Duration */}
			<th className={trackStyles.trackDuration}>
				<span>{formatDuration(track.track.duration_ms)}</span>
				{(selectedTrackState === track.track.id || hoveredTrack === track.track.id) && (
					<div className={trackStyles.trackOptions}>
						<button
							className={trackStyles.addToPlaylist}
							style={track.track.available_markets.length === 0 ? { opacity: '0', cursor: 'default' } : { opacity: '1' }}
							ref={dropdownButtonRef}
							onClick={(e) => {
								if (track.track.available_markets.length === 0) return;
								e.stopPropagation();
								dispatch(toggleDropdown({ uri: track.track.uri, source: 'list' }));
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