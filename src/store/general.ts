import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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

const authSlice = createSlice({
	name: "navigation",
	initialState,
	reducers: {
		setNavigation(state, action: PayloadAction<string>) {
			state.navigation = action.payload;
		},
		setNotification(state, action: PayloadAction<string | null>) {
			state.notification = action.payload;
		},
		setEditMode(state, action: PayloadAction<boolean>) {
			state.editMode = action.payload;
		},
		setConfirmDeletePlaylistMode(state, action: PayloadAction<boolean>) {
			state.confirmDeletePlaylistMode = action.payload;
		}
	},
});

export const { setNavigation, setNotification, setEditMode, setConfirmDeletePlaylistMode } = authSlice.actions;
export default authSlice.reducer;
