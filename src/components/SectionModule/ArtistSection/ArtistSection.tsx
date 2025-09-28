import artistSectionStyles from './ArtistSection.module.css'
import { useNavigate } from 'react-router-dom';
import { type SimplifiedMappedArtistItem } from '../../../types/collection/generalTypes';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../store';

interface ArtistSectionProps {
	title: string;
	sectionKey: string;
	items: SimplifiedMappedArtistItem[];
}

function ArtistItem({ artist }: { artist: SimplifiedMappedArtistItem }) {
	const navigate = useNavigate();

	const handleClick = () => {
		if (artist.type === 'artist') {
			navigate(`/artist/${artist.id}`);
			return;
		}
	};

	return (
		<li onClick={handleClick} className={artistSectionStyles.artistItem}>
			<img className={artistSectionStyles.artistImage} src={artist.images[0]?.url} alt={artist.name} />
			<span className={artistSectionStyles.artistTitle}>{artist.name}</span>
			<span className={artistSectionStyles.artistType}>{artist.type && 'Artist'}</span>
		</li>
	);
}

export default function ArtistSection({ title, sectionKey, items }: ArtistSectionProps) {
	const navigation = useSelector((state: RootState) => state.general.navigation);
	const navigate = useNavigate();

	return (
		<div className={artistSectionStyles.artistSection}>
			{navigation !== 'library' && (
				<div className={artistSectionStyles.header}>
					<h1 className={artistSectionStyles.title}>{title}</h1>
					<button onClick={() => navigate(`/section/${sectionKey}`, { state: { title, items } })} className={artistSectionStyles.showAll}>Show all</button>
				</div>
			)}
			<ul className={artistSectionStyles.artists}>
				{navigation !== 'library' ? items.slice(0, 5).map(artist => (
					<ArtistItem key={artist.id} artist={artist} />
				))
					:
					items.map(artist => (
						<ArtistItem key={artist.id} artist={artist} />
					))}
			</ul>
		</div>
	);
}