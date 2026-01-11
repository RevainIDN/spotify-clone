import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type UserProfile } from "../types/user/userProfileTypes";
import { type UserPlaylistsResponse } from "../types/user/userCollectionsTypes";

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

const userSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setUserProfileData(state, action: PayloadAction<UserProfile>) {
			state.userProfileData = action.payload;
		},
		setUserPlaylists(state, action: PayloadAction<UserPlaylistsResponse>) {
			state.userPlaylists = action.payload;
		},
		addUserPlaylist(state, action: PayloadAction<UserPlaylistsResponse['items'][number]>) {
			if (!state.userPlaylists) return;
			state.userPlaylists.items.unshift(action.payload);
		},
		setIsUserSubscribedToPlaylist(state, action: PayloadAction<boolean[] | null>) {
			state.isUserSubscribedToPlaylist = action.payload;
		},
		setIsUserSubscribedToAlbum(state, action: PayloadAction<boolean[] | null>) {
			state.isUserSubscribedToAlbum = action.payload;
		},
		setIsUserSubscribedToArtist(state, action: PayloadAction<boolean[] | null>) {
			state.isUserSubscribedToArtist = action.payload;
		},
		removeUserPlaylist(state, action: PayloadAction<string>) {
			if (!state.userPlaylists) return;

			state.userPlaylists.items = state.userPlaylists.items.filter(
				playlist => playlist.id !== action.payload
			);
		},
		updatePlaylistName: (state, action) => {
			const { playlistId, newName } = action.payload;

			const playlist = state.userPlaylists?.items.find(
				p => p.id === playlistId
			);

			if (playlist) {
				playlist.name = newName;
			}
		},
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
		}
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
	updatePlaylistCover
} = userSlice.actions;
export default userSlice.reducer;
