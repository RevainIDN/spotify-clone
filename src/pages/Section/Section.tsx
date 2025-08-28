import section from './Section.module.css'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { type SimplifiedMappedPlaylistItem } from '../../types/collection/generalTypes';

function Item({ playlist }: { playlist: SimplifiedMappedPlaylistItem }) {
	const navigate = useNavigate();

	const handleClick = () => {
		switch (playlist.type) {
			case 'playlist':
				navigate(`/playlist/${playlist.id}`);
				break;
			case 'album':
				navigate(`/album/${playlist.id}`);
				break;
		}
	};

	const handleArtist = async (e: React.MouseEvent, name: string) => {
		e.stopPropagation();
		const artist = playlist.artists.find(a => a.name === name);

		if (artist) {
			navigate(`/artist/${artist.id}`);
		}
	};

	return (
		<li key={playlist.id} className={section.item} onClick={handleClick}>
			<img className={section.playlistImage} src={playlist.images[0]?.url} alt={playlist.name} />
			<span className={section.playlistTitle}>{playlist.name}</span>
			<ul className={section.playlistDescription}>
				{playlist.type === 'playlist'
					? <li className={section.playlistArtist} onClick={(e) => handleArtist(e, playlist.ownerName)}>{playlist.ownerName}</li>
					: playlist.artists.map((artist, index) => <li className={section.playlistArtist} key={artist.id} onClick={(e) => handleArtist(e, artist.name)}>
						{artist.name}
						{index < playlist.artists.length - 1 && ', '}
					</li>)}
			</ul>
		</li>
	)
}

export default function Section() {
	const { state } = useLocation();

	return (
		<div className={section.section}>
			<h1 className={section.title}>{state.title}</h1>
			<ul className={section.list}>
				{state.items.map((playlist: SimplifiedMappedPlaylistItem) => (
					<Item key={playlist.id} playlist={playlist} />
				))}
			</ul>
		</div>
	)
}