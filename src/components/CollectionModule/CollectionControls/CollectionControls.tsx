import controlsStyles from './CollectionControls.module.css'
import { normalizeTracks } from '../../../utils/normalize';

import { useState } from 'react';
import { usePlaybackControls } from '../../../hooks/usePlaybackControls';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../../store';
import { setIsUserSubscribedToPlaylist, setIsUserSubscribedToAlbum, setIsUserSubscribedToArtist } from '../../../store/userSlice';

import { type CollectionControlsProps } from './CollectionControls.types';
import { type TrackCollectionControlsProps } from './CollectionControls.types';
import { isArtistTracks } from '../../../utils/typeGuard';

import { followPlaylist, unfollowPlaylist, followAlbum, unfollowAlbum, followArtist, unfollowArtist } from '../../../services/User/userActivity';

export default function CollectionControls(props: CollectionControlsProps) {
	const { collectionData, isShuffled, setIsShuffled } = props;
	const { playlistId, albumId, artistId } = (props as TrackCollectionControlsProps);
	const { currentTrackUri, isPlaying } = useSelector((state: RootState) => state.player);

	const token = useSelector((state: RootState) => state.auth.accessToken)
	const nav = useSelector((state: RootState) => state.general.navigation);
	console.log(nav)
	const { isUserSubscribedToPlaylist, isUserSubscribedToAlbum, isUserSubscribedToArtist } = useSelector((state: RootState) => state.user);

	const [hoveredOption, setHoveredOption] = useState<string | null>(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

	const { playCollection } = usePlaybackControls({ collectionData, isShuffled });

	const isPlaylist = !isArtistTracks(collectionData) && collectionData.type === 'playlist';
	const isAlbum = !isArtistTracks(collectionData) && collectionData.type === 'album';
	const isArtist = isArtistTracks(collectionData);

	const dispatch = useDispatch<AppDispatch>();

	// Обработка изменения сортировки
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
			} else {
				setSubscription([true]);
				await followFn(token, collectionId);
			}
		} catch (error) {
			console.error("Ошибка при изменении подписки:", error);
		}
	};

	// Значения сортировки
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

				{(isPlaylist || isAlbum) && nav !== 'liked-songs' && (
					<button className={controlsStyles.addBtn} onClick={handleCollectionSubscription}>
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

							{sortValues.filter(value => collectionData.type === 'album' ? value.type === 'View mode' : value.type).map((value) => (
								<li
									key={value.title}
									className={value.type === 'Category' ? controlsStyles.dropdownItemTitle : controlsStyles.dropdownItem}
									onClick={() => {
										if (value.type === 'Category') return;

										if (value.type === 'View mode') {
											(props as TrackCollectionControlsProps).setSortViewMode(value.title === 'List' ? 'List' : 'Compact');
										}

										if (value.type === 'Sorting' || value.type === 'Default') {
											handleSortChange(value.title);
										}
									}}
									style={{
										color:
											(value.type === 'Sorting' && (props as TrackCollectionControlsProps).sortType === value.title) ||
												(value.type === 'Default' && (props as TrackCollectionControlsProps).sortType === value.title) ||
												(value.type === 'View mode' && (props as TrackCollectionControlsProps).sortViewMode === value.title)
												? '#1ED760'
												: '#FFFFFF',
									}}
								>
									{value.title}
									{value.type === 'Sorting' && (props as TrackCollectionControlsProps).sortType === value.title && (
										<img
											src={(props as TrackCollectionControlsProps).sortOrder === 'asc' ? "/Options/arrow-down.svg" : "/Options/arrow-up.svg"}
											alt="Check"
										/>
									)}

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