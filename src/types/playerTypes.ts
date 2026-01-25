// Типы для управления состоянием плеера и текущего трека

export interface CurrentTrack {
	name: string;
	artists: string[];
	albumImage: string;
	track: string;
}