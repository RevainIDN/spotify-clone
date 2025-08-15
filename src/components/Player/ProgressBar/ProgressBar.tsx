import progressBarStyles from './ProgressBar.module.css';
import { useState, useEffect, useRef } from 'react';

interface ProgressBarProps {
	player: Spotify.Player | null;
}

export default function ProgressBar({ player }: ProgressBarProps) {
	const [position, setPosition] = useState(0);
	const [duration, setDuration] = useState(0);
	const [dragging, setDragging] = useState(false);
	const [paused, setPaused] = useState(true);

	const progressBarRef = useRef<HTMLDivElement>(null);
	const intervalRef = useRef<number | null>(null);

	const formatTime = (ms: number) => {
		const totalSeconds = Math.floor(ms / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	};

	useEffect(() => {
		if (!player) return;

		const onStateChanged = (state: Spotify.PlaybackState | null) => {
			if (!state) return;

			setPaused(state.paused);
			setDuration(state.duration);

			if (!dragging) {
				setPosition(state.position);
			}
		};

		player.addListener('player_state_changed', onStateChanged);

		player.getCurrentState().then(onStateChanged);

		return () => {
			player.removeListener('player_state_changed');
		};
	}, [player, dragging]);

	useEffect(() => {
		if (!paused && !dragging) {
			intervalRef.current = window.setInterval(() => {
				setPosition((pos) => {
					if (pos + 250 < duration) {
						return pos + 250;
					} else {
						return duration;
					}
				});
			}, 250);
		} else {
			if (intervalRef.current !== null) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		}

		return () => {
			if (intervalRef.current !== null) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [paused, dragging, duration]);

	const seekToPosition = (clientX: number) => {
		if (!progressBarRef.current || !player || duration === 0) return;

		const rect = progressBarRef.current.getBoundingClientRect();
		let clickPos = clientX - rect.left;
		let percent = Math.min(Math.max(clickPos / rect.width, 0), 1);
		const seekMs = Math.floor(duration * percent);

		setPosition(seekMs);
		player.seek(seekMs).catch(console.error);
	};

	const onMouseDown = (e: React.MouseEvent) => {
		setDragging(true);
		seekToPosition(e.clientX);

		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
	};

	const onMouseMove = (e: MouseEvent) => {
		if (!dragging) return;
		seekToPosition(e.clientX);
	};

	const onMouseUp = () => {
		setDragging(false);
		window.removeEventListener('mousemove', onMouseMove);
		window.removeEventListener('mouseup', onMouseUp);
	};

	return (
		<div className={progressBarStyles.progressBarContainer}>
			<span className={progressBarStyles.currentTime}>{formatTime(position)}</span>
			<div
				className={progressBarStyles.progressBar}
				ref={progressBarRef}
				onMouseDown={onMouseDown}
			>
				<div
					className={progressBarStyles.currentProgress}
					style={{ width: duration ? `${(position / duration) * 100}%` : '0%', }}
				/>
			</div>
			<span className={progressBarStyles.totalTime}>{formatTime(duration)}</span>
		</div>
	);
}