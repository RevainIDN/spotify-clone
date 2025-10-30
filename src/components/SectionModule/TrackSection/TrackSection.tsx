import trackSectionStyles from './TrackSection.module.css';
import { useState } from 'react';
import { type SimplifiedMappedTrackItem } from '../../../types/collection/generalTypes';

import { useNavigate } from 'react-router-dom';

import PlayButton from '../../common/PlayButton';

interface TracksSectionProps {
	title: string;
	items: SimplifiedMappedTrackItem[];
}

function TrackItem({ track }: { track: SimplifiedMappedTrackItem }) {
	const [isHovered, setIsHovered] = useState(false);
	const navigate = useNavigate();

	return (
		<li
			onClick={() => { navigate(`/album/${track.album?.id}`) }}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className={trackSectionStyles.trackItem}
		>
			<div className={trackSectionStyles.trackImageContainer}>
				<img className={trackSectionStyles.trackImage} src={track.images[0]?.url} alt={track.name} />
				<PlayButton trackUri={track.uri} availableMarkets={track.available_markets} isHovered={isHovered} />
			</div>
			<span className={trackSectionStyles.trackTitle}>{track.name}</span>
			<ul className={trackSectionStyles.trackDescription}>
				<li className={trackSectionStyles.trackArtist}>{track.artists.map(artist => artist.name).join(', ')}</li>
			</ul>
		</li>
	);
}

export default function TrackSection({ title, items }: TracksSectionProps) {
	return (
		<div className={trackSectionStyles.trackSection}>
			<div className={trackSectionStyles.header}>
				<h1 className={trackSectionStyles.title}>{title}</h1>
			</div>
			<ul className={trackSectionStyles.tracks}>
				{items.map(track => (
					<TrackItem key={track.id} track={track} />
				))}
			</ul>
		</div>
	);
}