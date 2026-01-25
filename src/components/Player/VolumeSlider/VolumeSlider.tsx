import volumeSliderStyles from './VolumeSlider.module.css'
import { useState, useEffect, useRef } from 'react';

interface VolumeSliderProps {
	player: Spotify.Player | null;
	setHoveredButton: React.Dispatch<React.SetStateAction<string | null>>;
}

const MAX_VOLUME = 0.2;

// Компонент для управления громкостью воспроизведения с поддержкой отключения и восстановления громкости.
export default function VolumeSlider({ player, setHoveredButton }: VolumeSliderProps) {
	const [volume, setVolume] = useState(0.5);
	// Сохранённая громкость для восстановления при повторном включении звука.
	const [savedVolume, setSavedVolume] = useState(0);
	const sliderRef = useRef<HTMLDivElement>(null);
	const dragging = useRef(false);

	// Устанавливает громкость на основе позиции курсора по полосе громкости.
	const setVolumeFromEvent = (e: MouseEvent | TouchEvent) => {
		if (!sliderRef.current || !player) return;

		let clientX: number;
		if (e instanceof MouseEvent) {
			clientX = e.clientX;
		} else if (e instanceof TouchEvent) {
			clientX = e.touches[0].clientX;
		} else {
			return;
		}

		const rect = sliderRef.current.getBoundingClientRect();
		let relativePos = (clientX - rect.left) / rect.width;
		relativePos = Math.min(Math.max(relativePos, 0), 1);

		setVolume(relativePos);

		const actualVolume = relativePos * MAX_VOLUME;
		player.setVolume(actualVolume).catch(console.error);
	};

	// Переключает звук: если громкость > 0, сохраняет текущее значение и отключает звук, иначе восстанавливает сохранённую громкость.
	const volumeToggle = () => {
		if (!player) return;

		if (volume > 0) {
			setSavedVolume(volume);
			player.setVolume(0).catch(console.error);
			setVolume(0);
		} else {
			player.setVolume(savedVolume * MAX_VOLUME).catch(console.error);
			setVolume(savedVolume);
		}
	}

	// Инициирует перетаскивание полосы громкости при нажатии мыши.
	const onMouseDown = (e: React.MouseEvent) => {
		dragging.current = true;
		setVolumeFromEvent(e.nativeEvent);
		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
	};

	// Обновляет громкость при движении мыши во время перетаскивания.
	const onMouseMove = (e: MouseEvent) => {
		if (!dragging.current) return;
		setVolumeFromEvent(e);
	};

	// Завершает перетаскивание при отпускании кнопки мыши.
	const onMouseUp = () => {
		dragging.current = false;
		window.removeEventListener('mousemove', onMouseMove);
		window.removeEventListener('mouseup', onMouseUp);
	};

	// Очищает обработчики событий при размонтировании компонента.
	useEffect(() => {
		return () => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
		};
	}, []);

	return (
		<div className={volumeSliderStyles.options}>
			<button
				className={volumeSliderStyles.volumeIcon}
				onMouseEnter={() => setHoveredButton('volume')}
				onMouseLeave={() => setHoveredButton(null)}
				onClick={volumeToggle}
			>
				{volume === 0 ? (
					<svg width="9" height="10" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M0 4.58779V8.58779C0 9.14007 0.447715 9.58779 1 9.58779H3.58579C3.851 9.58779 4.10536 9.69315 4.29289 9.88068L7.29289 12.8807C7.92286 13.5106 9 13.0645 9 12.1736V1.002C9 0.111099 7.92286 -0.335066 7.29289 0.294898L4.29289 3.2949C4.10536 3.48243 3.851 3.58779 3.58579 3.58779H1C0.447715 3.58779 0 4.0355 0 4.58779Z" fill="white" fill-opacity="0.5" />
					</svg>
				) : volume < 0.7 ? (
					<svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M0 8.58779V4.58779C0 4.0355 0.447715 3.58779 1 3.58779H3.58579C3.851 3.58779 4.10536 3.48243 4.29289 3.2949L7.29289 0.294898C7.92286 -0.335066 9 0.111099 9 1.002V12.1736C9 13.0645 7.92286 13.5106 7.29289 12.8807L4.29289 9.88068C4.10536 9.69315 3.851 9.58779 3.58579 9.58779H1C0.447715 9.58779 0 9.14007 0 8.58779ZM11.0357 3.64597C10.6131 3.07395 10.7284 2.15881 11.3846 1.88459C11.7263 1.7418 12.1246 1.81623 12.3635 2.09923C13.3986 3.32579 14.0186 4.8874 14.0186 6.5878C14.0186 8.35337 13.3502 9.96932 12.2426 11.2159C12.0001 11.4889 11.6066 11.555 11.2715 11.41C10.6154 11.126 10.5168 10.1988 10.9561 9.63461C11.6279 8.77168 12.0186 7.71111 12.0186 6.5878C12.0186 5.50962 11.6587 4.48926 11.0357 3.64597Z" fill="white" fill-opacity="0.5" />
					</svg>
				) : (
					<svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M0 8.58779V4.58779C0 4.0355 0.447715 3.58779 1 3.58779H3.58579C3.851 3.58779 4.10536 3.48243 4.29289 3.2949L7.29289 0.294898C7.92286 -0.335066 9 0.111099 9 1.002V12.1736C9 13.0645 7.92286 13.5106 7.29289 12.8807L4.29289 9.88068C4.10536 9.69315 3.851 9.58779 3.58579 9.58779H1C0.447715 9.58779 0 9.14007 0 8.58779ZM11.0357 3.64597C10.6131 3.07395 10.7284 2.15881 11.3846 1.88459C11.7263 1.7418 12.1246 1.81623 12.3635 2.09923C13.3986 3.32579 14.0186 4.8874 14.0186 6.5878C14.0186 8.35337 13.3502 9.96932 12.2426 11.2159C12.0001 11.4889 11.6066 11.555 11.2715 11.41C10.6154 11.126 10.5168 10.1988 10.9561 9.63461C11.6279 8.77168 12.0186 7.71111 12.0186 6.5878C12.0186 5.50962 11.6587 4.48926 11.0357 3.64597ZM14.5228 2.06832C14.1202 1.51069 14.2783 0.675313 14.9128 0.410117C15.2914 0.251898 15.7325 0.350077 15.982 0.675805C17.2507 2.33179 18 4.37593 18 6.58779C18 8.88111 17.1945 10.9941 15.8398 12.6811C15.5853 12.998 15.1474 13.0876 14.7744 12.9262C14.1399 12.6515 13.9958 11.8067 14.4132 11.2555C15.4155 9.93198 16 8.3135 16 6.58779C16 4.926 15.458 3.36365 14.5228 2.06832Z" fill="white" fill-opacity="0.5" />
					</svg>
				)}

			</button>
			<div
				className={volumeSliderStyles.volumeControl}
				ref={sliderRef}
				onMouseDown={onMouseDown}>
				<div
					className={volumeSliderStyles.currentVolume}
					style={{ width: `${volume * 100}%` }}
				/>
			</div>
		</div>
	);
}