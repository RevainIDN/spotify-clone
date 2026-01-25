import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Состояние для управления открытым меню дропдауна треков
interface DropdownState {
	openedDropdown: { uri: string; source: 'list' | 'player' } | null
	isOpen: boolean;
}

const initialState: DropdownState = {
	openedDropdown: null as { uri: string; source: 'list' | 'player' } | null,
	isOpen: false,
};

// Redux слайс для управления состоянием контекстного меню (дропдауна) для треков/альбомов
const dropdownSlice = createSlice({
	name: 'dropdown',
	initialState,
	reducers: {
		// Открывает дропдаун для конкретного трека (с указанием источника: плейлист или плеер)
		openDropdown: (state, action: PayloadAction<{ uri: string; source: 'list' | 'player' }>) => {
			state.openedDropdown = action.payload;
			state.isOpen = true;
		},
		// Закрывает текущий открытый дропдаун
		closeDropdown: (state) => {
			state.openedDropdown = null;
			state.isOpen = false;
		},
		// Переключает дропдаун (закрывает, если открыт для этого трека, открывает иначе)
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