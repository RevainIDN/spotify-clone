import volumeSliderStyles from './VolumeSlider.module.css'
import { useState, useEffect, useRef } from 'react';

interface VolumeSliderProps {
	player: Spotify.Player | null;
}

const MAX_VOLUME = 0.2;

export default function VolumeSlider({ player }: VolumeSliderProps) {
	const [volume, setVolume] = useState(0.5);
	const sliderRef = useRef<HTMLDivElement>(null);
	const dragging = useRef(false);

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

	const onMouseDown = (e: React.MouseEvent) => {
		dragging.current = true;
		setVolumeFromEvent(e.nativeEvent);
		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
	};

	const onMouseMove = (e: MouseEvent) => {
		if (!dragging.current) return;
		setVolumeFromEvent(e);
	};

	const onMouseUp = () => {
		dragging.current = false;
		window.removeEventListener('mousemove', onMouseMove);
		window.removeEventListener('mouseup', onMouseUp);
	};

	useEffect(() => {
		return () => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
		};
	}, []);

	return (
		<div
			className={volumeSliderStyles.volumeControl}
			ref={sliderRef}
			onMouseDown={onMouseDown}>
			<div
				className={volumeSliderStyles.currentVolume}
				style={{ width: `${volume * 100}%` }}
			/>
		</div>
	);
}