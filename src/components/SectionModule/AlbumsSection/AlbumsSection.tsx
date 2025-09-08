import albumsSectionStyles from './AlbumsSection.module.css'
import { type SimplifiedMappedAlbumItem } from '../../../types/collection/generalTypes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractYear } from '../../../utils/extractYear';

interface AlbumsSectionProps {
	title: string;
	sectionKey: string;
	items: SimplifiedMappedAlbumItem[];
}

const filterValues = [
	{ title: 'Show All', type: 'all' },
	{ title: 'Albums', type: 'album' },
	{ title: 'Singles & EP', type: 'single' },
	{ title: 'Compilations', type: 'compilation' }
]

function AlbumItem({ album }: { album: SimplifiedMappedAlbumItem }) {
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
		<li onClick={handleClick} className={albumsSectionStyles.albumItem}>
			<img className={albumsSectionStyles.albumImage} src={album.images[0]?.url} alt={album.name} />
			<span className={albumsSectionStyles.albumTitle}>{album.name}</span>
			<ul className={albumsSectionStyles.albumDescription}>
				<li className={albumsSectionStyles.albumYear}>{extractYear(album.release_date)}</li>
				<li className='delimiter'></li>
				<li className={albumsSectionStyles.albumType}>
					{album.album_type === 'album' ? 'Album'
						: album.album_type === 'single' ? 'Single'
							: album.album_type === 'compilation' ? 'Compilation'
								: null}
				</li>
			</ul>
		</li>
	);
}

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

export default function AlbumsSection({ title, sectionKey, items }: AlbumsSectionProps) {
	const [activeFilter, setActiveFilter] = useState<string>('all');

	const filteredAlbums = activeFilter === 'all'
		? items
		: items.filter(item => item.album_type === activeFilter);

	const navigate = useNavigate();

	return (
		<div className={albumsSectionStyles.albumSection}>
			<div className={albumsSectionStyles.header}>
				<h1 className={albumsSectionStyles.title}>{title}</h1>
				<button onClick={() => navigate(`/section/${sectionKey}`, { state: { title, items } })} className={albumsSectionStyles.showAll}>Show all</button>
			</div>
			<AlbumFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} items={items} />
			<ul className={albumsSectionStyles.albums}>
				{filteredAlbums.slice(0, 5).map(album => (
					<AlbumItem key={album.id} album={album} />
				))}
			</ul>
		</div>
	);
}