import albumsSectionStyles from './AlbumsSection.module.css'
import { type SimplifiedMappedAlbumItem } from '../../../types/collection/generalTypes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractYear } from '../../../utils/extractYear';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../store';

import PlayButton from '../../common/PlayButton';

interface AlbumsSectionProps {
	title: string;
	sectionKey: string;
	isFiltered?: boolean;
	items: SimplifiedMappedAlbumItem[];
}

// Варианты фильтрации альбомов по типам для отображения в интерфейсе.
const filterValues = [
	{ title: 'Show All', type: 'all' },
	{ title: 'Albums', type: 'album' },
	{ title: 'Singles & EP', type: 'single' },
	{ title: 'Compilations', type: 'compilation' }
]

// Отдельный элемент альбома с отслеживанием состояния при наведении мыши и кнопкой воспроизведения.
function AlbumItem({ album }: { album: SimplifiedMappedAlbumItem }) {
	const navigate = useNavigate();
	const [isHovered, setIsHovered] = useState(false);

	return (
		<li
			onClick={() => { navigate(`/album/${album.id}`) }}
			className={albumsSectionStyles.albumItem}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className={albumsSectionStyles.albumImageContainer}>
				<img className={albumsSectionStyles.albumImage} src={album.images[0]?.url} alt={album.name} />
				<PlayButton albumId={album.id} isHovered={isHovered} />
			</div>
			<span className={albumsSectionStyles.albumTitle}>{album.name}</span>
			<ul className={albumsSectionStyles.albumDescription}>
				<li className={albumsSectionStyles.albumYear}>{extractYear(album.release_date)}</li>
				<li className='delimiter'></li>
				<li className={albumsSectionStyles.albumType}>
					{album.album_type === 'album' ? 'Album'
						: album.album_type === 'single' ? 'Single'
							: album.album_type === 'compilation' ? 'Compilation'
								: 'Single'}
				</li>
			</ul>
		</li>
	);
}

// Компонент для отображения фильтров альбомов, показывающий только доступные типы.
function AlbumFilters({ activeFilter, setActiveFilter, items }: {
	activeFilter: string;
	setActiveFilter: React.Dispatch<React.SetStateAction<string>>;
	items: SimplifiedMappedAlbumItem[];
}) {
	const availableFilters = filterValues.filter(filter =>
		filter.type === 'all' || items.some(item => item.album_type === filter.type)
	);

	return (
		<ul className={albumsSectionStyles.filters}>
			{availableFilters.map((filter, index) => {
				return (
					<li
						key={index}
						className={`${activeFilter === filter.type ? albumsSectionStyles.filterItemActive : albumsSectionStyles.filterItem}`}
						onClick={() => setActiveFilter(filter.type)}
					>
						{filter.title}
					</li>
				)
			})}
		</ul>
	)
}

// Секция с альбомами, поддерживающая фильтрацию по типам и отображение полной коллекции при клике на "Show all".
export default function AlbumsSection({ title, sectionKey, isFiltered, items }: AlbumsSectionProps) {
	const navigation = useSelector((state: RootState) => state.general.navigation);
	const [activeFilter, setActiveFilter] = useState<string>('all');

	// Фильтрует альбомы на основе активного выбранного типа.
	const filteredAlbums = activeFilter === 'all'
		? items
		: items.filter(item => item.album_type === activeFilter);

	const navigate = useNavigate();

	return (
		<div className={albumsSectionStyles.albumSection}>
			{navigation !== 'library' && (
				<div className={albumsSectionStyles.header}>
					<h1 className={albumsSectionStyles.title}>{title}</h1>
					<button onClick={() => navigate(`/section/${sectionKey}`, { state: { title, items } })} className={albumsSectionStyles.showAll}>Show all</button>
				</div>
			)}
			{isFiltered && <AlbumFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} items={items} />}
			<ul className={albumsSectionStyles.albums}>
				{navigation !== 'library' ? filteredAlbums.slice(0, 5).map(album => (
					<AlbumItem key={album.id} album={album} />
				))
					:
					items.map(album => (
						<AlbumItem key={album.id} album={album} />
					))}
			</ul>
		</div>
	);
}