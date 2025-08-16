import headerStyles from './CollectionHeader.module.css';
import { type Playlist } from '../../../types/collection/playlistTypes';
import { type Album } from '../../../types/collection/albumTypes';
import { normalizeTracks } from '../../../utils/normalize';
import { isCollectionOfType } from '../../../utils/typeGuard';
import { formatDuration } from '../../../utils/formatDuration';

interface CollectionHeaderProps {
	collectionData: Playlist | Album;
}

export default function CollectionHeader({ collectionData }: CollectionHeaderProps) {
	// Нормализация треков
	const tracks = normalizeTracks(collectionData);

	// Общее время прослушивания
	const totalListeningTime = formatDuration(
		tracks.reduce((acc, t) => acc + t.track.duration_ms, 0)
	);

	// Имя автора коллекции
	const collectionAuthorName = isCollectionOfType<Playlist>(collectionData, "playlist")
		? collectionData.owner?.display_name ?? 'Unknown'
		: isCollectionOfType<Album>(collectionData, "album")
			? collectionData.artists?.[0]?.name ?? 'Unknown'
			: 'Unknown';

	// Тип коллекции
	const collectionType =
		'public' in collectionData
			? collectionData.public
				? 'Public Playlist'
				: 'Non-public playlist'
			: collectionData.album_type
				? collectionData.album_type[0].toUpperCase() + collectionData.album_type.slice(1)
				: 'Collection';

	return (
		<>
			<img className={headerStyles.background} src={collectionData?.images[0].url} alt="background" />
			<div className={headerStyles.header}>
				<img className={headerStyles.cover} src={collectionData?.images[0].url} alt={collectionData?.name} />
				<div className={headerStyles.playlistInfo}>
					<h3 className={headerStyles.type}>{collectionType}</h3>
					<h1 className={headerStyles.name}>{collectionData?.name}</h1>
					<div className={headerStyles.aboutInfo}>
						<span className={headerStyles.artist}>{collectionAuthorName}</span>
						<div className={headerStyles.delimiter}></div>
						<span className={headerStyles.numberSongs}>
							{collectionData?.tracks.items.length} {collectionData?.tracks.items.length === 1 ? 'song' : 'songs'}
						</span>
						<div className={headerStyles.delimiter}></div>
						<span className={headerStyles.totalTime}>{totalListeningTime}</span>
					</div>
				</div>
			</div>
		</>
	)
}