import section from './Section.module.css'
import { useLocation } from 'react-router-dom';
import { type SimplifiedMappedPlaylistItem } from '../../types/playlists/generalTypes';

export default function Section() {
	const { state } = useLocation();

	console.log(state);

	return (
		<div className={section.section}>
			<h1 className={section.title}>{state.title}</h1>
			<ul className={section.list}>
				{state.items.map((playlist: SimplifiedMappedPlaylistItem) => (
					<li className={section.item}>
						<img className={section.playlistImage} src={playlist.images[0]?.url} alt={playlist.name} />
						<span className={section.playlistTitle}>{playlist.name}</span>
						<span className={section.playlistDescription}>
							{playlist.ownerName}
						</span>
					</li>
				))}
			</ul>
		</div>
	)
}