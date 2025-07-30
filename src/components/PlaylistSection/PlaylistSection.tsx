import playlistSection from './PlaylistSection.module.css';
import { type SimplifiedMappedPlaylistItem } from '../../types/playlists/generalTypes';

interface PlaylistSectionProps {
	title: string;
	items: SimplifiedMappedPlaylistItem[];
}

function PlaylistItem({ album }: { album: SimplifiedMappedPlaylistItem }) {
	return (
		<li className={playlistSection.playlistItem}>
			<img className={playlistSection.playlistImage} src={album.images[0]?.url} alt={album.name} />
			<span className={playlistSection.playlistTitle}>{album.name}</span>
			<span className={playlistSection.playlistDescription}>
				{album.ownerName}
			</span>
		</li>
	);
}

export default function PlaylistSection({ title, items }: PlaylistSectionProps) {
	return (
		<div className={playlistSection.playlistSection}>
			<div className={playlistSection.header}>
				<h1 className={playlistSection.title}>{title}</h1>
				<button className={playlistSection.showAll}>Show all</button>
			</div>
			<ul className={playlistSection.playlists}>
				{items.slice(0, 5).map(album => (
					<PlaylistItem key={album.id} album={album} />
				))}
			</ul>
		</div>
	);
}