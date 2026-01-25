import libraryStyles from './Library.module.css'
import { useState, useEffect, useMemo } from 'react'
import { getUserPlaylists, getUserFollowingAlbums, getUserFollowingArtists } from '../../services/User/userContent';
import { type UserPlaylistsResponse, type UserAlbumsResponse, type UserFollowedArtistsResponse } from '../../types/user/userCollectionsTypes';
import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../store';
import { setNavigation } from '../../store/general';
import { setAccessToken } from '../../store/authSlice';
import { resetUserState } from '../../store/userSlice';
import { redirectToSpotifyLogin } from '../../services/authSpotify';

import PlaylistSection from '../../components/SectionModule/PlaylistSection/PlaylistSection';
import AlbumsSection from '../../components/SectionModule/AlbumsSection/AlbumsSection';
import ArtistSection from '../../components/SectionModule/ArtistSection/ArtistSection';
import { mapPlaylistToSimplified, mapArtistToSimplified, mapSavedAlbumToSimplified } from '../../mappers';
import { type SimplifiedMappedPlaylistItem, type SimplifiedMappedAlbumItem, type SimplifiedMappedArtistItem } from '../../types/collection/generalTypes';

import Loader from '../../components/common/Loader';

const filterValues = [
	{ type: 'Playlist' },
	{ type: 'Album' },
	{ type: 'Artist' }
]

export default function Library() {
	// Текущий выбранный фильтр для отображения (Playlist/Album/Artist)
	const [selectedFilter, setSelectedFilter] = useState<string>('Playlist');
	// Плейлисты, альбомы и артисты текущего пользователя
	const [userPlaylists, setUserPlaylists] = useState<UserPlaylistsResponse | null>(null);
	const [userAlbums, setUserAlbums] = useState<UserAlbumsResponse | null>(null);
	const [userArtists, setUserArtists] = useState<UserFollowedArtistsResponse | null>(null);
	// Флаги для управления состоянием загрузки
	const [loading, setLoading] = useState<boolean>(false);
	const [initialLoading, setInitialLoading] = useState(true);
	// Управление видимостью выпадающего меню профиля
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

	const dispatch = useDispatch<AppDispatch>();
	const token = useSelector((state: RootState) => state.auth.accessToken);
	const userProfileData = useSelector((state: RootState) => state.user.userProfileData);

	useEffect(() => {
		// Загружает соответствующие данные в зависимости от выбранного фильтра
		const fetchData = async () => {
			if (!token) return;

			setLoading(true);

			try {
				// Загружает плейлисты пользователя при выборе фильтра Playlist
				if (selectedFilter === 'Playlist') {
					const data = await getUserPlaylists(token);
					setUserPlaylists(data);
				}

				// Загружает сохранённые альбомы при выборе фильтра Album
				if (selectedFilter === 'Album') {
					const data = await getUserFollowingAlbums(token);
					setUserAlbums(data);
				}

				// Загружает подписанных артистов при выборе фильтра Artist
				if (selectedFilter === 'Artist') {
					const data = await getUserFollowingArtists(token);
					setUserArtists(data);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false)
				setInitialLoading(false)
			}
		};

		if (token) {
			fetchData();
		}

		dispatch(setNavigation('library'));
	}, [token, selectedFilter, dispatch]);

	const simplifiedPlaylists = useMemo(() => {
		return userPlaylists?.items
			.map(mapPlaylistToSimplified)
			.filter(Boolean) as SimplifiedMappedPlaylistItem[] ?? [];
	}, [userPlaylists]);

	const simplifiedAlbums = useMemo(() => {
		return userAlbums?.items
			.map(mapSavedAlbumToSimplified)
			.filter(Boolean) as SimplifiedMappedAlbumItem[] ?? [];
	}, [userAlbums]);

	const simplifiedArtists = useMemo(() => {
		return userArtists?.artists.items
			.map(mapArtistToSimplified)
			.filter(Boolean) as SimplifiedMappedArtistItem[] ?? [];
	}, [userArtists]);

	const logout = () => {
		localStorage.removeItem('spotify_access_token');
		localStorage.removeItem('spotify_refresh_token');

		dispatch(setAccessToken(null));
		dispatch(resetUserState());

		redirectToSpotifyLogin();
	};

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
				{token && userProfileData && (
					<div
						className={libraryStyles.userProfile}
						onClick={() => setIsDropdownOpen((prev) => !prev)}
					>
						<div className={libraryStyles.userCoverContainer}>
							{userProfileData?.images?.length > 0 ? (
								<img
									className={libraryStyles.userCover}
									src={userProfileData?.images[0].url}
									alt={userProfileData?.display_name}
								/>
							) : (
								<div className={libraryStyles.userDefaulCover}>{userProfileData?.display_name.slice(0, 1).toUpperCase()}</div>
							)}
						</div>
						<span className={libraryStyles.userName}>{userProfileData?.display_name}</span>
						<div className={libraryStyles.userDropdown}></div>
						{isDropdownOpen && (
							<ul className={libraryStyles.dropdown}>
								<Link className={libraryStyles.dropdownItem} to={'/me'}>Profile</Link>
								<li className={libraryStyles.dropdownItem} onClick={logout}>Exit</li>
							</ul>
						)}
					</div>
				)}
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
				{initialLoading && loading && (
					<div className={libraryStyles.loader}>
						<Loader />
					</div>
				)}
			</div>
		</div>
	)
}