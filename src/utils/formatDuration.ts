// Конвертирует миллисекунды в строку формата mm:ss или h:mm:ss
export function formatDuration(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);

	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	const paddedMinutes = minutes.toString().padStart(2, '0');
	const paddedSeconds = seconds.toString().padStart(2, '0');

	if (hours > 0) {
		return `${hours}:${paddedMinutes}:${paddedSeconds}`;
	} else {
		return `${minutes}:${paddedSeconds}`;
	}
}