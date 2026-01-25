import axios from "axios";

// Проверяет, подписан ли пользователь на плейлист
export async function getIsUserSubscribedToPlaylist(token: string, id: string) {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/playlists/${id}/followers/contains`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
		return response.data
	} catch (error) {
		console.log(error)
	}
}

// Подписывает пользователя на плейлист
export async function followPlaylist(token: string, id: string | undefined) {
	try {
		const response = await axios.put(
			`https://api.spotify.com/v1/playlists/${id}/followers`,
			{ public: false },
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json"
				},
			}
		);
		return response.status;
	} catch (error) {
		console.log(error)
	}
}

// Отписывает пользователя от плейлиста
export async function unfollowPlaylist(token: string, id: string | undefined) {
	try {
		const response = await axios.delete(
			`https://api.spotify.com/v1/playlists/${id}/followers`,
			{
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		)
		return response.status;
	} catch (error) {
		console.log(error)
	}
}

// Проверяет, сохранил ли пользователь указанные альбомы в библиотеку
export async function getIsUserSubscribedToAlbums(token: string, ids: string[]) {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/me/albums/contains`, {
			headers: {
				Authorization: `Bearer ${token}`
			},
			params: {
				ids: ids.join(',')
			}
		})
		return response.data
	} catch (error) {
		console.log(error)
	}
}

// Добавляет альбом в библиотеку пользователя
export async function followAlbum(token: string, id: string | undefined) {
	if (!token || !id) {
		console.warn("followAlbum: отсутствует token или id");
		return;
	}

	try {
		const response = await axios.put(
			`https://api.spotify.com/v1/me/albums`,
			null, // тело не нужно
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				params: {
					ids: id,
				},
			}
		);

		return response.status;
	} catch (error) {
		console.error("Ошибка при подписке на альбом:", error);
	}
}

// Удаляет альбом из библиотеки пользователя
export async function unfollowAlbum(token: string, id: string | undefined) {
	if (!token || !id) {
		console.warn("unfollowAlbum: отсутствует token или id");
		return;
	}

	try {
		const response = await axios.delete(
			`https://api.spotify.com/v1/me/albums`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				params: {
					ids: id,
				},
			}
		);

		return response.status;
	} catch (error) {
		console.error("Ошибка при отписке от альбома:", error);
	}
}

// Проверяет, подписан ли пользователь на указанных исполнителей
export async function getIsUserSubscribedToArtist(token: string, ids: string[]) {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/me/following/contains`, {
			headers: {
				Authorization: `Bearer ${token}`
			},
			params: {
				type: 'artist',
				ids: ids.join(',')
			}
		})
		return response.data
	} catch (error) {
		console.log(error)
	}
}

// Подписывает пользователя на исполнителя
export async function followArtist(token: string, id?: string) {
	if (!token || !id) return;
	try {
		const res = await axios.put(
			`https://api.spotify.com/v1/me/following`,
			null,
			{
				headers: { Authorization: `Bearer ${token}` },
				params: { type: "artist", ids: id },
			}
		);
		return res.status;
	} catch (err) {
		console.error("Ошибка при подписке на артиста:", err);
	}
}

// Отписывает пользователя от исполнителя
export async function unfollowArtist(token: string, id?: string) {
	if (!token || !id) return;
	try {
		const res = await axios.delete(
			`https://api.spotify.com/v1/me/following`,
			{
				headers: { Authorization: `Bearer ${token}` },
				params: { type: "artist", ids: id },
			}
		);
		return res.status;
	} catch (err) {
		console.error("Ошибка при отписке от артиста:", err);
	}
}