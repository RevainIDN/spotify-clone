import playButtonStyles from './PlayButton.module.css';
import { useState, useEffect, useRef, useMemo } from 'react';
import { usePlaybackControls } from '../../hooks/usePlaybackControls';
import { normalizeTracks } from '../../utils/normalize';

import { type Playlist } from '../../types/collection/playlistTypes';
import { type Album } from '../../types/collection/albumTypes';

import { useSelector } from 'react-redux';
import { type RootState } from '../../store';

interface PlayButtonProps {
	albumId?: string;
	playlistId?: string;
	trackUri?: string;
	availableMarkets?: string[];
	isHovered?: boolean;
}

// Кнопка воспроизведения для альбомов, плейлистов или отдельных треков с автоматической загрузкой коллекции при необходимости.
export default function PlayButton({ albumId, playlistId, trackUri, availableMarkets = [], isHovered }: PlayButtonProps) {
	const { currentTrackUri, isPlaying } = useSelector((state: RootState) => state.player);
	const [collectionData, setCollectionData] = useState<Album | Playlist | undefined>();
	const [shouldPlay, setShouldPlay] = useState(false);
	const token = useSelector((state: RootState) => state.auth.accessToken);

	const { playCollection, playTrack } = usePlaybackControls({ collectionData: collectionData, isShuffled: false });

	const playCollectionRef = useRef(playCollection);
	useEffect(() => {
		playCollectionRef.current = playCollection;
	}, [playCollection]);

	// Определяет, находимся ли в режиме одного трека или полной коллекции.
	const isTrackMode = !!trackUri;

	// Проверяет, является ли текущий воспроизводимый трек частью данной коллекции.
	const isCurrentFromCollection = useMemo(() => {
		if (!collectionData || !currentTrackUri) return false;
		const tracks = normalizeTracks(collectionData);
		const uris = tracks
			.filter(t => t.track && t.track.uri && t.track.available_markets.length > 0)
			.map(t => t.track.uri);
		return uris.includes(currentTrackUri);
	}, [collectionData, currentTrackUri]);

	// Определяет, активна ли в данный момент кнопка (равно ли это текущему воспроизводящемуся треку/коллекции).
	const isActivePlaying = isPlaying && (isTrackMode ? (trackUri === currentTrackUri) : isCurrentFromCollection);

	// Запускает воспроизведение коллекции после её загрузки.
	useEffect(() => {
		if (collectionData && shouldPlay && (albumId || playlistId)) {
			playCollectionRef.current();
			setShouldPlay(false);
		}
	}, [collectionData, shouldPlay, albumId, playlistId]);

	// Получает данные альбома или плейлиста с сервера Spotify по ID.
	const fetchCollectionData = async (): Promise<Album | Playlist | null> => {
		if (!token) return null;
		if (albumId) {
			const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			if (!response.ok) {
				console.error('Ошибка fetch альбома:', response.status);
				return null;
			}
			const data = await response.json();
			return data;
		} else if (playlistId) {
			const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			if (!response.ok) {
				console.error('Ошибка fetch плейлиста:', response.status);
				return null;
			}
			const data = await response.json();
			return data;
		}
		return null;
	};

	// Загружает данные коллекции при наличии активного воспроизведения для проверки содержимого.
	useEffect(() => {
		const loadCollectionIfPlaying = async () => {
			if (isPlaying && !collectionData && (albumId || playlistId)) {
				const data = await fetchCollectionData();
				if (data) {
					setCollectionData(data);
				}
			}
		};

		loadCollectionIfPlaying();
	}, [isPlaying, collectionData, albumId, playlistId, token]);

	// Обрабатывает клик по кнопке: воспроизводит трек или загружает коллекцию и инициирует воспроизведение.
	const handleClick = async (e: React.MouseEvent) => {
		e.stopPropagation();

		if (isTrackMode && trackUri) {
			await playTrack(trackUri, availableMarkets);
		} else if (albumId || playlistId) {
			const data = await fetchCollectionData();
			if (!data) return;

			console.log(data);
			setCollectionData(data);
			setShouldPlay(true);
		}
	};

	return (
		<>
			<button
				className={playButtonStyles.playButton} onClick={handleClick}
				style={{ opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(15px)' }}
			>
				<img
					src={isActivePlaying ? '/Options/pause.svg' : '/Options/play.svg'}
					alt={isActivePlaying ? 'Pause' : 'Play'}
				/>
			</button>
		</>
	)
}