import playlist from './Playlist.module.css'

import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../../store';
import { setCurrentTrack } from '../../store/playerSlice';

import { formatDate } from '../../utils/formatDate';
import { formatDuration } from '../../utils/formatDuration';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { getPlaylist } from '../../services/Catalog/playlists';
import { type Playlist } from '../../types/playlists/playlistTypes';

import Loader from '../../components/common/Loader';

export default function Playlist() {
	const [selectedTrack, setSelectedTrack] = useState<string>('');
	const [hoveredTrack, setHoveredTrack] = useState<string | null>('');
	const [playlistData, setPlaylistData] = useState<Playlist>();
	const [isPlaying, setIsPlaying] = useState(false);

	const dispatch = useDispatch<AppDispatch>();
	const token = useSelector((state: RootState) => state.auth.accessToken)
	const { deviceId, player, currentTrackUri } = useSelector((state: RootState) => state.player);
	const { id } = useParams();

	const totalListeningTime = () => {
		const totalTime = filteredTracks.reduce((acc, track) => acc + track.track.duration_ms, 0);
		return formatDuration(totalTime);
	}

	const playTrack = async (uri: string, availableMarkets: string[]) => {
		if (!player || !deviceId || !token) {
			console.warn('Плеер ещё не готов или отсутствует deviceId/token');
			return;
		}

		if (availableMarkets.length === 0) {
			return;
		}

		try {
			const state = await player.getCurrentState();
			const currentUri = state?.track_window.current_track.uri;

			if (currentUri === uri) {
				if (state?.paused) {
					await player.resume();
				} else {
					await player.pause();
				}
				setIsPlaying(prev => !prev);
			} else {
				await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
					method: 'PUT',
					body: JSON.stringify({ uris: [uri] }),
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				});
				setIsPlaying(true);
				dispatch(setCurrentTrack(uri));
			}
		} catch (error) {
			console.error('Ошибка при переключении воспроизведения:', error);
		}
	};

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

	const filteredTracks = playlistData?.tracks.items.filter(track =>
		track.track &&
		track.track.album &&
		track.track.album.images && track.track.album.images[2] &&
		track.track.name &&
		track.track.artists && track.track.artists.length > 0 &&
		track.track.album.name &&
		track.added_at &&
		track.track.duration_ms
	) || [];

	if (!playlistData) {
		return <Loader />;
	}

	return (
		<div className={playlist.playlist}>
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
						<button className={playlist.playBtn}><img src="/Options/play.svg" alt="Play" /></button>
						<button className={playlist.mixBtn}><img src="/Options/mix.svg" alt="Mix" /></button>
						<button className={playlist.addBtn}><img src="/Options/add.svg" alt="Add" /></button>
					</div>
					<div className={playlist.filters}>
						<button className={playlist.findBtn}><img src="/Options/find.svg" alt="Find" /></button>
						<button className={playlist.typeBtn}>Custom order <div className={playlist.dropdownArrow}></div></button>
					</div>
				</div>
				<table className={playlist.tracks}>
					<colgroup>
						<col style={{ width: '5%' }} />
						<col style={{ width: '35%' }} />
						<col style={{ width: '35%' }} />
						<col style={{ width: '20%' }} />
						<col style={{ width: '5%' }} />
					</colgroup>
					<thead className={playlist.tableHead}>
						<tr>
							<th>#</th>
							<th>TITLE</th>
							<th>ALBUM</th>
							<th>DATE ADDED</th>
							<th>TIME</th>
						</tr>
					</thead>
					<tbody>
						{filteredTracks.map((track, index) => (
							<tr
								key={track.track.id}
								className={`
    								${selectedTrack === track.track.id ? playlist.selectedTrack : playlist.track}
    								${track.track.available_markets.length === 0 ? playlist.unavailableTrack : ''}
  									`}
								onClick={() => {
									setSelectedTrack(track.track.id)
								}}
								onMouseEnter={() => setHoveredTrack(track.track.id)}
								onMouseLeave={() => setHoveredTrack(null)}
							>
								<th className={playlist.trackNumber} onClick={() => playTrack(track.track.uri, track.track.available_markets)}>
									{selectedTrack === track.track.id && track.track.available_markets.length > 0 ||
										hoveredTrack === track.track.id && track.track.available_markets.length > 0 ? (
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
										<span className={currentTrackUri === track.track.uri ? playlist.trackActive : ''}>{index + 1}</span>
									)}
								</th>
								<th className={playlist.trackImg}>
									<img
										className={playlist.trackCover}
										src={track.track.album.images[2].url}
										alt={track.track.name}
									/>
									<div className={playlist.trackInfo}>
										<span className={currentTrackUri === track.track.uri ? playlist.trackActive : playlist.trackName}>{track.track.name}</span>
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