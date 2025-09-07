import searchStyles from './Search.module.css'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { type RootState } from '../../store';

import { useNavigate } from 'react-router-dom';

import { getCategories } from '../../services/Search/search';
import { type CategoriesResponse } from '../../types/search/searchTypes';

import Loader from '../../components/common/Loader';

export default function Search() {
	const [categories, setCategories] = useState<CategoriesResponse | null>(null);
	const token = useSelector((state: RootState) => state.auth.accessToken);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCategories = async () => {
			const data = await getCategories(token);
			setCategories(data);
		};

		fetchCategories();
	}, []);

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
					/>
				</div>
			</nav>
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