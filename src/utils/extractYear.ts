// Извлекает год (четырёхзначное число) из строки даты
export function extractYear(dateStr: string): string | null {
	const match = dateStr.match(/\b\d{4}\b/);
	return match ? match[0] : null;
}