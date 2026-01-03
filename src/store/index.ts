import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import playlistsReducer from "./playlists/playlistsSlice";
import generalReducer from './general';
import playerReducer from './playerSlice';
import userReduces from './userSlice';
import dropdownReducer from './dropdownSlice';

const store = configureStore({
	reducer: {
		auth: authReducer,
		playlists: playlistsReducer,
		general: generalReducer,
		player: playerReducer,
		user: userReduces,
		dropdown: dropdownReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['player/setPlayer'],
				ignoredPaths: ['player.player'],
			},
		}),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;