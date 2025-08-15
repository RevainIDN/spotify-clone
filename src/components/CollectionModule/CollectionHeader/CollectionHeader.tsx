import headerStyles from './CollectionHeader.module.css';
import { type Playlist } from '../../../types/playlists/playlistTypes';
import { formatDuration } from '../../../utils/formatDuration';

interface CollectionHeaderProps {
	collectionData: Playlist
}

export default function CollectionHeader({ collectionData }: CollectionHeaderProps) {
	// Получение общего времени прослушивания
	const totalListeningTime = () => {
		const totalTime = collectionData?.tracks.items.reduce((acc, track) => acc + track.track.duration_ms, 0);
		return formatDuration(totalTime);
	}

	return (
		<>
			<img className={headerStyles.background} src={collectionData?.images[0].url} alt="background" />
			<div className={headerStyles.header}>
				<img className={headerStyles.cover} src={collectionData?.images[0].url} alt={collectionData?.name} />
				<div className={headerStyles.playlistInfo}>
					<h3 className={headerStyles.type}>{collectionData?.public ? 'Public Playlist' : 'Non-public playlist'}</h3>
					<h1 className={headerStyles.name}>{collectionData?.name}</h1>
					<div className={headerStyles.aboutInfo}>
						<span className={headerStyles.artist}>{collectionData?.owner.display_name}</span>
						<div className={headerStyles.delimiter}></div>
						<span className={headerStyles.numberSongs}>
							{collectionData?.tracks.items.length} {collectionData?.tracks.items.length === 1 ? 'song' : 'songs'}
						</span>
						<div className={headerStyles.delimiter}></div>
						<span className={headerStyles.totalTime}>{totalListeningTime()}</span>
					</div>
				</div>
			</div>
		</>
	)
}