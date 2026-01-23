import searchStyles from './Search.module.css'
import { useState, useEffect, useMemo } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { type AppDispatch, type RootState } from '../../store';
import { setNavigation } from '../../store/general';

import { useNavigate } from 'react-router-dom';
import { usePlaybackControls } from '../../hooks/usePlaybackControls';
import { useLikedTracks } from '../../hooks/useLikedTracks';

import { getCategories, getSearchResult } from '../../services/Search/search';
import { type CategoriesResponse } from '../../types/search/searchTypes';

import { mapPlaylistToSimplified, mapAlbumToSimplified, mapArtistToSimplified } from '../../mappers';
import { type SimplifiedMappedPlaylistItem, type SimplifiedMappedAlbumItem, type SimplifiedMappedArtistItem, type RawCombinedResults, type Track } from '../../types/collection/generalTypes';
import { normalizeSingleTrack } from '../../utils/normalize';

import { pickBestResult, type BestResultItem } from '../../utils/pickBestResult';

import PlaylistSection from '../../components/SectionModule/PlaylistSection/PlaylistSection';
import AlbumsSection from '../../components/SectionModule/AlbumsSection/AlbumsSection';
import ArtistSection from '../../components/SectionModule/ArtistSection/ArtistSection';
import CollectionTrack from '../../components/CollectionModule/CollectionTrack/CollectionTrack';
import BestResult from '../../components/CollectionModule/CollectionCommon/BestResult';
import Loader from '../../components/common/Loader';

export default function Search() {
	const [categories, setCategories] = useState<CategoriesResponse | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [searchResults, setSearchResults] = useState<RawCombinedResults | null>(null);
	const [bestResult, setBestResult] = useState<BestResultItem | null>(null);
	const [selectedTrackState, setSelectedTrackState] = useState<string | null>(null);

	const dispatch = useDispatch<AppDispatch>();
	const token = useSelector((state: RootState) => state.auth.accessToken);
	const navigate = useNavigate();

	const { playTrack } = usePlaybackControls({
		collectionData: undefined,
		isShuffled: false
	});

	const trackIds = useMemo(() => {
		return searchResults && searchResults.tracks
			? searchResults.tracks.items
				.filter((t): t is Track => t !== null)
				.map(track => track.id)
			: [];
	}, [searchResults]);

	const { likedTracks, toggleLike } = useLikedTracks(trackIds);

	useEffect(() => {
		if (!token) return;

		if (!searchQuery) {
			setSearchResults(null);
			setBestResult(null);
			return;
		}

		const timer = setTimeout(async () => {
			const data = await getSearchResult(token, searchQuery.trim());
			setSearchResults(data);
			const res = pickBestResult(data, searchQuery);
			setBestResult(res);
		}, 1000);

		return () => clearTimeout(timer);
	}, [searchQuery, token]);

	useEffect(() => {
		if (searchResults) {
			localStorage.setItem('searchResults', JSON.stringify(searchResults))
			localStorage.setItem('searchQuery', JSON.stringify(searchQuery))
		}
	}, [searchResults, searchQuery, token])

	useEffect(() => {
		if (!token) return;

		const fetchCategories = async () => {
			const data = await getCategories(token);
			setCategories(data);
		};

		const storedSearchResult = localStorage.getItem("searchResults");
		const storedSearchQuery = localStorage.getItem('searchQuery');
		if (storedSearchResult && storedSearchQuery) {
			const parsedResults = JSON.parse(storedSearchResult) as RawCombinedResults;
			const parsedQuery = JSON.parse(storedSearchQuery) as string;

			setSearchResults(parsedResults);
			setSearchQuery(parsedQuery);

			const res = pickBestResult(parsedResults, parsedQuery);
			setBestResult(res);
		}

		fetchCategories();
		dispatch(setNavigation('search'))
	}, [token]);

	if (!categories) {
		return <Loader />;
	}

	return (
		<div className={searchStyles.searchPage}>
			<nav className={searchStyles.navbar}>
				<div className={searchStyles.searchInputContainer}>
					<img className={searchStyles.searchIcon} src="/Search/search.svg" alt="" />
					<input
						className={searchStyles.searchInput}
						type="text"
						placeholder='What do you want to listen to?'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</nav>
			{searchResults && searchQuery !== '' && (
				<div className={searchStyles.searchResultsContainer}>
					<div className={searchStyles.bestResultContainer}>
						<div className={searchStyles.bestResult}>
							<h1 className={searchStyles.resultTitle}>Best result</h1>
							<BestResult
								bestResult={bestResult}
							/>
						</div>
						<div className={searchStyles.searchedTracks}>
							<h1 className={searchStyles.resultTitle}>Tracks</h1>
							<table className={searchStyles.tracks}>
								<colgroup>
									<col style={{ width: '8%' }} />
									<col style={{ width: '87%' }} />
									<col style={{ width: '5%' }} />
								</colgroup>
								<tbody>
									{searchResults.tracks && searchResults.tracks.items.length > 0 ? (
										searchResults.tracks.items
											.filter((t): t is Track => t !== null)
											.slice(0, 4)
											.map((track, index) => {
												const normalizedTrack = normalizeSingleTrack(track);

												const isLiked = likedTracks?.[index] ?? false;

												return (
													<CollectionTrack
														key={`${track.id}-${index}`}
														playTrack={playTrack}
														sortViewMode='List'
														track={normalizedTrack}
														index={index}
														displayedIn='search'
														selectedTrackState={selectedTrackState}
														setSelectedTrackState={setSelectedTrackState}
														isLiked={isLiked}
														onToggleLike={() => toggleLike(track.id, index)}
													/>
												);
											})
									) : (
										<tr>
											<td colSpan={3}>No results found</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
					<PlaylistSection
						title="Playlists"
						sectionKey='search-playlists'
						items={
							searchResults.playlists
								? searchResults.playlists.items
									.map(mapPlaylistToSimplified)
									.filter(Boolean) as SimplifiedMappedPlaylistItem[]
								: []
						}
					/>
					<AlbumsSection
						title="Albums"
						sectionKey='search-albums'
						items={
							searchResults.albums
								? searchResults.albums.items
									.map(mapAlbumToSimplified)
									.filter(Boolean) as SimplifiedMappedAlbumItem[]
								: []
						}
					/>
					<ArtistSection
						title="Artists"
						sectionKey='search-artists'
						items={
							searchResults.artists
								? searchResults.artists.items
									.map(mapArtistToSimplified)
									.filter(Boolean) as SimplifiedMappedArtistItem[]
								: []
						}
					/>
				</div>
			)}
			<div className={searchStyles.searchContainer}>
				<h1 className={searchStyles.title}>Browse All</h1>
				<ul className={searchStyles.categoriesList}>
					{categories?.categories.items.map((category) => (
						<li
							key={category.id}
							className={searchStyles.categoryItem}
							onClick={() => navigate(`/search/${category.name}`)}
						>
							<span className={searchStyles.categoryName}>{category.name}</span>
							<img className={searchStyles.categoryImage} src={category.icons[0].url} alt={category.name} />
						</li>
					))}
				</ul>
			</div>

		</div>
	)
}