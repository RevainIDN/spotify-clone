import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Состояние для управления Spotify access токеном
interface AuthState {
	accessToken: string | null;
}

const initialState: AuthState = {
	accessToken: null,
};

// Redux слайс для хранения и управления access токеном авторизации
const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		// Сохраняет access токен в Redux состояние
		setAccessToken(state, action: PayloadAction<string | null>) {
			state.accessToken = action.payload;
		},
	},
});

export const { setAccessToken } = authSlice.actions;
export default authSlice.reducer;
