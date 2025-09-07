import categoriesStyles from './Categories.module.css'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { type RootState } from '../../store';
import { useParams } from 'react-router-dom';
import { getDataCategory } from '../../services/Search/categories';

import { mapPlaylistToSimplified, mapAlbumToSimplified } from '../../services/Selections/selections';
import { type SimplifiedMappedPlaylistItem, type SimplifiedMappedAlbumItem } from '../../types/collection/generalTypes';

import PlaylistSection from '../../components/PlaylistSection/PlaylistSection';
import AlbumsSection from '../../components/AlbumsSection/AlbumsSection';
import Loader from '../../components/common/Loader';

export default function Categories() {
	const [categoryData, setCategoryData] = useState<any>(null);

	const { id } = useParams();

	const token = useSelector((state: RootState) => state.auth.accessToken);

	useEffect(() => {
		const fetchCategory = async () => {
			if (!id) return;
			const data = await getDataCategory(token, id);
			setCategoryData(data);
		};
		fetchCategory();
	}, [token, id]);

	if (!categoryData) {
		return <Loader />;
	}

	return (
		<div className={categoriesStyles.categoriesPage}>
			<h1 className={categoriesStyles.title}>{id}</h1>
			<PlaylistSection
				title="Best Playlists"
				sectionKey='playlists'
				items={
					categoryData
						? categoryData.playlists.items
							.map(mapPlaylistToSimplified)
							.filter(Boolean) as SimplifiedMappedPlaylistItem[]
						: []
				}
			/>
			<AlbumsSection
				title='Best Albums'
				sectionKey='albums'
				items={
					categoryData
						? categoryData.albums.items
							.map(mapAlbumToSimplified)
							.filter(Boolean) as SimplifiedMappedAlbumItem[]
						: []
				}
			/>
		</div>
	)
}