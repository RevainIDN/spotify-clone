import sidebar from './Sidebar.module.css'
import { Link } from 'react-router-dom'

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../../store';
import { setNavigation } from '../../store/general';
import { setUserPlaylists } from '../../store/userSlice';

import { getUserPlaylists } from '../../services/User/userContent';
import { createPlaylist } from '../../services/Catalog/playlists';

export default function Sidebar() {
	const [selectedUserPlaylist, setSelectedUserPlaylist] = useState<string | null>(null);

	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const navigation = useSelector((state: RootState) => state.general.navigation);
	const token = useSelector((state: RootState) => state.auth.accessToken);
	const userPlaylists = useSelector((state: RootState) => state.user.userPlaylists);
	const userId = useSelector((state: RootState) => state.user.userPlaylists?.items[0]?.owner.id);

	const handleUserPlaylist = (playlistName: string, playlistId: string) => {
		setSelectedUserPlaylist(playlistName)
		navigate(`/playlist/${playlistId}`)
	}

	useEffect(() => {
		if (!token) return;

		const fetchUserPlaylists = async () => {
			const data = await getUserPlaylists(token)
			dispatch(setUserPlaylists(data))
		}
		fetchUserPlaylists();
	}, [token])

	useEffect(() => {
		navigation !== 'playlist' && setSelectedUserPlaylist(null);
	}, [navigation])

	const handleCreatePlaylist = async () => {
		if (userId && token) {
			const result = await createPlaylist(token, userId, `My playlist №${(userPlaylists?.items?.length ?? 0) + 1}`, 'Description');
			if (result) {
				const updatedPlaylists = await getUserPlaylists(token);
				dispatch(setUserPlaylists(updatedPlaylists));
				setSelectedUserPlaylist(result.name);
				navigate(`/playlist/${result.id}`);
				dispatch(setNavigation('playlist'));
			}
		}
	}

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
						onClick={handleCreatePlaylist}
						style={navigation === 'create-playlist' ? { color: 'var(--white)' } : { color: 'var(--gray-light)' }}
					>
						<img
							className={sidebar.menuIcon}
							src="/Sidebar/create-playlist.svg"
							alt="P"
						/>
						Create Playlist
					</li>
					<Link
						to={'/liked-songs'}
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
					</Link>
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