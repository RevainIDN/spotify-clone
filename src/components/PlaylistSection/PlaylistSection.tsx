import playlistSection from './PlaylistSection.module.css';
import { type SimplifiedMappedPlaylistItem } from '../../types/collection/generalTypes';
import { useNavigate } from 'react-router-dom';

interface PlaylistSectionProps {
	title: string;
	sectionKey: string;
	items: SimplifiedMappedPlaylistItem[];
}

function PlaylistItem({ album }: { album: SimplifiedMappedPlaylistItem }) {
	const navigate = useNavigate();

	const handleClick = () => {
		switch (album.type) {
			case 'playlist':
				navigate(`/playlist/${album.id}`);
				break;
			case 'album':
				navigate(`/album/${album.id}`);
				break;
		}
	};

	return (
		<li onClick={handleClick} className={playlistSection.playlistItem}>
			<img className={playlistSection.playlistImage} src={album.images[0]?.url} alt={album.name} />
			<span className={playlistSection.playlistTitle}>{album.name}</span>
			<span className={playlistSection.playlistDescription}>
				{album.ownerName}
			</span>
		</li>
	);
}

export default function PlaylistSection({ title, sectionKey, items }: PlaylistSectionProps) {
	const navigate = useNavigate();
	return (
		<div className={playlistSection.playlistSection}>
			<div className={playlistSection.header}>
				<h1 className={playlistSection.title}>{title}</h1>
				<button onClick={() => navigate(`/section/${sectionKey}`, { state: { title, items } })} className={playlistSection.showAll}>Show all</button>
			</div>
			<ul className={playlistSection.playlists}>
				{items.slice(0, 5).map(album => (
					<PlaylistItem key={album.id} album={album} />
				))}
			</ul>
		</div>
	);
}