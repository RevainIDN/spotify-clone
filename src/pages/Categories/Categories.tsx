import categoriesStyles from './Categories.module.css'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { type RootState } from '../../store';
import { useParams } from 'react-router-dom';
import { getDataCategory } from '../../services/Search/categories';

import { mapPlaylistToSimplified, mapAlbumToSimplified, mapArtistToSimplified } from '../../mappers';
import { type SimplifiedMappedPlaylistItem, type SimplifiedMappedAlbumItem, type SimplifiedMappedArtistItem } from '../../types/collection/generalTypes';

import PlaylistSection from '../../components/SectionModule/PlaylistSection/PlaylistSection';
import AlbumsSection from '../../components/SectionModule/AlbumsSection/AlbumsSection';
import ArtistSection from '../../components/SectionModule/ArtistSection/ArtistSection';
import Loader from '../../components/common/Loader';

export default function Categories() {
	// Данные категории с плейлистами, альбомами и артистами
	const [categoryData, setCategoryData] = useState<any>(null);

	const { id } = useParams();
	const token = useSelector((state: RootState) => state.auth.accessToken);

	useEffect(() => {
		// Загружает данные категории по ID
		const fetchCategory = async () => {
			if (!id || !token) return;

			try {
				const topData = await getDataCategory(token, id);

				setCategoryData({
					top: topData
				});
			} catch (error) {
				console.error("Ошибка при загрузке данных категории:", error);
			}
		};

		fetchCategory();
	}, [token, id]);

	if (!categoryData) {
		return <Loader />;
	}

	return (
		<div className='content'>
			<h1 className={categoriesStyles.title}>{id}</h1>
			{/* Лучшие плейлисты в категории */}
			<PlaylistSection
				title="Best Playlists"
				sectionKey='playlists'
				items={
					categoryData
						? categoryData.top?.playlists?.items
							.map(mapPlaylistToSimplified)
							.filter(Boolean) as SimplifiedMappedPlaylistItem[]
						: []
				}
			/>
			{/* Лучшие альбомы в категории */}
			<AlbumsSection
				title='Best Albums'
				sectionKey='albums'
				isFiltered={false}
				items={
					categoryData
						? categoryData.top?.albums?.items
							.map(mapAlbumToSimplified)
							.filter(Boolean) as SimplifiedMappedAlbumItem[]
						: []
				}
			/>
			{/* Лучшие артисты в категории */}
			<ArtistSection
				title='Top Artists'
				sectionKey='artists'
				items={
					categoryData
						? categoryData.top?.artists?.items
							.map(mapArtistToSimplified)
							.filter(Boolean) as SimplifiedMappedArtistItem[]
						: []
				}
			/>
		</div>
	)
}