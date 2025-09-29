import sidebar from './Sidebar.module.css'
import { Link } from 'react-router-dom'

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../../store';
import { setNavigation } from '../../store/general';

import { getUserPlaylists } from '../../services/User/userContent';
import { type UserPlaylistsResponse } from '../../types/user/userCollectionsTypes';

export default function Sidebar() {
	const [userPlaylists, setUserPlaylists] = useState<UserPlaylistsResponse | null>(null);
	const [selectedUserPlaylist, setSelectedUserPlaylist] = useState<string | null>(null);

	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const navigation = useSelector((state: RootState) => state.general.navigation);
	const token = useSelector((state: RootState) => state.auth.accessToken);

	const handleUserPlaylist = (playlistName: string, playlistId: string) => {
		setSelectedUserPlaylist(playlistName)
		navigate(`/playlist/${playlistId}`)
	}

	useEffect(() => {
		const fetchUserPlaylists = async () => {
			const data = await getUserPlaylists(token)
			setUserPlaylists(data)
		}
		fetchUserPlaylists();
	}, [token])

	useEffect(() => {
		navigation !== 'playlist' && setSelectedUserPlaylist(null);
	}, [navigation])

	return (
		<div className={sidebar.sidebar}>
			<Link to={'/'} className={sidebar.logoLink} onClick={() => dispatch(setNavigation('home'))}>
				<img className={sidebar.logo} src="/Sidebar/logo.svg" alt="logo" />
			</Link>
			<div className={sidebar.menu}>
				<ul className={sidebar.menuList}>
					<Link
						to={'/'}
						className={sidebar.menuItem}
						onClick={() => dispatch(setNavigation('home'))}
						style={navigation === 'home' ? { color: 'var(--white)' } : { color: 'var(--gray-light)' }}
					>
						<img
							className={sidebar.menuIcon}
							src={navigation === 'home' ? "/Sidebar/home-active.svg" : "/Sidebar/home.svg"}
							alt="H"
						/>
						Home
					</Link>
					<Link
						to={'/search'}
						className={sidebar.menuItem}
						onClick={() => dispatch(setNavigation('search'))}
						style={navigation === 'search' ? { color: 'var(--white)' } : { color: 'var(--gray-light)' }}
					>
						<img
							className={sidebar.menuIcon}
							src={navigation === 'search' ? "/Sidebar/search-active.svg" : "/Sidebar/search.svg"}
							alt="S"
						/>
						Search
					</Link>
					<Link
						to={'/library'}
						className={sidebar.menuItem}
						onClick={() => dispatch(setNavigation('library'))}
						style={navigation === 'library' ? { color: 'var(--white)' } : { color: 'var(--gray-light)' }}
					>
						<img
							className={sidebar.menuIcon}
							src={navigation === 'library' ? "/Sidebar/library-active.svg" : "/Sidebar/library.svg"}
							alt="L"
						/>
						Your Library
					</Link>
				</ul>
				<ul className={sidebar.menuList}>
					<li
						className={sidebar.menuItem}
						onClick={() => dispatch(setNavigation('create-playlist'))}
						style={navigation === 'create-playlist' ? { color: 'var(--white)' } : { color: 'var(--gray-light)' }}
					>
						<img
							className={sidebar.menuIcon}
							src="/Sidebar/create-playlist.svg"
							alt="P"
						/>
						Create Playlist
					</li>
					<li
						className={sidebar.menuItem}
						onClick={() => dispatch(setNavigation('liked-songs'))}
						style={navigation === 'liked-songs' ? { color: 'var(--white)' } : { color: 'var(--gray-light)' }}
					>
						<img
							className={sidebar.menuIcon}
							src="/Sidebar/liked-songs.svg"
							alt="S"
						/>
						Liked Songs
					</li>
				</ul>
				<ul className={sidebar.playlistList}>
					{userPlaylists?.items.map(playlist => (
						<li
							className={sidebar.playlistItem}
							key={playlist.id}
							onClick={() => handleUserPlaylist(playlist.name, playlist.id)}
							style={selectedUserPlaylist === playlist.name ? { color: 'var(--white)' } : { color: 'var(--gray-light)' }}
						>
							<span className={sidebar.playlistItemText}>{playlist.name}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}