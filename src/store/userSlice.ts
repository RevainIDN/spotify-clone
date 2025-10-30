import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type UserProfile } from "../types/user/userProfileTypes";

interface UserState {
	userProfileData: UserProfile | null;
	isUserSubscribedToPlaylist: boolean[] | null;
	isUserSubscribedToAlbum: boolean[] | null;
	isUserSubscribedToArtist?: boolean[] | null;
}

const initialState: UserState = {
	userProfileData: null,
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

export const { setUserProfileData, setIsUserSubscribedToPlaylist, setIsUserSubscribedToAlbum, setIsUserSubscribedToArtist } = userSlice.actions;
export default userSlice.reducer;
