import progressBarStyles from './ProgressBar.module.css';
import { useState, useEffect, useRef } from 'react';
import { formatTime } from '../../../utils/formatTime';

interface ProgressBarProps {
	player: Spotify.Player | null;
}

// Компонент для отображения прогресса воспроизведения и управления позицией трека.
export default function ProgressBar({ player }: ProgressBarProps) {
	const [position, setPosition] = useState(0);
	const [duration, setDuration] = useState(0);
	// Флаг, указывающий, находится ли пользователь в процессе перетаскивания полосы прогресса.
	const [dragging, setDragging] = useState(false);
	const [paused, setPaused] = useState(true);

	const progressBarRef = useRef<HTMLDivElement>(null);
	const intervalRef = useRef<number | null>(null);

	// Подписывается на события Spotify SDK для отслеживания изменений состояния воспроизведения.
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

	// Обновляет текущую позицию трека при воспроизведении, если пользователь не перетаскивает полосу.
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

	// Устанавливает позицию воспроизведения на основе позиции клика по полосе прогресса.
	const seekToPosition = (clientX: number) => {
		if (!progressBarRef.current || !player || duration === 0) return;

		const rect = progressBarRef.current.getBoundingClientRect();
		let clickPos = clientX - rect.left;
		let percent = Math.min(Math.max(clickPos / rect.width, 0), 1);
		const seekMs = Math.floor(duration * percent);

		setPosition(seekMs);
		player.seek(seekMs).catch(console.error);
	};

	// Инициирует перетаскивание полосы прогресса при нажатии мыши.
	const onMouseDown = (e: React.MouseEvent) => {
		setDragging(true);
		seekToPosition(e.clientX);

		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
	};

	// Обновляет позицию трека при движении мыши во время перетаскивания.
	const onMouseMove = (e: MouseEvent) => {
		if (!dragging) return;
		seekToPosition(e.clientX);
	};

	// Завершает перетаскивание при отпускании кнопки мыши.
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