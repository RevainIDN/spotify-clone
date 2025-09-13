import searchStyles from './Search.module.css'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { type RootState } from '../../store';

import { useNavigate } from 'react-router-dom';

import { getCategories, getSearchResult } from '../../services/Search/search';
import { type CategoriesResponse } from '../../types/search/searchTypes';

import { mapPlaylistToSimplified, mapAlbumToSimplified, mapArtistToSimplified } from '../../services/Selections/selections';
import { type SimplifiedMappedPlaylistItem, type SimplifiedMappedAlbumItem, type SimplifiedMappedArtistItem } from '../../types/collection/generalTypes';

import PlaylistSection from '../../components/SectionModule/PlaylistSection/PlaylistSection';
import AlbumsSection from '../../components/SectionModule/AlbumsSection/AlbumsSection';
import ArtistSection from '../../components/SectionModule/ArtistSection/ArtistSection';
import Loader from '../../components/common/Loader';

export default function Search() {
	const [categories, setCategories] = useState<CategoriesResponse | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [searchResults, setSearchResults] = useState<any>(null);

	const token = useSelector((state: RootState) => state.auth.accessToken);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCategories = async () => {
			const data = await getCategories(token);
			setCategories(data);
		};

		fetchCategories();
	}, []);

	useEffect(() => {
		if (searchQuery === '') {
			setSearchResults(null);
			return;
		}
		setTimeout(() => {
			const fetchSearchResults = async () => {
				if (searchQuery && searchQuery !== '') {
					const data = await getSearchResult(token, searchQuery.trim());
					setSearchResults(data);
				}
			};

			fetchSearchResults();
		}, 1000)
	}, [searchQuery]);

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