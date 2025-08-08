export function formatDate(dateString: string): string {
	const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
	const date = new Date(dateString);

	const day = date.getDate();
	const month = months[date.getMonth()];
	const year = date.getFullYear();

	return `${day} ${month} ${year}`;
}