import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface PlayerState {
	player: Spotify.Player | null;
	deviceId: string | null;
	currentTrackUri: string | null;
	isReady: boolean;
}

const initialState: PlayerState = {
	player: null,
	deviceId: null,
	currentTrackUri: null,
	isReady: false,
};

export const playerSlice = createSlice({
	name: 'player',
	initialState,
	reducers: {
		setPlayer(state, action: PayloadAction<Spotify.Player>) {
			state.player = action.payload;
		},
		setDeviceId(state, action: PayloadAction<string>) {
			state.deviceId = action.payload;
		},
		setCurrentTrack(state, action: PayloadAction<string>) {
			state.currentTrackUri = action.payload;
		},
		setIsReady(state, action: PayloadAction<boolean>) {
			state.isReady = action.payload;
		}
	},
});

export const { setPlayer, setDeviceId, setCurrentTrack, setIsReady } = playerSlice.actions;
export default playerSlice.reducer;