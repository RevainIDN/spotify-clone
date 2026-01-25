import headerStyles from './CollectionHeader.module.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../../../store';
import { setEditMode } from '../../../store/general';

import { type Playlist } from '../../../types/collection/playlistTypes';
import { type Album } from '../../../types/collection/albumTypes';
import { type FullArtist } from '../../../types/collection/artistTypes';
import { type UserProfile } from '../../../types/user/userProfileTypes';
import { type UserPublicProfile } from '../../../types/user/userPublicProfileTypes';

import { normalizeTracks } from '../../../utils/normalize';
import { isCollectionOfType, isUserProfile } from '../../../utils/typeGuard';
import { formatDuration } from '../../../utils/formatDuration';

import ColorThief from 'colorthief';

import ModalPortal from '../../../ModalPortal';
import Overlay from '../../common/Overlay';
import EditPlaylist from '../../common/Playlist/EditPlaylist';

interface CollectionHeaderProps {
	collectionData: Playlist | Album | FullArtist | UserProfile | UserPublicProfile;
	playlistCount?: number;
}

export default function CollectionHeader({ collectionData, playlistCount }: CollectionHeaderProps) {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();

	const userDisplayName = useSelector((state: RootState) => state.user.userProfileData?.display_name);
	const editMode = useSelector((state: RootState) => state.general.editMode);

	const [isHovered, setIsHovered] = useState(false);
	// Доминирующий цвет изображения обложки для создания соответствующего фона.
	const [dominantColor, setDominantColor] = useState<number[]>([0, 0, 0]);
	const bgImgRef = useRef<HTMLImageElement | null>(null);
	const coverUrl = collectionData?.images?.[0]?.url;

	// Извлекает доминирующий цвет из обложки коллекции для динамического оформления фона.
	useEffect(() => {
		if (!bgImgRef.current || !coverUrl) {
			setDominantColor([18, 18, 18]);
			return;
		}

		const img = bgImgRef.current;
		const colorThief = new ColorThief();

		const handleLoad = () => {
			try {
				const color = colorThief.getColor(img);
				setDominantColor(color);
			} catch (e) {
				console.error('ColorThief error:', e);
				setDominantColor([18, 18, 18]);
			}
		};

		if (img.complete) {
			handleLoad();
		} else {
			img.addEventListener('load', handleLoad);
			return () => img.removeEventListener('load', handleLoad);
		}
	}, [collectionData.id, coverUrl]);

	// Нормализует треки из коллекции для вычисления общего времени прослушивания.
	const tracks = isCollectionOfType<Playlist>(collectionData, "playlist") ||
		isCollectionOfType<Album>(collectionData, "album")
		? normalizeTracks(collectionData)
		: [];

	// Вычисляет общую длительность всех треков в коллекции.
	const totalListeningTime = () => {
		if (!tracks || tracks.length === 0) {
			return '0:00';
		}

		return formatDuration(
			tracks.reduce((acc, t) => acc + (t.track?.duration_ms ?? 0), 0)
		);
	}

	if (isCollectionOfType<Playlist>(collectionData, "playlist")) {
		const playlistFromStore = useSelector((state: RootState) =>
			state.user.userPlaylists?.items.find(
				p => p.id === collectionData.id
			)
		);

		const coverUrl =
			playlistFromStore?.images?.[0]?.url ??
			collectionData.images?.[0]?.url ??
			'/Collection/default-cover.jpg';

		const playlistName = playlistFromStore?.name ?? collectionData.name;

		return (
			<>
				<img ref={bgImgRef} className={headerStyles.background} src={coverUrl ?? '/Collection/default-cover.jpg'} alt="background" crossOrigin="anonymous" />
				<div
					className={headerStyles.headerOverlay}
					style={{
						/* Градиент с доминантным цветом из обложки плейлиста для динамического стиля */
						background: `linear-gradient(to bottom, rgba(${dominantColor.join(',')},0.8), #121212)`,
						opacity: 0.8,
					}}
				></div>
				<div className={headerStyles.header}>
					<div className={headerStyles.coverContent} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
						<img className={headerStyles.cover} src={coverUrl ?? '/Collection/default-cover.jpg'} alt={collectionData.name} />
						{/* Кнопка редактирования обложки видна только для владельца плейлиста и при наведении мышки */}
						{userDisplayName === collectionData.owner.display_name && (
							<div className={headerStyles.coverEdit} style={isHovered ? { display: 'flex' } : { display: 'none' }} onClick={() => dispatch(setEditMode(true))}>
								<svg xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 506 511.95" width={80} height={80}><path fill='white' fillRule="nonzero" d="M400.08 26.04c-1.82-1.81-3.72-3.14-5.7-3.97-1.89-.8-4.05-1.2-6.47-1.2-2.38 0-4.52.41-6.4 1.21-1.95.83-3.83 2.15-5.63 3.96l-36.73 36.73 104.11 104.57 37.22-37.22c1.55-1.54 2.69-3.29 3.44-5.18l.15-.38c.71-1.96 1.06-4.17 1.06-6.56 0-2.49-.4-4.82-1.22-6.89l-.22-.62c-.74-1.64-1.79-3.16-3.16-4.52l-80.45-79.93zM69.03 332.8l105.03 103.23 215.22-215.22-104.09-104.17L69.03 332.8zm86.27 113.97-96.28-94.62-27.86 99.15c-4.45 15.91-7.46 28.06-9.05 36.44 19.79-5.98 40.2-11.61 59.73-18.29 10.75-3.39 21.78-6.87 39.25-12.28l24.1-7.34 10.11-3.06zM402.45 2.91c4.5 1.89 8.61 4.69 12.3 8.37l80.45 79.93c3.35 3.33 5.9 7.12 7.68 11.27l.43.96c1.81 4.57 2.69 9.48 2.69 14.56 0 4.87-.8 9.56-2.45 13.97l-.23.63c-1.79 4.53-4.47 8.67-8.08 12.28l-44.64 44.6c-4.07 4.05-10.66 4.03-14.71-.04L317.04 70.11c-4.07-4.07-4.07-10.68 0-14.76l44.08-44.07c3.65-3.66 7.72-6.45 12.23-8.36C377.92.98 382.77 0 387.91 0c5.1 0 9.94.97 14.54 2.91zM174.77 462.66l-23.54 7.07-24.03 7.32c-30.42 9.57-60.67 18.96-91.16 28.28-10.56 3.19-17.58 5.27-20.89 6.17-1.41.4-2.83.54-4.3.39-6.12-.62-9.68-4.3-10.63-11.06-.33-2.28-.28-5.21.13-8.77 1.03-9 4.62-24.47 10.75-46.39l32.27-114.82c.5-1.78 1.43-3.33 2.66-4.55L277.79 94.52c4.07-4.07 10.68-4.07 14.76 0l118.84 118.97c4.05 4.07 4.03 10.65-.02 14.7l-231.66 231.7a10.373 10.373 0 0 1-4.94 2.77z" /></svg>
							</div>
						)}
					</div>
					<div className={headerStyles.playlistInfo}>
						<h3 className={headerStyles.type}>
							{collectionData.public ? "Public Playlist" : "Non-public Playlist"}
						</h3>
						<h1>{playlistName}</h1>
						<div className={headerStyles.aboutInfo}>
							<span className={headerStyles.artist} onClick={() => navigate(`/user/${collectionData.owner.id}`)}>
								{collectionData.owner.display_name}
							</span>
							<div className='delimiter'></div>
							<span className={headerStyles.numberSongs}>{collectionData.tracks.items.length} songs</span>
							<div className='delimiter'></div>
							<span className={headerStyles.totalTime}>{totalListeningTime()}</span>
						</div>
					</div>
				</div>
				{editMode &&
					<ModalPortal>
						<Overlay />
						<EditPlaylist collectionData={collectionData} />
					</ModalPortal>
				}
			</>
		);
	}

	if (isCollectionOfType<Album>(collectionData, "album")) {
		return (
			<>
				<img className={headerStyles.background} src={coverUrl} alt="background" />
				<div className={headerStyles.header}>
					<img className={headerStyles.cover} src={coverUrl} alt={collectionData.name} />
					<div className={headerStyles.playlistInfo}>
						{/* Тип альбома (Album/Single/Compilation) отображается как заголовок */}
						<h3 className={headerStyles.type}>{collectionData.album_type}</h3>
						<h1 className={headerStyles.name}>{collectionData.name}</h1>
						<div className={headerStyles.aboutInfo}>
							<span className={headerStyles.artist} onClick={() => navigate(`/artist/${collectionData.artists[0].id}`)}>
								{collectionData.artists[0].name}
							</span>
							<div className='delimiter'></div>
							<span className={headerStyles.numberSongs}>{collectionData.tracks.items.length} songs</span>
							<div className='delimiter'></div>
							<span className={headerStyles.totalTime}>{totalListeningTime()}</span>
						</div>
					</div>
				</div>
			</>
		);
	}

	if (isCollectionOfType<FullArtist>(collectionData, "artist")) {
		return (
			<>
				<img
					className={headerStyles.background}
					style={{ height: '300px' }}
					src={coverUrl} alt="background"
				/>
				<div className={headerStyles.header}>
					{/* Аватар артиста имеет круглую форму, в отличие от плейлистов и альбомов */}
					<img
						className={headerStyles.cover}
						src={coverUrl} alt={collectionData.name}
						style={{ borderRadius: '50%' }}
					/>
					<div className={headerStyles.playlistInfo}>
						<h3 className={headerStyles.type}>Artist</h3>
						<h1>{collectionData.name}</h1>
						<h3>{collectionData.followers.total.toLocaleString()} followers</h3>
					</div>
				</div>
			</>
		);
	}

	if (isUserProfile(collectionData)) {
		return (
			<>
				{collectionData.images?.[0]?.url && (
					<img
						className={headerStyles.background}
						src={collectionData.images?.[0]?.url ?? "/default-cover.jpg"}
						alt="background"
					/>
				)}
				<div className={headerStyles.header}>
					{/* Если у пользователя есть фото профиля, показываем его, иначе показываем букву с первого символа имени */}
					{collectionData.images?.[0]?.url ? (
						<img
							className={headerStyles.cover}
							src={coverUrl}
							alt={collectionData.display_name}
							style={{ borderRadius: '50%' }}
						/>
					) : (
						<div className={headerStyles.coverDefault}>
							{collectionData.display_name.slice(0, 1).toUpperCase()}
						</div>
					)}
					<div className={headerStyles.playlistInfo}>
						<h3 className={headerStyles.type}>User</h3>
						<h1 style={{ fontSize: '5rem' }}>{collectionData.display_name}</h1>
						<div className={headerStyles.playlistsDescription}>
							<h3>{playlistCount} open playlists</h3>
							<div className='delimiter'></div>
							<h3>{collectionData.followers?.total.toLocaleString() ?? 0} followers</h3>
						</div>
					</div>
				</div>
			</>
		);
	}

	return null;
}