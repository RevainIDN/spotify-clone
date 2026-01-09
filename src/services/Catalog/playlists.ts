import axios from "axios";

export async function getPlaylist(token: string, id: string | undefined) {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

export async function createPlaylist(token: string, userId: string | undefined, name: string, description: string) {
	try {
		const response = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
			name: name,
			description: description
		}, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

export async function changePlaylistDetails(token: string, playlistId: string | undefined, name: string) {
	try {
		await axios.put(`https://api.spotify.com/v1/playlists/${playlistId}`, {
			name: name
		}, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
	} catch (error) {
		console.error(error);
	}
}

export async function changePlaylistCoverImage(token: string, playlistId: string, image: File) {
	const base64Image = await fileToBase64(image);

	await axios.put(
		`https://api.spotify.com/v1/playlists/${playlistId}/images`,
		base64Image,
		{
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'image/jpeg',
			},
		}
	);
}

function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result as string;
			resolve(result.replace(/^data:image\/jpeg;base64,/, ''));
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}