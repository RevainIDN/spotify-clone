import albumStyles from './Album.module.css'

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../../store';
import { setNavigation } from '../../store/general';
import { setIsUserSubscribedToAlbum } from '../../store/userSlice';

import { getAlbum } from '../../services/Catalog/albums';
import { type Album } from '../../types/collection/albumTypes';

import { getIsUserSubscribedToAlbums } from '../../services/User/userActivity';

import CollectionHeader from '../../components/CollectionModule/CollectionHeader/CollectionHeader'
import CollectionControls from '../../components/CollectionModule/CollectionControls/CollectionControls'
import CollectionTrackList from '../../components/CollectionModule/CollectionTrackList/CollectionTrackList'
import Loader from '../../components/common/Loader';

export default function Album() {
	// Данные альбома
	const [albumData, setAlbumData] = useState<Album | null>(null);
	const [isShuffled, setIsShuffled] = useState<boolean>(false);

	// Состояние фильтрации
	const [filterValue, setFilterValue] = useState<string>('');

	// Состояние выпадающего списка
	const [sortType, setSortType] = useState<string>('Custom order');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [sortViewMode, setSortViewMode] = useState<'List' | 'Compact'>('List');

	const token = useSelector((state: RootState) => state.auth.accessToken);
	const { id } = useParams();

	const dispatch = useDispatch<AppDispatch>();

	// Получение данных альбома
	useEffect(() => {
		if (!token || !id) {
			console.warn('Token или ID отсутствует');
			return;
		}

		const fetchData = async () => {
			try {
				const albumData = await getAlbum(token, id) as Album;
				setAlbumData(albumData);
				if (albumData) {
					const setIsUserSubscribed = await getIsUserSubscribedToAlbums(token, [id]);
					dispatch(setIsUserSubscribedToAlbum(setIsUserSubscribed));
				}
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
		dispatch(setNavigation('album'));
	}, [token, id])

	if (!albumData) {
		return <Loader />;
	}

	return (
		<div className='content'>
			<CollectionHeader collectionData={albumData} />
			<div className={albumStyles.main}>
				<CollectionControls
					collectionData={albumData}
					isShuffled={isShuffled}
					setIsShuffled={setIsShuffled}
					filterValue={filterValue}
					setFilterValue={setFilterValue}
					sortType={sortType}
					setSortType={setSortType}
					sortOrder={sortOrder}
					setSortOrder={setSortOrder}
					sortViewMode={sortViewMode}
					setSortViewMode={setSortViewMode}
					albumId={albumData.id}
				/>
				<CollectionTrackList
					collectionData={albumData}
					isShuffled={isShuffled}
					filterValue={filterValue}
					sortType={sortType}
					sortOrder={sortOrder}
					sortViewMode={sortViewMode}
				/>
			</div>
		</div>
	)
}