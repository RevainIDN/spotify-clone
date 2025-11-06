import bestResultStyles from './BestResult.module.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type BestResultItem } from '../../../utils/pickBestResult';

import PlayButton from '../../common/PlayButton';

interface BestResultProps {
	bestResult: BestResultItem | null;
}

export default function BestResult({ bestResult }: BestResultProps) {
	const navigate = useNavigate();
	const [isHovered, setIsHovered] = useState(false);

	if (!bestResult) return null;

	const cover = bestResult.images?.[0]?.url ?? "/placeholder.png";
	const title = bestResult.name;
	const type = bestResult.type;

	const handleArtist = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (type === 'album') {
			navigate(`/artist/${bestResult.artistId}`)
		} else if (type === 'playlist') {
			navigate(`/user/${bestResult.ownerId}`)
		}
	}

	const handleNavigate = () => {
		if (type === 'track') {
			return;
		} else {
			navigate(`/${type}/${bestResult.id}`)
		}
	}

	return (
		<div
			className={bestResultStyles.bestResult}
			onClick={() => handleNavigate()}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<PlayButton
				albumId={type === 'album' ? bestResult.id : undefined}
				playlistId={type === 'playlist' ? bestResult.id : undefined}
				trackUri={type === 'track' ? bestResult.uri : undefined}
				availableMarkets={type === 'track' ? bestResult.available_markets : undefined}
				isHovered={isHovered}
			/>
			<div className={bestResultStyles.coverContainer}>
				{type === 'artist' ? (
					<img className={bestResultStyles.cover} style={{ borderRadius: '50%' }} src={cover} alt={title} />
				) : (
					<img className={bestResultStyles.cover} src={cover} alt={title} />
				)}
			</div>
			<h1 className={bestResultStyles.title}>{title}</h1>
			<h3 className={bestResultStyles.type}>
				{type === 'artist' && 'Artist'}
				{type === 'track' && 'Track'}
				{type === 'album' && 'Album'}
				{type === 'playlist' && 'Playlist'}
				{type === 'user' && 'User'}
				{type === 'album' && (<><div className='delimiter'></div> <span onClick={(e) => handleArtist(e)}>{bestResult.artistName}</span></>)}
				{type === 'playlist' && (<><div className='delimiter'></div> <span onClick={(e) => handleArtist(e)}>{bestResult.ownerName}</span></>)}
			</h3>
		</div>
	)
}