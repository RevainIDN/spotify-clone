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

// Отдельный элемент артиста с навигацией на его страницу при клике.
function ArtistItem({ artist }: { artist: SimplifiedMappedArtistItem }) {
	const navigate = useNavigate();

	// Навигирует на страницу артиста если тип элемента - артист.
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

// Секция с артистами, отображающая ограниченный список на главной странице или полный список в библиотеке.
export default function ArtistSection({ title, sectionKey, items }: ArtistSectionProps) {
	const navigation = useSelector((state: RootState) => state.general.navigation);
	const navigate = useNavigate();

	// На главной странице показывает первых 5 артистов с кнопкой "Show all", в библиотеке показывает всех.
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