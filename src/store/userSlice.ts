import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type UserProfile } from "../types/user/userProfileTypes";

interface UserState {
	userProfileData: UserProfile | null;
	isUserSubscribedToPlaylist: boolean[] | null;
}

const initialState: UserState = {
	userProfileData: null,
	isUserSubscribedToPlaylist: null
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
	},
});

export const { setUserProfileData, setIsUserSubscribedToPlaylist } = userSlice.actions;
export default userSlice.reducer;
