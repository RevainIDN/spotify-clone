import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import generalReducer from './general';
import playerReducer from './playerSlice';
import userReduces from './userSlice';
import dropdownReducer from './dropdownSlice';

// Конфигурация Redux store с подключением всех редьюсеров
const store = configureStore({
	reducer: {
		auth: authReducer,
		general: generalReducer,
		player: playerReducer,
		user: userReduces,
		dropdown: dropdownReducer,
	},
	// Игнорируем сериализацию для player объекта Spotify, так как он содержит функции
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['player/setPlayer'],
				ignoredPaths: ['player.player'],
			},
		}),
});

export default store;
// Тип для получения RootState из store
export type RootState = ReturnType<typeof store.getState>;
// Тип для dispatch с поддержкой async actions
export type AppDispatch = typeof store.dispatch;