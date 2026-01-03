import headerStyles from './CollectionHeader.module.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Playlist } from '../../../types/collection/playlistTypes';
import { type Album } from '../../../types/collection/albumTypes';
import { type FullArtist } from '../../../types/collection/artistTypes';
import { type UserProfile } from '../../../types/user/userProfileTypes';
import { type UserPublicProfile } from '../../../types/user/userPublicProfileTypes';
import { normalizeTracks } from '../../../utils/normalize';
import { isCollectionOfType, isUserProfile } from '../../../utils/typeGuard';
import { formatDuration } from '../../../utils/formatDuration';
import ColorThief from 'colorthief';

interface CollectionHeaderProps {
	collectionData: Playlist | Album | FullArtist | UserProfile | UserPublicProfile;
	playlistCount?: number;
}

export default function CollectionHeader({ collectionData, playlistCount }: CollectionHeaderProps) {
	const navigate = useNavigate();
	const [dominantColor, setDominantColor] = useState<number[]>([0, 0, 0]);
	const bgImgRef = useRef<HTMLImageElement | null>(null);
	const coverUrl = collectionData?.images?.[0]?.url;

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

	// Нормализация треков
	const tracks = isCollectionOfType<Playlist>(collectionData, "playlist") ||
		isCollectionOfType<Album>(collectionData, "album")
		? normalizeTracks(collectionData)
		: [];

	// Общее время прослушивания
	const totalListeningTime = () => {
		if (!tracks || tracks.length === 0) {
			return '0:00';
		}

		return formatDuration(
			tracks.reduce((acc, t) => acc + (t.track?.duration_ms ?? 0), 0)
		);
	}

	if (isCollectionOfType<Playlist>(collectionData, "playlist")) {
		return (
			<>
				<img ref={bgImgRef} className={headerStyles.background} src={coverUrl ?? '/Collection/default-cover.jpg'} alt="background" crossOrigin="anonymous" />
				<div
					className={headerStyles.headerOverlay}
					style={{
						background: `linear-gradient(to bottom, rgba(${dominantColor.join(',')},0.8), #121212)`,
						opacity: 0.8,
					}}
				></div>
				<div className={headerStyles.header}>
					<img className={headerStyles.cover} src={coverUrl ?? '/Collection/default-cover.jpg'} alt={collectionData.name} />
					<div className={headerStyles.playlistInfo}>
						<h3 className={headerStyles.type}>
							{collectionData.public ? "Public Playlist" : "Non-public Playlist"}
						</h3>
						<h1>{collectionData.name}</h1>
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