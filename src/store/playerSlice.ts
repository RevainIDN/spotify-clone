import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type CurrentTrack } from '../types/playerTypes';

interface PlayerState {
	player: Spotify.Player | null;
	deviceId: string | null;
	currentTrackUri: string | null;
	isReady: boolean;
	isPlaying: boolean;
	currentTrack: CurrentTrack | null;
}

const initialState: PlayerState = {
	player: null,
	deviceId: null,
	currentTrackUri: null,
	isReady: false,
	isPlaying: false,
	currentTrack: null,
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
		setCurrentTrackUri(state, action: PayloadAction<string>) {
			state.currentTrackUri = action.payload;
		},
		setIsReady(state, action: PayloadAction<boolean>) {
			state.isReady = action.payload;
		},
		setIsPlaying(state, action: PayloadAction<boolean>) {
			state.isPlaying = action.payload;
		},
		setCurrentTrack(state, action: PayloadAction<CurrentTrack | null>) {
			state.currentTrack = action.payload;
		}
	},
});

export const { setPlayer, setDeviceId, setCurrentTrackUri, setIsReady, setIsPlaying, setCurrentTrack } = playerSlice.actions;
export default playerSlice.reducer;