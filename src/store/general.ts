import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Состояние для управления общим UI (навигация, уведомления, модальные режимы)
interface GeneralState {
	navigation: string;
	notification: string | null;
	editMode?: boolean;
	confirmDeletePlaylistMode?: boolean;
}

const initialState: GeneralState = {
	navigation: '',
	notification: null,
	editMode: false,
	confirmDeletePlaylistMode: false,
};

// Redux слайс для хранения общего состояния приложения (уведомления, режимы редактирования и т.д.)
const generalSlice = createSlice({
	name: "navigation",
	initialState,
	reducers: {
		// Сохраняет текущий путь навигации
		setNavigation(state, action: PayloadAction<string>) {
			state.navigation = action.payload;
		},
		// Сохраняет сообщение уведомления (отображается и автоматически скрывается)
		setNotification(state, action: PayloadAction<string | null>) {
			state.notification = action.payload;
		},
		// Включает/отключает режим редактирования плейлиста
		setEditMode(state, action: PayloadAction<boolean>) {
			state.editMode = action.payload;
		},
		// Включает/отключает режим подтверждения удаления плейлиста
		setConfirmDeletePlaylistMode(state, action: PayloadAction<boolean>) {
			state.confirmDeletePlaylistMode = action.payload;
		}
	},
});

export const { setNavigation, setNotification, setEditMode, setConfirmDeletePlaylistMode } = generalSlice.actions;
export default generalSlice.reducer;
