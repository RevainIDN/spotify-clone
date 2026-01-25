import likedSongsStyles from './LikedSongs.module.css';
import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { type RootState, type AppDispatch } from '../../store';
import { setNavigation } from '../../store/general';
import { getLikedTracks } from '../../services/User/likedTracks';

import { type SavedTrack, type LikedTracksResponse, type LikedSongsCollection } from '../../types/collection/likedSongsTypes';

import CollectionControls from '../../components/CollectionModule/CollectionControls/CollectionControls';
import CollectionTrackList from '../../components/CollectionModule/CollectionTrackList/CollectionTrackList';
import Loader from '../../components/common/Loader';

export default function LikedSongs() {
	// Все понравившиеся треки пользователя
	const [likedTracks, setLikedTracks] = useState<SavedTrack[]>();
	// Флаг для перемешивания треков при воспроизведении
	const [isShuffled, setIsShuffled] = useState(false);
	// Значение поиска по названию трека, артисту или альбому
	const [filterValue, setFilterValue] = useState('');
	// Состояние сортировки: тип, направление и режим отображения
	const [sortType, setSortType] = useState('Custom order');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [sortViewMode, setSortViewMode] = useState<'List' | 'Compact'>('List');

	const token = useSelector((state: RootState) => state.auth.accessToken);
	const userName = useSelector((state: RootState) => state.user.userProfileData?.display_name);

	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	useEffect(() => {
		// Загружает все понравившиеся треки пользователя
		const fetchLikedTracks = async () => {
			if (!token) return;

			const data: LikedTracksResponse = await getLikedTracks(token);
			setLikedTracks(data.items);
		};

		fetchLikedTracks();
		// Уведомляем Redux о текущей странице
		dispatch(setNavigation('liked-songs'))
	}, [token]);

	const likedSongsCollection: LikedSongsCollection = useMemo(
		() => ({
			// Создаём виртуальную коллекцию "Лайкнутые песни" с форматом плейлиста для унификации компонентов
			type: 'playlist',
			id: 'liked-songs',
			name: 'Liked Songs',
			description: 'Your liked tracks',
			tracks: {
				items: likedTracks ?? [],
				total: (likedTracks ?? []).length
			}
		}),
		[likedTracks]
	);

	if (!likedTracks) {
		return <Loader />
	}

	return (
		<div className='content'>
			<div
				className={likedSongsStyles.headerOverlay}
				style={{
					background: 'linear-gradient(to bottom, #4C33AB, #000000)',
					opacity: 0.8,
				}}
			></div>
			<div className={likedSongsStyles.header}>
				<img className={likedSongsStyles.cover} src='/Track/liked-songs-cover.jpg' alt='Liked Songs' />
				<div className={likedSongsStyles.info}>
					<h3 className={likedSongsStyles.type}>Playlist</h3>
					<h1 className={likedSongsStyles.title}>Liked Songs</h1>
					<div className={likedSongsStyles.aboutInfo}>
						<span className={likedSongsStyles.owner} onClick={() => navigate(`/me`)}>
							{userName}
						</span>
						<div className='delimiter'></div>
						<span className={likedSongsStyles.numberSongs}>{likedTracks?.length} songs</span>
					</div>
				</div>
			</div>
			<CollectionControls
				collectionData={likedSongsCollection}
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
				enableFilters
			/>
			<CollectionTrackList
				collectionData={likedSongsCollection}
				isShuffled={isShuffled}
				filterValue={filterValue}
				sortType={sortType}
				sortOrder={sortOrder}
				sortViewMode={sortViewMode}
			/>
			{!likedTracks || likedTracks.length === 0 ? (
				<div className={likedSongsStyles.noResults}>
					Tracks you liked will appear here
				</div>
			) : null}
		</div>
	)
}