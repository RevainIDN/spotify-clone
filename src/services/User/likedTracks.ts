import axios from 'axios';

// Получает все лайкнутые треки текущего пользователя
export async function getLikedTracks(token: string) {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/me/tracks`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

// Проверяет, лайкнул ли пользователь указанные треки (возвращает массив boolean)
export async function checkLikedTracks(token: string, trackIds: string[]) {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/me/tracks/contains?ids=${trackIds.join(',')}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

// Добавляет трек в библиотеку лайкнутых треков пользователя
export async function saveLikedTrack(token: string, trackId: string) {
	try {
		await axios.put(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, null, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
	} catch (error) {
		console.error(error);
	}
}

// Удаляет трек из библиотеки лайкнутых треков пользователя
export async function deleteLikedTrack(token: string, trackId: string) {
	try {
		await axios.delete(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
	} catch (error) {
		console.error(error);
	}
}