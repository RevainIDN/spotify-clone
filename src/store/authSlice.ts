import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
	accessToken: string;
}

const initialState: AuthState = {
	accessToken: '',
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setAccessToken(state, action: PayloadAction<string>) {
			state.accessToken = action.payload;
		},
	},
});

export const { setAccessToken } = authSlice.actions;
export default authSlice.reducer;
