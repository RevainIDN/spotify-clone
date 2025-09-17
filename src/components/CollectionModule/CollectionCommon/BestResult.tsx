import bestResultStyles from './BestResult.module.css'
import { type BestResultItem } from '../../../utils/pickBestResult';
import { useNavigate } from 'react-router-dom';

interface BestResultProps {
	bestResult: BestResultItem | null;
}

export default function BestResult({ bestResult }: BestResultProps) {
	const navigate = useNavigate();

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

	return (
		<div className={bestResultStyles.bestResult} onClick={() => navigate(`/${type}/${bestResult.id}`)}>
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