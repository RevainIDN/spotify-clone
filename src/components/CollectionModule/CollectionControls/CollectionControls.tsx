import controlsStyles from './CollectionControls.module.css'
import { normalizeTracks } from '../../../utils/normalize';

import { useState } from 'react';
import { usePlaybackControls } from '../../../hooks/usePlaybackControls';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../../store';
import { setIsUserSubscribedToPlaylist, setIsUserSubscribedToAlbum, setIsUserSubscribedToArtist, addUserPlaylist, removeUserPlaylist } from '../../../store/userSlice';
import { setConfirmDeletePlaylistMode } from '../../../store/general';

import { type CollectionControlsProps } from './CollectionControls.types';
import { type TrackCollectionControlsProps } from './CollectionControls.types';
import { isArtistTracks, isPlaylistCollection } from '../../../utils/typeGuard';

import { followPlaylist, unfollowPlaylist, followAlbum, unfollowAlbum, followArtist, unfollowArtist } from '../../../services/User/userActivity';

import DeletePlaylist from '../../common/Playlist/DeletePlaylist';
import Overlay from '../../common/Overlay';
import ModalPortal from '../../../ModalPortal';

// Компонент управления коллекцией с опциями воспроизведения, фильтрации, сортировки и подписки.
export default function CollectionControls(props: CollectionControlsProps) {
	const { collectionData, isShuffled, setIsShuffled } = props;
	const { playlistId, albumId, artistId } = (props as TrackCollectionControlsProps);
	const { currentTrackUri, isPlaying } = useSelector((state: RootState) => state.player);

	const token = useSelector((state: RootState) => state.auth.accessToken)
	const nav = useSelector((state: RootState) => state.general.navigation);
	const userId = useSelector((state: RootState) => state.user.userProfileData?.id);
	const confirmDelete = useSelector((state: RootState) => state.general.confirmDeletePlaylistMode);

	const { isUserSubscribedToPlaylist, isUserSubscribedToAlbum, isUserSubscribedToArtist } = useSelector((state: RootState) => state.user);

	const [hoveredOption, setHoveredOption] = useState<string | null>(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

	const { playCollection } = usePlaybackControls({ collectionData, isShuffled });

	// Определяет тип коллекции на основе данных.
	const isPlaylist = !isArtistTracks(collectionData) && collectionData.type === 'playlist';
	const isAlbum = !isArtistTracks(collectionData) && collectionData.type === 'album';
	const isArtist = isArtistTracks(collectionData);

	// Проверяет, является ли текущий пользователь владельцем плейлиста.
	const isOwner =
		isPlaylistCollection(collectionData) &&
		collectionData.owner.id === userId;

	const dispatch = useDispatch<AppDispatch>();

	// Изменяет порядок сортировки или переключает критерий сортировки треков.
	const handleSortChange = (value: string) => {
		if (isPlaylist || isAlbum) {
			const trackProps = props as TrackCollectionControlsProps;
			if (value === trackProps.sortType) {
				trackProps.setSortOrder((prev: string) => (prev === "asc" ? "desc" : "asc"));
			} else {
				trackProps.setSortType(value);
				trackProps.setSortOrder("asc");
			}
			setIsDropdownOpen(false);
		};
	}

	// Переключает подписку пользователя на коллекцию (плейлист, альбом или артиста) синхронизируя с сервером.
	const handleCollectionSubscription = async () => {
		if (!token) return;

		let isSubscribed: boolean | undefined;
		let collectionId: string | undefined;
		let followFn: ((token: string, id?: string) => Promise<any>) | null = null;
		let unfollowFn: ((token: string, id?: string) => Promise<any>) | null = null;
		let setSubscription: ((value: boolean[]) => any) | null = null;

		if (isPlaylist) {
			isSubscribed = isUserSubscribedToPlaylist?.[0];
			collectionId = playlistId;
			followFn = followPlaylist;
			unfollowFn = unfollowPlaylist;
			setSubscription = (val) => dispatch(setIsUserSubscribedToPlaylist(val));
		} else if (isAlbum) {
			isSubscribed = isUserSubscribedToAlbum?.[0];
			collectionId = albumId;
			followFn = followAlbum;
			unfollowFn = unfollowAlbum;
			setSubscription = (val) => dispatch(setIsUserSubscribedToAlbum(val));
		} else if (isArtist) {
			isSubscribed = isUserSubscribedToArtist?.[0];
			collectionId = artistId;
			followFn = followArtist;
			unfollowFn = unfollowArtist;
			setSubscription = (val) => dispatch(setIsUserSubscribedToArtist(val));
		} else {
			return;
		}

		if (!collectionId || !followFn || !unfollowFn || !setSubscription) return;

		try {
			if (isSubscribed) {
				setSubscription([false]);
				await unfollowFn(token, collectionId);

				dispatch(removeUserPlaylist(collectionId));
			} else {
				setSubscription([true]);
				await followFn(token, collectionId);

				if (isPlaylistCollection(collectionData)) {
					dispatch(addUserPlaylist(collectionData));
				}
			}
		} catch (error) {
			console.error("Ошибка при изменении подписки:", error);
		}
	};

	// Варианты сортировки треков по разным критериям.
	const sortValues = [
		{ title: 'Sorting', type: 'Category' },
		{ title: 'Custom order', type: 'Default' },
		{ title: 'Title', type: 'Sorting' },
		{ title: 'Artist', type: 'Sorting' },
		{ title: 'Album', type: 'Sorting' },
		{ title: 'Date added', type: 'Sorting' },
		{ title: 'Duration', type: 'Sorting' },
		{ title: 'View mode', type: 'Category' },
		{ title: 'Compact', type: 'View mode' },
		{ title: 'List', type: 'View mode' }
	];

	// Нормализует треки для получения информации о текущем воспроизводящемся треке.
	const tracks =
		isPlaylist || isAlbum || isArtist
			? normalizeTracks(collectionData)
			: [];
	const existingTrack = tracks.find((t) => t.track?.uri === currentTrackUri);

	return (
		<div className={controlsStyles.options}>
			<div className={controlsStyles.trackOptions}>
				<button className={controlsStyles.playBtn} onClick={playCollection}>
					<img
						src={
							isPlaying && existingTrack
								? "/Options/pause.svg"
								: "/Options/play.svg"
						}
						alt="Play"
					/>
				</button>
				<button
					className={controlsStyles.mixBtn}
					onClick={() => setIsShuffled((prev) => !prev)}
				>
					<svg width="46" height="37" viewBox="0 0 46 37" fill="none" xmlns="http://www.w3.org/2000/svg" onMouseEnter={() => setHoveredOption('shuffle')} onMouseLeave={() => setHoveredOption(null)}>
						<path d="M36.2969 22.4561C37.0696 21.6522 38.3221 21.6521 39.0947 22.4561L45.0449 28.6504C45.2361 28.8496 45.2362 29.172 45.0449 29.3711L39.0947 35.5645C38.322 36.3688 37.0696 36.3687 36.2969 35.5645C35.5241 34.7601 35.5241 33.4558 36.2969 32.6514L39.4482 29.3711C39.6394 29.1721 39.6393 28.8495 39.4482 28.6504L36.2969 25.3692C35.5241 24.5648 35.5241 23.2604 36.2969 22.4561ZM34.4639 9.88185H26.873C25.3039 9.88185 23.8107 10.6371 22.7773 11.9541L8.06836 30.7031C6.34617 32.8982 3.85749 34.1572 1.24219 34.1572H0V30.1113H1.24219C2.81137 30.1113 4.30458 29.3551 5.33789 28.0381L20.0479 9.29005C21.77 7.09499 24.2577 5.83497 26.873 5.83497H34.4639V9.88185ZM23.1846 24.4541C24.182 25.7298 25.6231 26.4619 27.1377 26.4619H34.4648V30.3809H27.1377C24.6133 30.3809 22.2112 29.1614 20.5488 27.0352L17.2324 22.8281L19.9531 19.9961L23.1846 24.4541ZM2.4834 3.94728C5.00763 3.94728 7.40897 5.16704 9.07129 7.29298L13.5195 12.6797L10.8838 15.2764L6.43652 9.87404C5.43912 8.59831 3.99804 7.86622 2.4834 7.86622H0.000976562V3.94728H2.4834ZM36.2969 1.47755C37.0696 0.673172 38.322 0.673173 39.0947 1.47755L45.0449 7.67091C45.2361 7.87006 45.2362 8.19252 45.0449 8.39161L39.0947 14.585C38.322 15.3893 37.0696 15.3893 36.2969 14.585C35.5241 13.7806 35.5241 12.4763 36.2969 11.6719L39.4482 8.39161C39.6394 8.19254 39.6393 7.87003 39.4482 7.67091L36.2969 4.38966C35.5241 3.5853 35.5242 2.28194 36.2969 1.47755Z" fill={isShuffled ? '#1ED760' : hoveredOption === 'shuffle' ? '#FFFFFF' : '#FFFFFFB2'} />
					</svg>
				</button>

				{/* Кнопка подписки/отписки только для плейлистов (не владельца) и альбомов, кроме раздела "Лайкнутые песни" */}
				{(isPlaylist && !isOwner || isAlbum) && nav !== 'liked-songs' && (
					<button className={controlsStyles.addBtn} onClick={handleCollectionSubscription}>{/* Зелёная галочка если пользователь уже подписан, иначе плюс */}
						{(isPlaylist ? isUserSubscribedToPlaylist?.[0] : isUserSubscribedToAlbum?.[0]) ? (
							<svg width="42" height="42" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
								<ellipse cx="11" cy="10.5" rx="11" ry="10.5" fill="#1ED760" />
								<path d="M7 11L9.50292 13.3104C9.91351 13.6894 10.5552 13.6582 10.9273 13.2414C12.9643 10.96 14.2943 9.47038 16.5 7" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
							</svg>
						) : (
							<svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" onMouseEnter={() => setHoveredOption('add')} onMouseLeave={() => setHoveredOption(null)}>
								<rect x="17" y="31" width="24" height="4" rx="2" transform="rotate(-90 17 31)" fill={hoveredOption === 'add' ? '#FFFFFF' : '#FFFFFFB2'} />
								<rect x="7" y="17" width="24" height="4" rx="2" fill={hoveredOption === 'add' ? '#FFFFFF' : '#FFFFFFB2'} />
								<circle cx="19" cy="19" r="17.75" stroke={hoveredOption === 'add' ? '#FFFFFF' : '#FFFFFFB2'} strokeWidth="2.5" />
							</svg>
						)}

					</button>
				)}

				{/* Кнопка удаления плейлиста видна только если пользователь является владельцем */}
				{(isOwner && isPlaylist) && (
					<button className={controlsStyles.deleteBtn} onClick={() => dispatch(setConfirmDeletePlaylistMode(true))}>
						<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110.61 122.88" width={40} height={40} fill={hoveredOption === 'delete' ? '#FFFFFF' : '#FFFFFFB2'} onMouseEnter={() => setHoveredOption('delete')} onMouseLeave={() => setHoveredOption(null)}><title>trash</title><path d="M39.27,58.64a4.74,4.74,0,1,1,9.47,0V93.72a4.74,4.74,0,1,1-9.47,0V58.64Zm63.6-19.86L98,103a22.29,22.29,0,0,1-6.33,14.1,19.41,19.41,0,0,1-13.88,5.78h-45a19.4,19.4,0,0,1-13.86-5.78l0,0A22.31,22.31,0,0,1,12.59,103L7.74,38.78H0V25c0-3.32,1.63-4.58,4.84-4.58H27.58V10.79A10.82,10.82,0,0,1,38.37,0H72.24A10.82,10.82,0,0,1,83,10.79v9.62h23.35a6.19,6.19,0,0,1,1,.06A3.86,3.86,0,0,1,110.59,24c0,.2,0,.38,0,.57V38.78Zm-9.5.17H17.24L22,102.3a12.82,12.82,0,0,0,3.57,8.1l0,0a10,10,0,0,0,7.19,3h45a10.06,10.06,0,0,0,7.19-3,12.8,12.8,0,0,0,3.59-8.1L93.37,39ZM71,20.41V12.05H39.64v8.36ZM61.87,58.64a4.74,4.74,0,1,1,9.47,0V93.72a4.74,4.74,0,1,1-9.47,0V58.64Z" /></svg>
					</button>
				)}

				{/* Модальное окно подтверждения удаления плейлиста появляется только если пользователь кликнул кнопку и владеет плейлистом */}
				{(confirmDelete && isOwner && isPlaylist && token) && (
					<ModalPortal>
						<Overlay />
						<DeletePlaylist token={token} playlistId={playlistId} />
					</ModalPortal>
				)}

				{/* Follow только для артиста */}
				{isArtist && (
					<button className={controlsStyles.followBtn} onClick={handleCollectionSubscription}>
						{isUserSubscribedToArtist?.[0] ? 'Уже подписаны' : 'Подписаться'}
					</button>
				)}
			</div>

			{/* Фильтры и сортировка только для плейлиста/альбома */}
			{(isPlaylist || isAlbum) && (
				<div className={controlsStyles.filters}>
					{/* Поле поиска отображается только для плейлистов */}
					{isPlaylist && (
						<div className={controlsStyles.findInputWrapper}>
							<input
								className={controlsStyles.findInput}
								value={(props as TrackCollectionControlsProps).filterValue}
								onChange={(e) => (props as TrackCollectionControlsProps).setFilterValue(e.target.value)}
								type="text"
								placeholder="Search in playlist"
							/>
							<img
								className={controlsStyles.findIcon}
								src="/Options/find.svg"
								alt="Find"
							/>
						</div>
					)}
					<button
						className={controlsStyles.typeBtn}
						onClick={() => setIsDropdownOpen(prev => !prev)}
					>
						{(props as TrackCollectionControlsProps).sortType} <div className={controlsStyles.dropdownArrow}></div>
					</button>
					{isDropdownOpen &&
						<ul className={controlsStyles.dropdownList}>
							{/* Фильтруем опции в зависимости от типа коллекции: альбом показывает только режимы отображения, плейлист показывает все опции (сортировка + режимы) */}
							{sortValues.filter(value => collectionData.type === 'album' ? value.type === 'View mode' : value.type).map((value) => (
								<li
									key={value.title}
									className={value.type === 'Category' ? controlsStyles.dropdownItemTitle : controlsStyles.dropdownItem}
									onClick={() => {
										if (value.type === 'Category') return;

										/* Если элемент - режим отображения (List/Compact), то переключаем режим просмотра */
										if (value.type === 'View mode') {
											(props as TrackCollectionControlsProps).setSortViewMode(value.title === 'List' ? 'List' : 'Compact');
										}

										/* Если элемент - тип сортировки, то обновляем сортировку */
										if (value.type === 'Sorting' || value.type === 'Default') {
											handleSortChange(value.title);
										}
									}}
									style={{
										/* Текущая опция выбранного типа сортировки или режима отображения окрашивается зелёным цветом Spotify */
										color:
											(value.type === 'Sorting' && (props as TrackCollectionControlsProps).sortType === value.title) ||
												(value.type === 'Default' && (props as TrackCollectionControlsProps).sortType === value.title) ||
												(value.type === 'View mode' && (props as TrackCollectionControlsProps).sortViewMode === value.title)
												? '#1ED760'
												: '#FFFFFF',
									}}
								>
									{value.title}
									{/* Иконка стрелки (вверх/вниз) показывается для текущего типа сортировки и отражает направление (asc/desc) */}
									{value.type === 'Sorting' && (props as TrackCollectionControlsProps).sortType === value.title && (
										<img
											src={(props as TrackCollectionControlsProps).sortOrder === 'asc' ? "/Options/arrow-down.svg" : "/Options/arrow-up.svg"}
											alt="Check"
										/>
									)}

									{/* Иконка галочки показывается для текущего типа сортировки по умолчанию и для текущего режима отображения */}
									{value.type === 'Default' && (props as TrackCollectionControlsProps).sortType === value.title && (
										<img src="/Options/check.svg" alt="Check" />
									)}

									{value.type === 'View mode' && (props as TrackCollectionControlsProps).sortViewMode === value.title && (
										<img src="/Options/check.svg" alt="Check" />
									)}
								</li>
							))}
						</ul>}
				</div>
			)}
		</div>
	);

}