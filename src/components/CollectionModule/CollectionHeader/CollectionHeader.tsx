import headerStyles from './CollectionHeader.module.css';
import { useNavigate } from 'react-router-dom';
import { type Playlist } from '../../../types/collection/playlistTypes';
import { type Album } from '../../../types/collection/albumTypes';
import { type FullArtist } from '../../../types/collection/artistTypes';
import { normalizeTracks } from '../../../utils/normalize';
import { isCollectionOfType } from '../../../utils/typeGuard';
import { formatDuration } from '../../../utils/formatDuration';

interface CollectionHeaderProps {
	collectionData: Playlist | Album | FullArtist;
}

export default function CollectionHeader({ collectionData }: CollectionHeaderProps) {
	const navigate = useNavigate();

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
				<img className={headerStyles.background} src={collectionData?.images[0].url} alt="background" />
				<div className={headerStyles.header}>
					<img className={headerStyles.cover} src={collectionData.images[0].url} alt={collectionData.name} />
					<div className={headerStyles.playlistInfo}>
						<h3 className={headerStyles.type}>
							{collectionData.public ? "Public Playlist" : "Non-public Playlist"}
						</h3>
						<h1>{collectionData.name}</h1>
						<div className={headerStyles.aboutInfo}>
							<span className={headerStyles.artist} onClick={() => navigate(`/user/${collectionData.owner.id}`)}>
								{collectionData.owner.display_name}
							</span>
							<div className={headerStyles.delimiter}></div>
							<span className={headerStyles.numberSongs}>{collectionData.tracks.items.length} songs</span>
							<div className={headerStyles.delimiter}></div>
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
				<img className={headerStyles.background} src={collectionData.images[0].url} alt="background" />
				<div className={headerStyles.header}>
					<img className={headerStyles.cover} src={collectionData.images[0].url} alt={collectionData.name} />
					<div className={headerStyles.playlistInfo}>
						<h3 className={headerStyles.type}>{collectionData.album_type}</h3>
						<h1 className={headerStyles.name}>{collectionData.name}</h1>
						<div className={headerStyles.aboutInfo}>
							<span className={headerStyles.artist} onClick={() => navigate(`/artist/${collectionData.artists[0].id}`)}>
								{collectionData.artists[0].name}
							</span>
							<div className={headerStyles.delimiter}></div>
							<span className={headerStyles.numberSongs}>{collectionData.tracks.items.length} songs</span>
							<div className={headerStyles.delimiter}></div>
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
				<img className={headerStyles.background} style={{ height: '300px' }} src={collectionData.images[0].url} alt="background" />
				<div className={headerStyles.header}>
					<img className={headerStyles.cover} src={collectionData.images[0]?.url ?? collectionData.images[0].url} alt={collectionData.name} />
					<div className={headerStyles.playlistInfo}>
						<h3 className={headerStyles.type}>Artist</h3>
						<h1>{collectionData.name}</h1>
						<h3>{collectionData.followers.total.toLocaleString()} followers</h3>
					</div>
				</div>
			</>
		);
	}

	return null;
}