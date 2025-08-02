import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface GeneralState {
	navigation: string;
}

const initialState: GeneralState = {
	navigation: '',
};

const authSlice = createSlice({
	name: "navigation",
	initialState,
	reducers: {
		setNavigation(state, action: PayloadAction<string>) {
			state.navigation = action.payload;
		},
	},
});

export const { setNavigation } = authSlice.actions;
export default authSlice.reducer;
