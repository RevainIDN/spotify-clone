import playlist from './Playlist.module.css'

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../../store';
import { setNavigation } from '../../store/general';
import { setIsUserSubscribedToPlaylist } from '../../store/userSlice';

import { getPlaylist } from '../../services/Catalog/playlists';
import { type Playlist } from '../../types/collection/playlistTypes';

import { getIsUserSubscribedToPlaylist } from '../../services/User/userActivity';

import CollectionHeader from '../../components/CollectionModule/CollectionHeader/CollectionHeader';
import CollectionControls from '../../components/CollectionModule/CollectionControls/CollectionControls';
import CollectionTrackList from '../../components/CollectionModule/CollectionTrackList/CollectionTrackList';
import Loader from '../../components/common/Loader';

export default function Playlist() {
	// Данные плейлиста загруженные из API Spotify
	const [playlistData, setPlaylistData] = useState<Playlist>();
	// Флаг для перемешивания треков при воспроизведении
	const [isShuffled, setIsShuffled] = useState<boolean>(false);

	// Значение поиска по названию трека, артисту или альбому в плейлисте
	const [filterValue, setFilterValue] = useState<string>('');

	// Состояние сортировки: тип, направление и режим отображения
	const [sortType, setSortType] = useState<string>('Custom order');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [sortViewMode, setSortViewMode] = useState<'List' | 'Compact'>('List');

	// Получение токена и ID плейлиста из URL параметров
	const token = useSelector((state: RootState) => state.auth.accessToken)
	const { id } = useParams();

	const dispatch = useDispatch<AppDispatch>();

	// Загружает данные плейлиста по ID и проверяет статус подписки пользователя
	useEffect(() => {
		if (!token || !id) {
			console.warn('Token или ID отсутствует');
			return;
		}

		const fetchData = async () => {
			try {
				const playlistData = await getPlaylist(token, id) as Playlist;
				setPlaylistData(playlistData);
				if (playlistData) {
					// Проверяем подписан ли пользователь на этот плейлист
					const isUserSubscribed = await getIsUserSubscribedToPlaylist(token, id);
					dispatch(setIsUserSubscribedToPlaylist(isUserSubscribed));
				}
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
		dispatch(setNavigation('playlist'));
	}, [token, id])

	if (!playlistData) {
		return <Loader />;
	}

	return (
		<div className='content'>
			<CollectionHeader collectionData={playlistData} />
			<div className={playlist.main}>
				<CollectionControls
					collectionData={playlistData}
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
					playlistId={playlistData.id}
				/>
				<CollectionTrackList
					collectionData={playlistData}
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