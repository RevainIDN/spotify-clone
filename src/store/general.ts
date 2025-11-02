import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface GeneralState {
	navigation: string;
	notification: string | null;
}

const initialState: GeneralState = {
	navigation: '',
	notification: null,
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
		}
	},
});

export const { setNavigation, setNotification } = authSlice.actions;
export default authSlice.reducer;
