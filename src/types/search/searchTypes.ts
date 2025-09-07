export interface CategoriesResponse {
	categories: Categories;
}

interface Categories {
	href: string;
	limit: number;
	next: string | null;
	offset: number;
	previous: string | null;
	total: number;
	items: CategoryObject[];
}

interface CategoryObject {
	href: string;
	icons: CategoryIcon[];
	id: string;
	name: string;
}

interface CategoryIcon {
	url: string;
	height: number | null;
	width: number | null;
}