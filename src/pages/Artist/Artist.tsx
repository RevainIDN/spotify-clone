import artistStyles from './Artist.module.css'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePlaybackControls } from '../../hooks/usePlaybackControls';

import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../../store';
import { setNavigation } from '../../store/general';
import { formatDuration } from '../../utils/formatDuration';

import { getArtist, getArtistTopTracks, getArtistAlbums } from '../../services/Catalog/artists';
import { type FullArtist, type ArtistTracks, type ArtistAlbums } from '../../types/collection/artistTypes';

import { type SimplifiedMappedAlbumItem } from '../../types/collection/generalTypes';
import { mapAlbumToSimplified } from '../../services/Selections/selections';

import CollectionHeader from '../../components/CollectionModule/CollectionHeader/CollectionHeader'
import CollectionControls from '../../components/CollectionModule/CollectionControls/CollectionControls';
import AlbumsSection from '../../components/AlbumsSection/AlbumsSection';
import Loader from '../../components/common/Loader';

export default function Artist() {
	const [artistData, setArtistData] = useState<FullArtist | null>(null);
	const [topTracks, setTopTracks] = useState<ArtistTracks | null>(null);
	const [artistMusic, setArtistMusic] = useState<ArtistAlbums | null>(null);
	const [isShuffled, setIsShuffled] = useState<boolean>(false);

	const { currentTrackUri, isPlaying } = useSelector((state: RootState) => state.player);
	const [selectedTrackState, setSelectedTrackState] = useState<string | null>(null);
	const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

	const token = useSelector((state: RootState) => state.auth.accessToken);
	const { id } = useParams();

	const dispatch = useDispatch<AppDispatch>();

	const { playTrack } = usePlaybackControls({
		collectionData: topTracks || undefined,
		isShuffled
	});

	useEffect(() => {
		if (!token || !id) {
			console.warn('Token или ID отсутствует');
			return;
		}

		const fetchData = async () => {
			try {
				const data = await getArtist(token, id);
				const topTracksData = await getArtistTopTracks(token, id);
				const artistMusic = await getArtistAlbums(token, id);
				setArtistData(data);
				setTopTracks(topTracksData);
				setArtistMusic(artistMusic);
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
		dispatch(setNavigation('album'));
	}, [token, id])

	if (!artistData || !topTracks) {
		return <Loader />
	}

	return (
		<div className={artistStyles.artistContainer}>
			<CollectionHeader collectionData={artistData} />
			<div className={artistStyles.main}>
				<CollectionControls
					collectionData={topTracks}
					isShuffled={isShuffled}
					setIsShuffled={setIsShuffled}
				/>
				<table className={artistStyles.topTracks}>
					<colgroup>
						<col style={{ width: '5%' }} />
						<col style={{ width: '90%' }} />
						<col style={{ width: '5%' }} />
					</colgroup>
					<thead className={artistStyles.tableHead}>
						<tr>
							<th>#</th>
							<th>TITLE</th>
							<th>TIME</th>
						</tr>
					</thead>
					<tbody className={artistStyles.tableBody}>
						{topTracks.tracks.map((track, index) => {
							if (!track) {
								return null;
							}

							return (
								<tr
									key={`${track.id}-${index}`}
									className={`
    								${selectedTrackState === track.id ? artistStyles.selectedTrack : artistStyles.track}
    								${track.available_markets.length === 0 ? artistStyles.unavailableTrack : ''}
  									`}
									onClick={() => {
										setSelectedTrackState(track.id)
									}}
									onMouseEnter={() => setHoveredTrack(track.id)}
									onMouseLeave={() => setHoveredTrack(null)}
								>
									<th className={artistStyles.trackNumber} onClick={() => playTrack(track.uri, track.available_markets)}>
										{currentTrackUri === track.uri && track.available_markets.length > 0 ||
											hoveredTrack === track.id && track.available_markets.length > 0 ||
											selectedTrackState === track.id && track.available_markets.length > 0 ? (
											<button>
												<img
													src={
														isPlaying && currentTrackUri === track.uri
															? '/Track/pause.svg'
															: '/Track/play.svg'
													}
													alt="play"
												/>
											</button>
										) : (
											<span className={
												currentTrackUri === track.uri
													? artistStyles.trackActive
													: selectedTrackState === track.id
														? artistStyles.selectedTrack
														: ''
											}>
												{index + 1}
											</span>
										)}
									</th>
									<th className={artistStyles.trackImg}>
										<img
											className={artistStyles.trackCover}
											src={
												track.album?.images?.[2]?.url ?? track.album?.images?.[0]?.url ?? '/default-cover.png'
											}
											alt={track.name}
										/>
										<div className={artistStyles.trackInfo}>
											<span className={
												currentTrackUri === track.uri
													? artistStyles.trackActive
													: selectedTrackState === track.id
														? artistStyles.selectedTrackName
														: artistStyles.trackName
											}>
												{track.name}
											</span>
										</div>
									</th>
									<th className={artistStyles.trackDuration}><span>{formatDuration(track.duration_ms)}</span></th>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
			<div className={artistStyles.artistMusic}>
				<AlbumsSection
					title='Music'
					sectionKey='artist-music'
					items={
						artistMusic
							? artistMusic.items
								.map(mapAlbumToSimplified)
								.filter(Boolean) as SimplifiedMappedAlbumItem[]
							: []
					}
				/>
			</div>
		</div>
	)
}