import userStyles from './User.module.css'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { getPublicUserProfileData, getPublicUserPlaylistsData } from '../../services/User/userProfile';
import { type UserPublicProfile } from '../../types/user/userPublicProfileTypes';

import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../store';
import { setNavigation } from '../../store/general';

import { mapPlaylistToSimplified } from '../../mappers';
import { type SimplifiedMappedPlaylistItem } from '../../types/collection/generalTypes';
import { type UserPublicPlaylists } from '../../types/user/userPublicProfileTypes';

import CollectionHeader from '../../components/CollectionModule/CollectionHeader/CollectionHeader'
import PlaylistSection from '../../components/SectionModule/PlaylistSection/PlaylistSection';
import Loader from '../../components/common/Loader';

export default function User() {
	const [userData, setUserData] = useState<UserPublicProfile | null>(null);
	const [userPlaylists, setUserPlaylists] = useState<UserPublicPlaylists | null>(null);
	const { id } = useParams();

	const dispatch = useDispatch<AppDispatch>();
	const token = useSelector((state: RootState) => state.auth.accessToken);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const [userData, userPlaylistData] = await Promise.all([
					getPublicUserProfileData(token, id),
					getPublicUserPlaylistsData(token, id)
				])

				setUserData(userData);
				setUserPlaylists(userPlaylistData);
			} catch (error) {
				console.error(error);
			}
		}

		fetchUserData();
		dispatch(setNavigation('user'));
	}, [])

	if (!userData) {
		return <Loader />
	}

	return (
		<div className='content'>
			<CollectionHeader collectionData={userData} playlistCount={userPlaylists?.items.length} />
			<div className={userStyles.main}>
				<PlaylistSection
					title='Open playlists'
					sectionKey='open-playlists'
					items={userPlaylists?.items
						.map(mapPlaylistToSimplified)
						.filter(p => p && p.images?.length > 0) as SimplifiedMappedPlaylistItem[]}
				/>
			</div>
		</div>
	)
}