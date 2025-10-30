import section from './Section.module.css'
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { type SimplifiedMappedItem } from '../../types/collection/generalTypes';
import { extractYear } from '../../utils/extractYear';

import PlayButton from '../../components/common/PlayButton';

function Item({ data }: { data: SimplifiedMappedItem }) {
	const [isHovered, setIsHovered] = useState(false);
	const navigate = useNavigate();

	const handleClick = () => {
		switch (data.type) {
			case 'playlist':
				navigate(`/playlist/${data.id}`);
				break;
			case 'album':
				navigate(`/album/${data.id}`);
				break;
			case 'artist':
				navigate(`/artist/${data.id}`);
				break;
		}
	};

	return (
		<>
			{data.type === 'playlist' && (
				<li key={data.id} className={section.item} onClick={handleClick}>
					<img className={section.playlistImage} src={data.images[0]?.url} alt={data.name} />
					<span className={section.playlistTitle}>{data.name}</span>
					<ul className={section.playlistDescription}>
						<li className={section.playlistArtist}>{data.ownerName}</li>
					</ul>
				</li>
			)}
			{data.type === 'album' && (
				<li
					onClick={handleClick}
					className={section.albumItem}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					<div className={section.albumImageContainer}>
						<img className={section.albumImage} src={data.images[0]?.url} alt={data.name} />
						<PlayButton albumId={data.id} isHovered={isHovered} />
					</div>
					<span className={section.albumTitle}>{data.name}</span>
					<ul className={section.albumDescription}>
						<li className={section.albumYear}>{extractYear(data.release_date)}</li>
						<li className='delimiter'></li>
						<li className={section.albumType}>
							{data.album_type === 'album' ? 'Album'
								: data.album_type === 'single' ? 'Single'
									: data.album_type === 'compilation' ? 'Compilation'
										: 'Signle'}
						</li>
					</ul>
				</li>
			)}
			{data.type === 'artist' && (
				<li onClick={handleClick} className={section.artistItem}>
					<img className={section.artistImage} src={data.images[0]?.url} alt={data.name} />
					<span className={section.artistTitle}>{data.name}</span>
					<span className={section.artistType}>{data.type && 'Artist'}</span>
				</li>
			)}
		</>
	)
}

export default function Section() {
	const { state } = useLocation();

	return (
		<div className='content'>
			<h1 className={section.title}>{state.title}</h1>
			<ul className={section.list}>
				{state.items.map((playlist: SimplifiedMappedItem) => (
					<Item key={playlist.id} data={playlist} />
				))}
			</ul>
		</div>
	)
}