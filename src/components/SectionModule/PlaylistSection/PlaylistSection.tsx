import playlistSection from './PlaylistSection.module.css';
import { type SimplifiedMappedPlaylistItem } from '../../../types/collection/generalTypes';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../store';

interface PlaylistSectionProps {
	title: string;
	sectionKey: string;
	items: SimplifiedMappedPlaylistItem[];
}

function PlaylistItem({ playlist }: { playlist: SimplifiedMappedPlaylistItem }) {
	const navigate = useNavigate();

	return (
		<li onClick={() => { navigate(`/playlist/${playlist.id}`) }} className={playlistSection.playlistItem}>
			<img className={playlistSection.playlistImage} src={playlist.images[0]?.url ?? "/default-cover.jpg"} alt={playlist.name} />
			<span className={playlistSection.playlistTitle}>{playlist.name}</span>
			<ul className={playlistSection.playlistDescription}>
				<li className={playlistSection.playlistArtist}>{playlist.ownerName}</li>
			</ul>
		</li>
	);
}

export default function PlaylistSection({ title, sectionKey, items }: PlaylistSectionProps) {
	const navigation = useSelector((state: RootState) => state.general.navigation);
	const navigate = useNavigate();
	return (
		<div className={playlistSection.playlistSection}>
			{navigation !== 'library' && (
				<div className={playlistSection.header}>
					<h1 className={playlistSection.title}>{title}</h1>
					{items.length > 5 && <button onClick={() => navigate(`/section/${sectionKey}`, { state: { title, items } })} className={playlistSection.showAll}>Show all</button>}
				</div>
			)}
			<ul className={playlistSection.playlists}>
				{navigation !== 'library' ? items.slice(0, 5).map(album => (
					<PlaylistItem key={album.id} playlist={album} />
				))
					:
					items.map(album => (
						<PlaylistItem key={album.id} playlist={album} />
					))}
			</ul>
		</div>
	);
}