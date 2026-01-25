import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type CurrentTrack } from '../types/playerTypes';

// Состояние плеера: информация о текущем треке, устройстве, статусе воспроизведения
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

// Redux слайс для управления состоянием Spotify плеера
export const playerSlice = createSlice({
	name: 'player',
	initialState,
	reducers: {
		// Сохраняет инстанс Spotify Player
		setPlayer(state, action: PayloadAction<Spotify.Player>) {
			state.player = action.payload;
		},
		// Сохраняет ID устройства, на котором будет воспроизводиться музыка
		setDeviceId(state, action: PayloadAction<string>) {
			state.deviceId = action.payload;
		},
		// Сохраняет URI текущего трека
		setCurrentTrackUri(state, action: PayloadAction<string>) {
			state.currentTrackUri = action.payload;
		},
		// Указывает готовность плеера к использованию
		setIsReady(state, action: PayloadAction<boolean>) {
			state.isReady = action.payload;
		},
		// Указывает статус воспроизведения (играет/пауза)
		setIsPlaying(state, action: PayloadAction<boolean>) {
			state.isPlaying = action.payload;
		},
		// Сохраняет информацию о текущем треке (название, исполнитель, обложка)
		setCurrentTrack(state, action: PayloadAction<CurrentTrack | null>) {
			state.currentTrack = action.payload;
		}
	},
});

export const { setPlayer, setDeviceId, setCurrentTrackUri, setIsReady, setIsPlaying, setCurrentTrack } = playerSlice.actions;
export default playerSlice.reducer;