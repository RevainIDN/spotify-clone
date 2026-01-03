import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DropdownState {
	openedDropdownUri: string | null;
	isOpen: boolean;
}

const initialState: DropdownState = {
	openedDropdownUri: null,
	isOpen: false,
};

const dropdownSlice = createSlice({
	name: 'dropdown',
	initialState,
	reducers: {
		openDropdown: (state, action: PayloadAction<string>) => {
			state.openedDropdownUri = action.payload;
			state.isOpen = true;
		},
		closeDropdown: (state) => {
			state.openedDropdownUri = null;
			state.isOpen = false;
		},
		toggleDropdown: (state, action: PayloadAction<string>) => {
			if (state.openedDropdownUri === action.payload) {
				state.openedDropdownUri = null;
				state.isOpen = false;
			} else {
				state.openedDropdownUri = action.payload;
				state.isOpen = true;
			}
		},
	},
});

export const { openDropdown, closeDropdown, toggleDropdown } = dropdownSlice.actions;
export default dropdownSlice.reducer;