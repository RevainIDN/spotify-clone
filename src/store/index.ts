import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import playlistsReducer from "./playlists/playlistsSlice";
import generalReducer from './general'

const store = configureStore({
	reducer: {
		auth: authReducer,
		playlists: playlistsReducer,
		general: generalReducer,
	},
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;