import myProfileStyles from './MyProfile.module.css'
import { useState, useEffect } from 'react'
import { usePlaybackControls } from '../../hooks/usePlaybackControls';

import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../store';
import { setNavigation } from '../../store/general';

import { getUserTopItems } from '../../services/User/userProfile';
import { getUserPlaylists, getUserFollowingArtists } from '../../services/User/userContent';
import { type UserPlaylistsResponse, type UserFollowedArtistsResponse } from '../../types/user/userCollectionsTypes';

import { mapPlaylistToSimplified, mapArtistToSimplified } from '../../mappers';
import { type SimplifiedMappedPlaylistItem, type SimplifiedMappedArtistItem, type Track } from '../../types/collection/generalTypes';

import { type UserTopArtists, type UserTopTracks } from '../../types/user/userProfileTypes';
import { normalizeSingleTrack } from '../../utils/normalize';

import PlaylistSection from '../../components/SectionModule/PlaylistSection/PlaylistSection';
import CollectionHeader from '../../components/CollectionModule/CollectionHeader/CollectionHeader';
import CollectionTrack from '../../components/CollectionModule/CollectionTrack/CollectionTrack';
import ArtistSection from '../../components/SectionModule/ArtistSection/ArtistSection';
import Loader from '../../components/common/Loader';

export default function MyProfile() {
	const [userTopArtists, setUserTopArtists] = useState<UserTopArtists | null>(null);
	const [userTopTracks, setUserTopTracks] = useState<UserTopTracks | null>(null);
	const [userPlaylists, setUserPlaylists] = useState<UserPlaylistsResponse | null>(null);
	const [userArtists, setUserArtists] = useState<UserFollowedArtistsResponse | null>(null);

	const [selectedTrackState, setSelectedTrackState] = useState<string | null>(null);

	const dispatch = useDispatch<AppDispatch>();
	const token = useSelector((state: RootState) => state.auth.accessToken)
	const userProfileData = useSelector((state: RootState) => state.user.userProfileData)

	const { playTrack } = usePlaybackControls({
		collectionData: undefined,
		isShuffled: false
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [profileTopArtists, profileTopTracks, profilePlaylists, profileArtists] = await Promise.all([
					getUserTopItems(token, 'artists'),
					getUserTopItems(token, 'tracks'),
					getUserPlaylists(token),
					getUserFollowingArtists(token),
				]);

				setUserTopArtists(profileTopArtists);
				setUserTopTracks(profileTopTracks);
				setUserPlaylists(profilePlaylists);
				setUserArtists(profileArtists);
			} catch (error) {
				console.error(error);
			}
		};

		if (token) {
			fetchData();
		}

		dispatch(setNavigation('my-profile'))
	}, [token]);

	if (!userProfileData) {
		return <Loader />
	}

	return (
		<div className='content'>
			<CollectionHeader collectionData={userProfileData} playlistCount={userPlaylists?.items.length} />
			<div className={myProfileStyles.main}>
				<ArtistSection
					title='Top artists of this month'
					sectionKey='top-artists'
					items={(userTopArtists?.items
						?.map(mapArtistToSimplified)
						.filter(Boolean) || []) as SimplifiedMappedArtistItem[]}
				/>
				<div className={myProfileStyles.searchedTracks}>
					<h1 className={myProfileStyles.resultTitle}>Top tracks of this month</h1>
					<table className={myProfileStyles.tracks}>
						<colgroup>
							<col style={{ width: '5%' }} />
							<col style={{ width: '45%' }} />
							<col style={{ width: '45%' }} />
							<col style={{ width: '5%' }} />
						</colgroup>
						<tbody>
							{userTopTracks?.items
								.filter((t): t is Track => t !== null)
								.slice(0, 4)
								.map((track, index) => {
									const normalizedTrack = normalizeSingleTrack(track);

									return (
										<CollectionTrack
											key={`${track.id}-${index}`}
											playTrack={playTrack}
											sortViewMode='List'
											track={normalizedTrack}
											index={index}
											displayedIn='my-profile'
											selectedTrackState={selectedTrackState}
											setSelectedTrackState={setSelectedTrackState}
										/>
									);
								})
							}
						</tbody>
					</table>
				</div>
				<PlaylistSection
					title='Open playlists'
					sectionKey='open-playlists'
					items={userPlaylists?.items
						.map(mapPlaylistToSimplified)
						.filter(Boolean) as SimplifiedMappedPlaylistItem[] ?? []}
				/>
				<ArtistSection
					title='Already subscribed'
					sectionKey='already-subscribed'
					items={userArtists?.artists.items
						?.map(mapArtistToSimplified)
						.filter(Boolean) as SimplifiedMappedArtistItem[] ?? []}
				/>
			</div>
		</div>
	)
}