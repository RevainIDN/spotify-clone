import playlist from './Playlist.module.css'

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'

import { useSelector } from 'react-redux';
import { type RootState } from '../../store';

import { getPlaylist } from '../../services/Catalog/playlists';
import { type Playlist } from '../../types/collection/playlistTypes';

import CollectionHeader from '../../components/CollectionModule/CollectionHeader/CollectionHeader';
import CollectionControls from '../../components/CollectionModule/CollectionControls/CollectionControls';
import ColelctionTrackList from '../../components/CollectionModule/CollectionTrackList/ColelctionTrackList';
import Loader from '../../components/common/Loader';

export default function Playlist() {
	// Данные плейлиста
	const [playlistData, setPlaylistData] = useState<Playlist>();
	const [isShuffled, setIsShuffled] = useState<boolean>(false);

	// Состояние фильтрации
	const [filterValue, setFilterValue] = useState<string>('');

	// Состояние выпадающего списка
	const [sortType, setSortType] = useState<string>('Custom order');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [sortViewMode, setSortViewMode] = useState<'List' | 'Compact'>('List');

	// Состояние авторизации
	const token = useSelector((state: RootState) => state.auth.accessToken)
	const { id } = useParams();

	// Получение данных плейлиста
	useEffect(() => {
		if (!token || !id) {
			console.warn('Token или ID отсутствует');
			return;
		}

		const fetchData = async () => {
			try {
				const data = await getPlaylist(token, id) as Playlist;
				setPlaylistData(data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();

	}, [token, id])

	if (!playlistData) {
		return <Loader />;
	}

	return (
		<div className={playlist.playlist}>
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
				/>
				<ColelctionTrackList
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