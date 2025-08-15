import playlist from './Playlist.module.css'

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { usePlaybackControls } from '../../hooks/usePlaybackControls';

import { useSelector } from 'react-redux';
import { type RootState } from '../../store';

import { formatDate } from '../../utils/formatDate';
import { formatDuration } from '../../utils/formatDuration';
import { getPlaylist } from '../../services/Catalog/playlists';
import { type Playlist } from '../../types/playlists/playlistTypes';

import Loader from '../../components/common/Loader';

export default function Playlist() {
	// Состояния плеера
	const [playlistData, setPlaylistData] = useState<Playlist>();
	const [selectedTrackState, setSelectedTrackState] = useState<string | null>(null);
	const [isShuffled, setIsShuffled] = useState<boolean>(false);

	// Состояния наведения
	const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
	const [hoveredOption, setHoveredOption] = useState<string | null>(null);

	// Состояние фильтрации
	const [filterValue, setFilterValue] = useState<string>('');

	// Состояние выпадающего списка
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const [sortType, setSortType] = useState<string>('Custom order');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [sortViewMode, setSortViewMode] = useState<'List' | 'Compact'>('List');

	// Состояние авторизации
	const token = useSelector((state: RootState) => state.auth.accessToken)
	const { currentTrackUri, isPlaying } = useSelector((state: RootState) => state.player);
	const { id } = useParams();

	// Управление воспроизведением
	const { playPlaylist, playTrack } = usePlaybackControls({
		playlistData,
		isShuffled
	});

	// Получение данных плейлиста
	useEffect(() => {
		if (!token || !id) {
			console.warn('Token или ID отсутствует');
			return;
		}

		const fetchData = async () => {
			try {
				const data = await getPlaylist(token, id) as Playlist;
				setPlaylistData(data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();

	}, [token, id])

	// Получение общего времени прослушивания
	const totalListeningTime = () => {
		const totalTime = filteredValues.reduce((acc, track) => acc + track.track.duration_ms, 0);
		return formatDuration(totalTime);
	}

	// Обработка изменения сортировки
	const handleSortChange = (value: string) => {
		if (value === sortType) {
			setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortType(value);
			setSortOrder('asc');
		}
		setIsDropdownOpen(false);
	};

	// Фильтрация треков
	const filteredValues = (playlistData?.tracks.items || []).filter(track => {
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

	// Значения сортировки
	const sortValues = [
		{ title: 'Sorting', type: 'Category' },
		{ title: 'Custom order', type: 'Default' },
		{ title: 'Title', type: 'Sorting' },
		{ title: 'Artist', type: 'Sorting' },
		{ title: 'Album', type: 'Sorting' },
		{ title: 'Date added', type: 'Sorting' },
		{ title: 'Duration', type: 'Sorting' },
		{ title: 'View mode', type: 'Category' },
		{ title: 'Compact', type: 'View mode' },
		{ title: 'List', type: 'View mode' }
	];

	// Найти текущий трек
	const existingTrack = filteredValues.find(track => track.track.uri === currentTrackUri);

	if (!playlistData) {
		return <Loader />;
	}

	return (
		<div className={playlist.playlist}>
			<img className={playlist.background} src={playlistData?.images[0].url} alt="background" />
			<div className={playlist.header}>
				<img className={playlist.cover} src={playlistData?.images[0].url} alt={playlistData?.name} />
				<div className={playlist.playlistInfo}>
					<h3 className={playlist.type}>{playlistData?.public ? 'Public Playlist' : 'Non-public playlist'}</h3>
					<h1 className={playlist.name}>{playlistData?.name}</h1>
					<div className={playlist.aboutInfo}>
						<span className={playlist.artist}>{playlistData?.owner.display_name}</span>
						<div className={playlist.delimiter}></div>
						<span className={playlist.numberSongs}>
							{playlistData?.tracks.items.length} {playlistData?.tracks.items.length === 1 ? 'song' : 'songs'}
						</span>
						<div className={playlist.delimiter}></div>
						<span className={playlist.totalTime}>{totalListeningTime()}</span>
					</div>
				</div>
			</div>
			<div className={playlist.main}>
				<div className={playlist.options}>
					<div className={playlist.trackOptions}>
						<button className={playlist.playBtn} onClick={playPlaylist}><img src={isPlaying && existingTrack ? "/Options/pause.svg" : "/Options/play.svg"} alt="Play" /></button>
						<button
							className={playlist.mixBtn}
							onClick={() => { setIsShuffled(prev => !prev) }}
						>
							<svg width="46" height="37" viewBox="0 0 46 37" fill="none" xmlns="http://www.w3.org/2000/svg" onMouseEnter={() => setHoveredOption('shuffle')} onMouseLeave={() => setHoveredOption(null)}>
								<path d="M36.2969 22.4561C37.0696 21.6522 38.3221 21.6521 39.0947 22.4561L45.0449 28.6504C45.2361 28.8496 45.2362 29.172 45.0449 29.3711L39.0947 35.5645C38.322 36.3688 37.0696 36.3687 36.2969 35.5645C35.5241 34.7601 35.5241 33.4558 36.2969 32.6514L39.4482 29.3711C39.6394 29.1721 39.6393 28.8495 39.4482 28.6504L36.2969 25.3692C35.5241 24.5648 35.5241 23.2604 36.2969 22.4561ZM34.4639 9.88185H26.873C25.3039 9.88185 23.8107 10.6371 22.7773 11.9541L8.06836 30.7031C6.34617 32.8982 3.85749 34.1572 1.24219 34.1572H0V30.1113H1.24219C2.81137 30.1113 4.30458 29.3551 5.33789 28.0381L20.0479 9.29005C21.77 7.09499 24.2577 5.83497 26.873 5.83497H34.4639V9.88185ZM23.1846 24.4541C24.182 25.7298 25.6231 26.4619 27.1377 26.4619H34.4648V30.3809H27.1377C24.6133 30.3809 22.2112 29.1614 20.5488 27.0352L17.2324 22.8281L19.9531 19.9961L23.1846 24.4541ZM2.4834 3.94728C5.00763 3.94728 7.40897 5.16704 9.07129 7.29298L13.5195 12.6797L10.8838 15.2764L6.43652 9.87404C5.43912 8.59831 3.99804 7.86622 2.4834 7.86622H0.000976562V3.94728H2.4834ZM36.2969 1.47755C37.0696 0.673172 38.322 0.673173 39.0947 1.47755L45.0449 7.67091C45.2361 7.87006 45.2362 8.19252 45.0449 8.39161L39.0947 14.585C38.322 15.3893 37.0696 15.3893 36.2969 14.585C35.5241 13.7806 35.5241 12.4763 36.2969 11.6719L39.4482 8.39161C39.6394 8.19254 39.6393 7.87003 39.4482 7.67091L36.2969 4.38966C35.5241 3.5853 35.5242 2.28194 36.2969 1.47755Z" fill={isShuffled ? '#1ED760' : hoveredOption === 'shuffle' ? '#FFFFFF' : '#FFFFFFB2'} />
							</svg>
						</button>
						<button className={playlist.addBtn}><img src="/Options/add.svg" alt="Add" /></button>
					</div>
					<div className={playlist.filters}>
						<div className={playlist.findInputWrapper}>
							<input
								className={playlist.findInput}
								value={filterValue}
								onChange={(e) => setFilterValue(e.target.value)}
								type="text"
								placeholder='Search in playlist'
							/>
							<img className={playlist.findIcon} src="/Options/find.svg" alt="Find" />
						</div>
						<button
							className={playlist.typeBtn}
							onClick={() => setIsDropdownOpen(prev => !prev)}
						>
							{sortType} <div className={playlist.dropdownArrow}></div>
						</button>
						{isDropdownOpen &&
							<ul className={playlist.dropdownList}>

								{sortValues.map((value) => (
									<li
										key={value.title}
										className={value.type === 'Category' ? playlist.dropdownItemTitle : playlist.dropdownItem}
										onClick={() => {
											if (value.type === 'Category') return;

											if (value.type === 'View mode') {
												setSortViewMode(value.title === 'List' ? 'List' : 'Compact');
											}

											if (value.type === 'Sorting' || value.type === 'Default') {
												handleSortChange(value.title);
											}
										}}
										style={{
											color:
												(value.type === 'Sorting' && sortType === value.title) ||
													(value.type === 'Default' && sortType === value.title) ||
													(value.type === 'View mode' && sortViewMode === value.title)
													? '#1ED760'
													: '#FFFFFF',
										}}
									>
										{value.title}
										{value.type === 'Sorting' && sortType === value.title && (
											<img
												src={sortOrder === 'asc' ? "/Options/arrow-down.svg" : "/Options/arrow-up.svg"}
												alt="Check"
											/>
										)}

										{value.type === 'Default' && sortType === value.title && (
											<img src="/Options/check.svg" alt="Check" />
										)}

										{value.type === 'View mode' && sortViewMode === value.title && (
											<img src="/Options/check.svg" alt="Check" />
										)}
									</li>
								))}
							</ul>}
					</div>
				</div>
				<table className={playlist.tracks}>
					<colgroup>
						<col style={sortViewMode === 'List' ? { width: '5%' } : { width: '5%' }} />
						<col style={sortViewMode === 'List' ? { width: '35%' } : { width: '30%' }} />
						{sortViewMode === 'Compact' && <col style={{ width: '25%' }} />}
						<col style={sortViewMode === 'List' ? { width: '35%' } : { width: '25%' }} />
						<col style={sortViewMode === 'List' ? { width: '20%' } : { width: '15%' }} />
						<col style={sortViewMode === 'List' ? { width: '5%' } : { width: '5%' }} />
					</colgroup>
					<thead className={playlist.tableHead}>
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
    								${selectedTrackState === track.track.id ? playlist.selectedTrack : playlist.track}
    								${track.track.available_markets.length === 0 ? playlist.unavailableTrack : ''}
  									`}
								onClick={() => {
									setSelectedTrackState(track.track.id)
								}}
								onMouseEnter={() => setHoveredTrack(track.track.id)}
								onMouseLeave={() => setHoveredTrack(null)}
							>
								<th className={playlist.trackNumber} onClick={() => playTrack(track.track.uri, track.track.available_markets)}>
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
												? playlist.trackActive
												: selectedTrackState === track.track.id
													? playlist.selectedTrack
													: ''
										}>
											{index + 1}
										</span>
									)}
								</th>
								{sortViewMode === 'Compact' && (
									<th className={playlist.trackInfoCompact}><span className={
										currentTrackUri === track.track.uri
											? playlist.trackActive
											: selectedTrackState === track.track.id
												? playlist.selectedTrackName
												: playlist.trackNameCompact
									}>
										{track.track.name}
									</span></th>
								)}
								{sortViewMode === 'List' && (
									<th className={playlist.trackImg}>
										<img
											className={playlist.trackCover}
											src={track.track.album.images[2].url}
											alt={track.track.name}
										/>
										<div className={playlist.trackInfo}>
											<span className={
												currentTrackUri === track.track.uri
													? playlist.trackActive
													: selectedTrackState === track.track.id
														? playlist.selectedTrackName
														: playlist.trackName
											}>
												{track.track.name}
											</span>
											<ul className={playlist.trackArtistList}>
												{track.track.artists.map((artist, index) => (
													<li className={playlist.trackArtist} key={artist.id || index}>
														{artist.name}
														{index < track.track.artists.length - 1 && ', '}
													</li>
												))}
											</ul>
										</div>
									</th>
								)}
								{sortViewMode === 'Compact' && (
									<th className={playlist.trackInfoCompact}>
										<ul className={playlist.trackArtistList}>
											{track.track.artists.map((artist, index) => (
												<li className={playlist.trackArtist} key={artist.id || index}>
													{artist.name}
													{index < track.track.artists.length - 1 && ', '}
												</li>
											))}
										</ul>
									</th>
								)}
								<th className={playlist.trackAlbum}><span>{track.track.album.name}</span></th>
								<th className={playlist.trackDate}><span>{formatDate(track.added_at)}</span></th>
								<th className={playlist.trackDuration}><span>{formatDuration(track.track.duration_ms)}</span></th>
							</tr>
						))}
					</tbody>
				</table>

			</div>
		</div>
	)
}