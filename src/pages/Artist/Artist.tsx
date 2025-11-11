import artistStyles from './Artist.module.css'
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { usePlaybackControls } from '../../hooks/usePlaybackControls';
import { useLikedTracks } from '../../hooks/useLikedTracks';

import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../../store';
import { setNavigation } from '../../store/general';
import { setIsUserSubscribedToArtist } from '../../store/userSlice';

import { getArtist, getArtistTopTracks, getArtistAlbums } from '../../services/Catalog/artists';
import { type FullArtist, type ArtistTracks, type ArtistAlbums } from '../../types/collection/artistTypes';

import { type SimplifiedMappedAlbumItem } from '../../types/collection/generalTypes';
import { mapAlbumToSimplified } from '../../mappers';

import { getIsUserSubscribedToArtist } from '../../services/User/userActivity';

import CollectionHeader from '../../components/CollectionModule/CollectionHeader/CollectionHeader'
import CollectionControls from '../../components/CollectionModule/CollectionControls/CollectionControls';
import CollectionTrack from '../../components/CollectionModule/CollectionTrack/CollectionTrack';
import AlbumsSection from '../../components/SectionModule/AlbumsSection/AlbumsSection';
import Loader from '../../components/common/Loader';

export default function Artist() {
	const [artistData, setArtistData] = useState<FullArtist | null>(null);
	const [topTracks, setTopTracks] = useState<ArtistTracks | null>(null);
	const [artistMusic, setArtistMusic] = useState<ArtistAlbums | null>(null);
	const [isShuffled, setIsShuffled] = useState<boolean>(false);

	const [selectedTrackState, setSelectedTrackState] = useState<string | null>(null);

	const token = useSelector((state: RootState) => state.auth.accessToken);
	const { id } = useParams();

	const dispatch = useDispatch<AppDispatch>();

	const trackIds = useMemo(() => {
		return topTracks ? topTracks.tracks.map(track => track.id) : [];
	}, [topTracks]);

	const { likedTracks, toggleLike } = useLikedTracks(trackIds);

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

				if (data) {
					const isUserSubscribed = await getIsUserSubscribedToArtist(token, [id]);
					dispatch(setIsUserSubscribedToArtist(isUserSubscribed));
				}
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
		<div className='content'>
			<CollectionHeader collectionData={artistData} />
			<div className={artistStyles.main}>
				<CollectionControls
					collectionData={topTracks}
					isShuffled={isShuffled}
					setIsShuffled={setIsShuffled}
					artistId={artistData.id}
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
							const normalizedTrack = { track, added_at: null };
							if (!track) {
								return null;
							}

							const isLiked = likedTracks[index] ?? false;

							return (
								<CollectionTrack
									key={`${track.id}-${index}`}
									playTrack={playTrack}
									sortViewMode='List'
									track={normalizedTrack}
									index={index}
									displayedIn='artist'
									selectedTrackState={selectedTrackState}
									setSelectedTrackState={setSelectedTrackState}
									isLiked={isLiked}
									onToggleLike={() => toggleLike(track.id, index)}
								/>
							)
						})}
					</tbody>
				</table>
			</div>
			<div className={artistStyles.artistMusic}>
				<AlbumsSection
					title='Music'
					sectionKey='artist-music'
					isFiltered={true}
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