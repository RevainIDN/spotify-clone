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
		setIsUserSubscribedToPlaylist(state, action: PayloadAction<boolean[] | null>) {
			state.isUserSubscribedToPlaylist = action.payload;
		},
		setIsUserSubscribedToAlbum(state, action: PayloadAction<boolean[] | null>) {
			state.isUserSubscribedToAlbum = action.payload;
		},
		setIsUserSubscribedToArtist(state, action: PayloadAction<boolean[] | null>) {
			state.isUserSubscribedToArtist = action.payload;
		}
	},
});

export const { setUserProfileData, setUserPlaylists, setIsUserSubscribedToPlaylist, setIsUserSubscribedToAlbum, setIsUserSubscribedToArtist } = userSlice.actions;
export default userSlice.reducer;
