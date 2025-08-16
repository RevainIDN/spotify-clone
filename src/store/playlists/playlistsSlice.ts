import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type NewReleasesResponse } from "../../types/collection/newReleasesTypes";

interface PlaylistState {
	newReleases: NewReleasesResponse | null;
}

const initialState: PlaylistState = {
	newReleases: null,
};

const playlistSlice = createSlice({
	name: "playlists",
	initialState,
	reducers: {
		setNewReleases(state, action: PayloadAction<NewReleasesResponse | null>) {
			state.newReleases = action.payload;
		},
	},
});

export const { setNewReleases } = playlistSlice.actions;
export default playlistSlice.reducer;	