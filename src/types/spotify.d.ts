export { };

declare global {
	interface Window {
		onSpotifyWebPlaybackSDKReady: () => void;
		Spotify: Spotify.SpotifyNamespace;
	}

	namespace Spotify {
		interface SpotifyNamespace {
			Player: new (options: PlayerInit) => Player;
		}

		interface PlayerInit {
			name: string;
			getOAuthToken: (cb: (token: string) => void) => void;
			volume?: number;
		}

		interface Player {
			connect(): Promise<boolean>;
			disconnect(): void;
			addListener(event: string, callback: (data: any) => void): boolean;
			removeListener(event: string): boolean;
			pause(): Promise<void>;
			resume(): Promise<void>;
			togglePlay(): Promise<void>;
			seek(position_ms: number): Promise<void>;
			getCurrentState(): Promise<PlaybackState | null>;
		}

		interface PlaybackState {
			position: number;
			duration: number;
			paused: boolean;
			track_window: {
				current_track: Track;
			};
		}

		interface Track {
			uri: string;
			name: string;
			album: {
				images: Array<{ url: string }>;
				name: string;
			};
			artists: Array<{ name: string }>;
		}
	}
}