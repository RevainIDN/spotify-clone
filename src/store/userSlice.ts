import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type UserProfile } from "../types/user/userProfileTypes";

interface UserState {
	userProfileData: UserProfile | null;
}

const initialState: UserState = {
	userProfileData: null,
};

const userSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setUserProfileData(state, action: PayloadAction<UserProfile>) {
			state.userProfileData = action.payload;
		},
	},
});

export const { setUserProfileData } = userSlice.actions;
export default userSlice.reducer;
