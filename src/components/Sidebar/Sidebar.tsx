import sidebar from './Sidebar.module.css'
import { Link } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../../store';
import { setNavigation } from '../../store/general';

export default function Sidebar() {
	const dispatch = useDispatch<AppDispatch>();
	const navigation = useSelector((state: RootState) => state.general.navigation)

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
				<ul className={sidebar.playlists}>
					<li className={sidebar.playlist}>Jazz</li>
				</ul>
			</div>
		</div>
	)
}