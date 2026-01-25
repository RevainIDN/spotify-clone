import playlistSection from './PlaylistSection.module.css';
import { useState } from 'react';
import { type SimplifiedMappedPlaylistItem } from '../../../types/collection/generalTypes';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../store';

import PlayButton from '../../common/PlayButton';

interface PlaylistSectionProps {
	title: string;
	sectionKey: string;
	items: SimplifiedMappedPlaylistItem[];
}

// Отдельный элемент плейлиста с изображением обложки и информацией владельца.
function PlaylistItem({ playlist }: { playlist: SimplifiedMappedPlaylistItem }) {
	const navigate = useNavigate();
	const [isHovered, setIsHovered] = useState(false);
	// Использует изображение из плейлиста или показывает дефолтное изображение, если оно отсутствует.
	const coverUrl = playlist.images?.[0]?.url;

	return (
		<li
			onClick={() => { navigate(`/playlist/${playlist.id}`) }}
			className={playlistSection.playlistItem}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className={playlistSection.playlistImageContainer}>
				<img className={playlistSection.playlistImage} src={coverUrl ?? "/Collection/default-cover.jpg"} alt={playlist.name} />
				<PlayButton playlistId={playlist.id} isHovered={isHovered} />
			</div>
			<span className={playlistSection.playlistTitle}>{playlist.name}</span>
			<ul className={playlistSection.playlistDescription}>
				<li className={playlistSection.playlistArtist}>{playlist.ownerName}</li>
			</ul>
		</li>
	);
}

// Секция с плейлистами, отображающая ограниченный список на главной странице или полный список в библиотеке.
export default function PlaylistSection({ title, sectionKey, items }: PlaylistSectionProps) {
	const navigation = useSelector((state: RootState) => state.general.navigation);
	const navigate = useNavigate();
	// На главной странице показывает первых 5 плейлистов, кнопка "Show all" отображается только если элементов больше 5.
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