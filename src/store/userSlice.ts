import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type UserProfile } from "../types/user/userProfileTypes";
import { type UserPlaylistsResponse } from "../types/user/userCollectionsTypes";

// Состояние пользователя: профиль, плейлисты, статусы подписок
interface UserState {
	userProfileData: UserProfile | null;
	userPlaylists: UserPlaylistsResponse | null;
	isUserSubscribedToPlaylist: boolean[] | null;
	isUserSubscribedToAlbum: boolean[] | null;
	isUserSubscribedToArtist?: boolean[] | null;
}

const initialState: UserState = {
	userProfileData: null,
	userPlaylists: null,
	isUserSubscribedToPlaylist: null,
	isUserSubscribedToAlbum: null,
	isUserSubscribedToArtist: null
};

// Redux слайс для управления профилем, плейлистами и статусами подписок пользователя
const userSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		// Сохраняет информацию профиля пользователя (имя, фото, email и т.д.)
		setUserProfileData(state, action: PayloadAction<UserProfile>) {
			state.userProfileData = action.payload;
		},
		// Сохраняет список плейлистов пользователя
		setUserPlaylists(state, action: PayloadAction<UserPlaylistsResponse>) {
			state.userPlaylists = action.payload;
		},
		// Добавляет новый плейлист в начало списка
		addUserPlaylist(state, action: PayloadAction<UserPlaylistsResponse['items'][number]>) {
			if (!state.userPlaylists) return;
			state.userPlaylists.items.unshift(action.payload);
		},
		// Сохраняет массив флагов о подписке на плейлисты
		setIsUserSubscribedToPlaylist(state, action: PayloadAction<boolean[] | null>) {
			state.isUserSubscribedToPlaylist = action.payload;
		},
		// Сохраняет массив флагов о сохранении альбомов в библиотеку
		setIsUserSubscribedToAlbum(state, action: PayloadAction<boolean[] | null>) {
			state.isUserSubscribedToAlbum = action.payload;
		},
		// Сохраняет массив флагов о подписке на исполнителей
		setIsUserSubscribedToArtist(state, action: PayloadAction<boolean[] | null>) {
			state.isUserSubscribedToArtist = action.payload;
		},
		// Удаляет плейлист из списка по ID
		removeUserPlaylist(state, action: PayloadAction<string>) {
			if (!state.userPlaylists) return;

			state.userPlaylists.items = state.userPlaylists.items.filter(
				playlist => playlist.id !== action.payload
			);
		},
		// Обновляет название плейлиста в списке
		updatePlaylistName: (state, action) => {
			const { playlistId, newName } = action.payload;

			const playlist = state.userPlaylists?.items.find(
				p => p.id === playlistId
			);

			if (playlist) {
				playlist.name = newName;
			}
		},
		// Обновляет обложку плейлиста в списке
		updatePlaylistCover: (state, action: PayloadAction<{ playlistId: string; coverUrl: string }>) => {
			const playlist = state.userPlaylists?.items.find(
				p => p.id === action.payload.playlistId
			);

			if (playlist) {
				playlist.images = [
					{
						url: action.payload.coverUrl,
						width: null,
						height: null,
					},
				];
			}
		},
		// Сбрасывает состояние пользователя при выходе
		resetUserState() {
			return initialState;
		},
	},
});

export const {
	setUserProfileData,
	setUserPlaylists,
	addUserPlaylist,
	setIsUserSubscribedToPlaylist,
	setIsUserSubscribedToAlbum,
	setIsUserSubscribedToArtist,
	removeUserPlaylist,
	updatePlaylistName,
	updatePlaylistCover,
	resetUserState
} = userSlice.actions;
export default userSlice.reducer;
