import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DropdownState {
	openedDropdown: { uri: string; source: 'list' | 'player' } | null
	isOpen: boolean;
}

const initialState: DropdownState = {
	openedDropdown: null as { uri: string; source: 'list' | 'player' } | null,
	isOpen: false,
};

const dropdownSlice = createSlice({
	name: 'dropdown',
	initialState,
	reducers: {
		openDropdown: (state, action: PayloadAction<{ uri: string; source: 'list' | 'player' }>) => {
			state.openedDropdown = action.payload;
			state.isOpen = true;
		},
		closeDropdown: (state) => {
			state.openedDropdown = null;
			state.isOpen = false;
		},
		toggleDropdown: (state, action) => {
			const { uri, source } = action.payload;
			if (
				state.openedDropdown &&
				state.openedDropdown.uri === uri &&
				state.openedDropdown.source === source
			) {
				state.openedDropdown = null;
			} else {
				state.openedDropdown = { uri, source };
			}
		},
	},
});

export const { openDropdown, closeDropdown, toggleDropdown } = dropdownSlice.actions;
export default dropdownSlice.reducer;