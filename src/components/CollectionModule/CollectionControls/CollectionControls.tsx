import controlsStyles from './CollectionControls.module.css'
import { type Playlist } from '../../../types/playlists/playlistTypes';

import { useState } from 'react';
import { usePlaybackControls } from '../../../hooks/usePlaybackControls';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../store';

interface CollectionControlsProps {
	collectionData: Playlist;
	isShuffled: boolean;
	setIsShuffled: React.Dispatch<React.SetStateAction<boolean>>;
	filterValue: string;
	setFilterValue: React.Dispatch<React.SetStateAction<string>>;
	sortType: string;
	setSortType: React.Dispatch<React.SetStateAction<string>>;
	sortOrder: 'asc' | 'desc';
	setSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
	sortViewMode: 'List' | 'Compact';
	setSortViewMode: React.Dispatch<React.SetStateAction<'List' | 'Compact'>>;
}

export default function CollectionControls(
	{ collectionData,
		isShuffled,
		setIsShuffled,
		filterValue,
		setFilterValue,
		sortType,
		setSortType,
		sortOrder,
		setSortOrder,
		sortViewMode,
		setSortViewMode
	}: CollectionControlsProps) {
	const { currentTrackUri, isPlaying } = useSelector((state: RootState) => state.player);

	const [hoveredOption, setHoveredOption] = useState<string | null>(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

	const { playPlaylist } = usePlaybackControls({
		collectionData,
		isShuffled
	});

	// Обработка изменения сортировки
	const handleSortChange = (value: string) => {
		if (value === sortType) {
			setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortType(value);
			setSortOrder('asc');
		}
		setIsDropdownOpen(false);
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

	// Найти текущий трек
	const existingTrack = collectionData.tracks.items.find(track => track.track.uri === currentTrackUri);

	return (
		<div className={controlsStyles.options}>
			<div className={controlsStyles.trackOptions}>
				<button className={controlsStyles.playBtn} onClick={playPlaylist}><img src={isPlaying && existingTrack ? "/Options/pause.svg" : "/Options/play.svg"} alt="Play" /></button>
				<button
					className={controlsStyles.mixBtn}
					onClick={() => { setIsShuffled(prev => !prev) }}
				>
					<svg width="46" height="37" viewBox="0 0 46 37" fill="none" xmlns="http://www.w3.org/2000/svg" onMouseEnter={() => setHoveredOption('shuffle')} onMouseLeave={() => setHoveredOption(null)}>
						<path d="M36.2969 22.4561C37.0696 21.6522 38.3221 21.6521 39.0947 22.4561L45.0449 28.6504C45.2361 28.8496 45.2362 29.172 45.0449 29.3711L39.0947 35.5645C38.322 36.3688 37.0696 36.3687 36.2969 35.5645C35.5241 34.7601 35.5241 33.4558 36.2969 32.6514L39.4482 29.3711C39.6394 29.1721 39.6393 28.8495 39.4482 28.6504L36.2969 25.3692C35.5241 24.5648 35.5241 23.2604 36.2969 22.4561ZM34.4639 9.88185H26.873C25.3039 9.88185 23.8107 10.6371 22.7773 11.9541L8.06836 30.7031C6.34617 32.8982 3.85749 34.1572 1.24219 34.1572H0V30.1113H1.24219C2.81137 30.1113 4.30458 29.3551 5.33789 28.0381L20.0479 9.29005C21.77 7.09499 24.2577 5.83497 26.873 5.83497H34.4639V9.88185ZM23.1846 24.4541C24.182 25.7298 25.6231 26.4619 27.1377 26.4619H34.4648V30.3809H27.1377C24.6133 30.3809 22.2112 29.1614 20.5488 27.0352L17.2324 22.8281L19.9531 19.9961L23.1846 24.4541ZM2.4834 3.94728C5.00763 3.94728 7.40897 5.16704 9.07129 7.29298L13.5195 12.6797L10.8838 15.2764L6.43652 9.87404C5.43912 8.59831 3.99804 7.86622 2.4834 7.86622H0.000976562V3.94728H2.4834ZM36.2969 1.47755C37.0696 0.673172 38.322 0.673173 39.0947 1.47755L45.0449 7.67091C45.2361 7.87006 45.2362 8.19252 45.0449 8.39161L39.0947 14.585C38.322 15.3893 37.0696 15.3893 36.2969 14.585C35.5241 13.7806 35.5241 12.4763 36.2969 11.6719L39.4482 8.39161C39.6394 8.19254 39.6393 7.87003 39.4482 7.67091L36.2969 4.38966C35.5241 3.5853 35.5242 2.28194 36.2969 1.47755Z" fill={isShuffled ? '#1ED760' : hoveredOption === 'shuffle' ? '#FFFFFF' : '#FFFFFFB2'} />
					</svg>
				</button>
				<button className={controlsStyles.addBtn}><img src="/Options/add.svg" alt="Add" /></button>
			</div>
			<div className={controlsStyles.filters}>
				<div className={controlsStyles.findInputWrapper}>
					<input
						className={controlsStyles.findInput}
						value={filterValue}
						onChange={(e) => setFilterValue(e.target.value)}
						type="text"
						placeholder='Search in playlist'
					/>
					<img className={controlsStyles.findIcon} src="/Options/find.svg" alt="Find" />
				</div>
				<button
					className={controlsStyles.typeBtn}
					onClick={() => setIsDropdownOpen(prev => !prev)}
				>
					{sortType} <div className={controlsStyles.dropdownArrow}></div>
				</button>
				{isDropdownOpen &&
					<ul className={controlsStyles.dropdownList}>

						{sortValues.map((value) => (
							<li
								key={value.title}
								className={value.type === 'Category' ? controlsStyles.dropdownItemTitle : controlsStyles.dropdownItem}
								onClick={() => {
									if (value.type === 'Category') return;

									if (value.type === 'View mode') {
										setSortViewMode(value.title === 'List' ? 'List' : 'Compact');
									}

									if (value.type === 'Sorting' || value.type === 'Default') {
										handleSortChange(value.title);
									}
								}}
								style={{
									color:
										(value.type === 'Sorting' && sortType === value.title) ||
											(value.type === 'Default' && sortType === value.title) ||
											(value.type === 'View mode' && sortViewMode === value.title)
											? '#1ED760'
											: '#FFFFFF',
								}}
							>
								{value.title}
								{value.type === 'Sorting' && sortType === value.title && (
									<img
										src={sortOrder === 'asc' ? "/Options/arrow-down.svg" : "/Options/arrow-up.svg"}
										alt="Check"
									/>
								)}

								{value.type === 'Default' && sortType === value.title && (
									<img src="/Options/check.svg" alt="Check" />
								)}

								{value.type === 'View mode' && sortViewMode === value.title && (
									<img src="/Options/check.svg" alt="Check" />
								)}
							</li>
						))}
					</ul>}
			</div>
		</div>
	)
}