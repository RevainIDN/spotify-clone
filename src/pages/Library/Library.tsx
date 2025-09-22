import libraryStyles from './Library.module.css'
import { useState, useEffect, useMemo } from 'react'
import { getUserPlaylists, getUserFollowingAlbums, getUserFollowingArtists } from '../../services/User/userContent';
import { type UserPlaylistsResponse, type UserAlbumsResponse, type UserFollowedArtistsResponse } from '../../types/user/userCollectionsTypes';

import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../store';
import { setNavigation } from '../../store/general';

import PlaylistSection from '../../components/SectionModule/PlaylistSection/PlaylistSection';
import AlbumsSection from '../../components/SectionModule/AlbumsSection/AlbumsSection';
import ArtistSection from '../../components/SectionModule/ArtistSection/ArtistSection';
import { mapPlaylistToSimplified, mapArtistToSimplified, mapSavedAlbumToSimplified } from '../../services/Selections/selections';
import { type SimplifiedMappedPlaylistItem, type SimplifiedMappedAlbumItem, type SimplifiedMappedArtistItem } from '../../types/collection/generalTypes';

import Loader from '../../components/common/Loader';

const filterValues = [
	{ type: 'Playlist' },
	{ type: 'Album' },
	{ type: 'Artist' }
]

export default function Library() {
	const [selectedFilter, setSelectedFilter] = useState<string>('Playlist');
	const [userPlaylists, setUserPlaylists] = useState<UserPlaylistsResponse | null>(null);
	const [userAlbums, setUserAlbums] = useState<UserAlbumsResponse | null>(null);
	const [userArtists, setUserArtists] = useState<UserFollowedArtistsResponse | null>(null);

	const dispatch = useDispatch<AppDispatch>();
	const token = useSelector((state: RootState) => state.auth.accessToken);

	useEffect(() => {
		if (selectedFilter === 'Playlist') {
			const fetchPlaylists = async () => {
				try {
					const data = await getUserPlaylists(token);
					setUserPlaylists(data);
				} catch (error) {
					console.error("Failed to fetch playlists:", error);
				}
			}
			fetchPlaylists();
		}

		if (selectedFilter === 'Album') {
			const fetchAlbums = async () => {
				try {
					const data = await getUserFollowingAlbums(token);
					setUserAlbums(data);
				} catch (error) {
					console.error(error);
				}
			}
			fetchAlbums();
		}

		if (selectedFilter === 'Artist') {
			const fetchArtists = async () => {
				try {
					const data = await getUserFollowingArtists(token);
					setUserArtists(data)
				} catch (error) {
					console.error(error)
				}
			}
			fetchArtists();
		}

		dispatch(setNavigation('library'))
	}, [token, selectedFilter])

	const simplifiedPlaylists = useMemo(() => {
		return userPlaylists?.items
			.map(mapPlaylistToSimplified)
			.filter(Boolean) as SimplifiedMappedPlaylistItem[];
	}, [userPlaylists]);

	const simplifiedAlbums = useMemo(() => {
		return userAlbums?.items
			.map(mapSavedAlbumToSimplified)
			.filter(Boolean) as SimplifiedMappedAlbumItem[];
	}, [userAlbums]);

	const simplifiedArtists = useMemo(() => {
		return userArtists?.artists.items
			.map(mapArtistToSimplified)
			.filter(Boolean) as SimplifiedMappedArtistItem[];
	}, [userArtists]);

	if (
		(selectedFilter === 'Playlist' && !userPlaylists) ||
		(selectedFilter === 'Album' && !userAlbums) ||
		(selectedFilter === 'Artist' && !userArtists)
	) {
		return <Loader />
	}

	return (
		<div className={`${libraryStyles.library} ${libraryStyles.section}`}>
			<div className={libraryStyles.filters}>
				<ul className={libraryStyles.filterList}>
					{filterValues.map(filter => (
						<li
							key={filter.type}
							className={libraryStyles.filterItem}
							style={selectedFilter === filter.type ? { backgroundColor: '#333333' } : { backgroundColor: '' }}
							onClick={() => setSelectedFilter(filter.type)}
						>
							{filter.type}
						</li>
					))}
				</ul>
			</div>
			<div className={libraryStyles.collections}>
				{selectedFilter === 'Playlist' && (
					<PlaylistSection
						title='Playlists'
						sectionKey='user-playlists'
						items={simplifiedPlaylists}
					/>
				)}
				{selectedFilter === 'Album' && (
					<AlbumsSection
						title='Following Albums'
						sectionKey='following-albums'
						items={simplifiedAlbums}
					/>
				)}
				{selectedFilter === 'Artist' && (
					<ArtistSection
						title='Following Artists'
						sectionKey='user-following-artists'
						items={simplifiedArtists}
					/>
				)}
			</div>
		</div>
	)
}