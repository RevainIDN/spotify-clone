import sidebar from './Sidebar.module.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar() {
	const [hoveredItem, setHoveredItem] = useState<string | null>(null);

	return (
		<div className={sidebar.sidebar}>
			<Link to={'/'} className={sidebar.logoLink}>
				<img className={sidebar.logo} src="/Sidebar/logo.svg" alt="logo" />
			</Link>
			<div className={sidebar.menu}>
				<ul className={sidebar.menuList}>
					<Link to={'/'} className={sidebar.menuItem} onMouseEnter={() => setHoveredItem('home')} onMouseLeave={() => setHoveredItem(null)}>
						<img className={sidebar.menuIcon} src={hoveredItem === 'home' ? "/Sidebar/home-active.svg" : "/Sidebar/home.svg"} alt="" />Home
					</Link>
					<Link to={'/search'} className={sidebar.menuItem} onMouseEnter={() => setHoveredItem('search')} onMouseLeave={() => setHoveredItem(null)}>
						<img className={sidebar.menuIcon} src={hoveredItem === 'search' ? "/Sidebar/search-active.svg" : "/Sidebar/search.svg"} alt="" />Search
					</Link>
					<Link to={'/library'} className={sidebar.menuItem} onMouseEnter={() => setHoveredItem('library')} onMouseLeave={() => setHoveredItem(null)}>
						<img className={sidebar.menuIcon} src={hoveredItem === 'library' ? "/Sidebar/library-active.svg" : "/Sidebar/library.svg"} alt="" />Your Library
					</Link>
				</ul>
				<ul className={sidebar.menuList}>
					<li className={sidebar.menuItem} onMouseEnter={() => setHoveredItem('create-playlist')} onMouseLeave={() => setHoveredItem(null)}>
						<img className={sidebar.menuIcon} src="/Sidebar/create-playlist.svg" alt="" />Create Playlist
					</li>
					<li className={sidebar.menuItem} onMouseEnter={() => setHoveredItem('liked-songs')} onMouseLeave={() => setHoveredItem(null)}>
						<img className={sidebar.menuIcon} src="/Sidebar/liked-songs.svg" alt="" />Liked Songs
					</li>
				</ul>
				<ul className={sidebar.playlists}>
					<li className={sidebar.playlist}>Jazz</li>
				</ul>
			</div>
		</div>
	)
}