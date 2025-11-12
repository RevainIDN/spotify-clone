import playerStyles from './Player.module.css'
import axios from 'axios'

import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { type AppDispatch, type RootState } from '../../store'
import { setIsPlaying, setCurrentTrack, setCurrentTrackUri } from '../../store/playerSlice'
import { setNotification } from '../../store/general'
import { type CurrentTrack } from '../../types/playerTypes'
import { checkLikedTracks, saveLikedTrack, deleteLikedTrack } from '../../services/User/likedTracks'

import VolumeSlider from './VolumeSlider/VolumeSlider'
import ProgressBar from './ProgressBar/ProgressBar'

export default function Player() {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	const { accessToken } = useSelector((state: RootState) => state.auth);
	const { player, deviceId, currentTrack, currentTrackUri, isPlaying } = useSelector((state: RootState) => state.player);
	const [isTrackLiked, setIsTrackLiked] = useState<boolean>(false);

	const [lastTrack, setLastTrack] = useState<CurrentTrack | null>(null);
	const [hoveredButton, setHoveredButton] = useState<string | null>(null);

	const trackTitleRef = useRef<HTMLHeadingElement>(null);
	const [animationDistance, setAnimationDistance] = useState(0);
	const [shouldAnimate, setShouldAnimate] = useState(false);

	const displayTrack = currentTrack ?? lastTrack;

	// Загрузка последнего трека из localStorage при монтировании
	useEffect(() => {
		const saved = localStorage.getItem('lastTrack');
		if (saved) {
			const parsed = JSON.parse(saved);
			setLastTrack(parsed);
			dispatch(setCurrentTrack(parsed));
			dispatch(setCurrentTrackUri(parsed.track));
		}
	}, [dispatch]);

	// Сохранение текущего трека в localStorage при изменении
	useEffect(() => {
		if (trackTitleRef.current) {
			const containerWidth = trackTitleRef.current.parentElement?.clientWidth ?? 0;
			const textWidth = trackTitleRef.current.scrollWidth;

			if (textWidth > containerWidth) {
				setAnimationDistance(textWidth - containerWidth);
				setShouldAnimate(true);
			} else {
				setAnimationDistance(0);
				setShouldAnimate(false);
			}
		}
	}, [displayTrack?.name]);

	// Проверка, лайкнут ли текущий трек
	const lastCheckedId = useRef<string | null>(null);
	useEffect(() => {
		if (!accessToken || !player || !currentTrackUri) return;

		const trackId = currentTrackUri.split(':').pop();
		if (!trackId || trackId === lastCheckedId.current) return;

		lastCheckedId.current = trackId;

		const checkIfTrackIsLiked = async () => {
			try {
				const response = await checkLikedTracks(accessToken, [trackId]);
				setIsTrackLiked(response[0]);
			} catch (error) {
				console.error('Ошибка при проверке лайка трека:', error);
			}
		};

		checkIfTrackIsLiked();
	}, [accessToken, player, currentTrackUri]);

	// Получение текущего трека с проверкой на изменение URI
	const updateCurrentTrack = async () => {
		try {
			const res = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
				headers: { Authorization: `Bearer ${accessToken}` }
			});

			const newUri = res.data?.item?.uri;
			if (newUri && newUri !== currentTrackUri) {
				dispatch(setCurrentTrackUri(newUri));
			}
		} catch (err) {
			console.error('Ошибка при получении текущего трека', err);
		}
	};

	// Периодическое обновление текущего трека
	useEffect(() => {
		if (!accessToken) return;

		const interval = setInterval(() => {
			updateCurrentTrack();
		}, 5000);

		return () => clearInterval(interval);
	}, [accessToken]);

	// Воспроизведение/пауза трека
	const playTrack = async () => {
		if (!player || !currentTrackUri) return;
		const state = await player.getCurrentState();
		if (state?.paused) {
			await player.resume();
		} else {
			await player.pause();
		}

		dispatch(setIsPlaying(!isPlaying));
	}

	// Переход к альбому или артисту по клику
	const handleAlbum = async () => {
		const state = await player?.getCurrentState();
		const albumUri = state?.track_window.current_track.album.uri;
		if (!albumUri) return;

		const albumId = albumUri.split(":").pop();
		navigate(`/album/${albumId}`);
	};

	// Переход к артисту по клику
	const handleArtist = async (name: string) => {
		const state = await player?.getCurrentState();
		const artists = state?.track_window.current_track.artists;

		if (!artists) return;

		const artist = artists.find(a => a.name === name);

		if (artist) {
			const artistId = artist.uri.split(":").pop();
			navigate(`/artist/${artistId}`);
		}
	};

	// Воспроизведение следующего трека
	const playNext = async () => {
		if (!player || !currentTrackUri) return;
		try {
			await axios.post('https://api.spotify.com/v1/me/player/next', null, {
				headers: { Authorization: `Bearer ${accessToken}` },
				params: { device_id: deviceId }
			});

			await new Promise(res => setTimeout(res, 300));
			await updateCurrentTrack();
		} catch (error) {
			console.error('Error playing next track:', error);
		}
	};

	// Воспроизведение предыдущего трека
	const playPrevious = async () => {
		if (!player || !currentTrackUri) return;
		try {
			await axios.post('https://api.spotify.com/v1/me/player/previous', null, {
				headers: { Authorization: `Bearer ${accessToken}` },
				params: { device_id: deviceId }
			});

			await new Promise(res => setTimeout(res, 300));
			await updateCurrentTrack();
		} catch (error) {
			console.error('Error playing previous track:', error);
		}
	};

	// Обработка понравившегося трека
	const handleLikedTrack = async () => {
		if (!player || !currentTrackUri) return;

		const trackId = currentTrackUri.split(':').pop();
		if (!trackId) return;

		try {
			if (isTrackLiked) {
				await deleteLikedTrack(accessToken, trackId);
				setIsTrackLiked(false);
				dispatch(setNotification('Removed from the "Liked Songs" playlist'));
			} else {
				await saveLikedTrack(accessToken, trackId);
				setIsTrackLiked(true);
				dispatch(setNotification('Added to the "Liked Songs" playlist'));
			}
		} catch (error) {
			console.error('Ошибка при добавлении/удалении лайка:', error);
		}
	}

	return (
		<div className={playerStyles.player}>
			<div className={playerStyles.trackInfo}>
				<img className={playerStyles.trackImage} src={displayTrack?.albumImage} alt="" />
				<div className={playerStyles.trackDetails}>
					<div className={playerStyles.marqueeContainer}>
						<h2
							className={`${playerStyles.trackTitle} ${shouldAnimate ? playerStyles.animate : ''}`}
							ref={trackTitleRef}
							onClick={handleAlbum}
							style={{
								'--marquee-distance': animationDistance + 'px',
								animationDuration: `${animationDistance / 20}s`,
							} as React.CSSProperties}
						>
							{displayTrack?.name}
						</h2>
					</div>
					<ul className={playerStyles.trackArtistList}>
						{displayTrack?.artists.map((artist, index) => (
							<li key={index} className={playerStyles.trackArtist} onClick={() => handleArtist(artist)} >
								{artist}
								{index < displayTrack.artists.length - 1 && ', '}
							</li>
						))}
					</ul>
				</div>
				<img
					className={playerStyles.addToFavorites}
					src={isTrackLiked ? '/Player/favorite-active.svg' : '/Player/add-to-favorite.svg'}
					alt="Favorite"
					onClick={handleLikedTrack}
				/>
			</div>
			<div className={playerStyles.progressContainer}>
				<div className={playerStyles.controls}>
					<button
						className={playerStyles.previousTrackBtn}
						onClick={playPrevious}
						onMouseEnter={() => setHoveredButton('previous')}
						onMouseLeave={() => setHoveredButton(null)}
					>
						<svg width={hoveredButton === 'previous' ? '22' : '20'} height={hoveredButton === 'previous' ? '22' : '20'} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M13 3L5 7.619V3.5H3V13.5H5V9.381L13 14V3Z" fill={hoveredButton === 'previous' ? '#FFFFFF' : '#B2B2B2'} />
						</svg>
					</button>
					<button
						className={playerStyles.playBtn}
						onClick={playTrack}>
						<img src={
							isPlaying
								? '/Player/pause.svg'
								: '/Player/play.svg'
						} alt="Play/Pause" />
					</button>
					<button
						className={playerStyles.nextTrackBtn}
						onClick={playNext}
						onMouseEnter={() => setHoveredButton('next')}
						onMouseLeave={() => setHoveredButton(null)}
					>
						<svg width={hoveredButton === 'next' ? '22' : '20'} height={hoveredButton === 'next' ? '22' : '20'} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M3 3L11 7.619V3.5H13V13.5H11V9.381L3 14V3Z" fill={hoveredButton === 'next' ? '#FFFFFF' : '#B2B2B2'} />
						</svg>
					</button>
				</div>
				<ProgressBar player={player} />
			</div>
			<div className={playerStyles.options}>
				<button
					className={playerStyles.volumeIcon}
					onMouseEnter={() => setHoveredButton('volume')}
					onMouseLeave={() => setHoveredButton(null)}
				>
					<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M9.79154 0.75L9.29837 1.32713C10.4912 2.43298 11.2423 4.0078 11.2423 5.7581C11.2423 7.50839 10.4904 9.08321 9.29837 10.1891L9.79078 10.7662C10.4868 10.1308 11.0427 9.35726 11.4231 8.495C11.8034 7.63275 11.9999 6.70069 12 5.75826C12.0001 4.81584 11.8037 3.88374 11.4235 3.02143C11.0432 2.15912 10.4874 1.38553 9.79154 0.75V0.75ZM8.07301 2.76201L7.5806 3.33914C7.90185 3.65488 8.15699 4.03144 8.33113 4.44685C8.50527 4.86226 8.59493 5.3082 8.59486 5.75863C8.59479 6.20907 8.50499 6.65498 8.33072 7.07033C8.15645 7.48569 7.90119 7.86217 7.57984 8.17781L8.07225 8.75493C8.8589 7.99854 9.35132 6.93656 9.35132 5.75885C9.35132 4.58114 8.85966 3.51841 8.07301 2.76201V2.76201ZM0 3.48891V8.02728H2.12093L6.05116 10.2965V1.21972L2.12093 3.48891H0ZM5.29477 2.5298V8.98639L2.32365 7.27089H0.756396V4.2453H2.32365L5.29477 2.5298Z" fill={hoveredButton ? "#FFFFFF" : "#B2B2B2"} />
					</svg>

				</button>
				<VolumeSlider player={player} />
			</div>
		</div>
	)
}