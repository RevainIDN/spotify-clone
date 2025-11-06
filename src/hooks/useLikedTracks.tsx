import { useEffect, useState, useCallback } from 'react';
import { checkLikedTracks, saveLikedTrack, deleteLikedTrack } from '../services/User/likedTracks';
import { useSelector, useDispatch } from 'react-redux';
import { setNotification } from '../store/general';
import type { RootState, AppDispatch } from '../store';

export function useLikedTracks(trackIds: string[] | null) {
	const token = useSelector((state: RootState) => state.auth.accessToken);
	const [likedTracks, setLikedTracks] = useState<boolean[]>([]);
	const dispatch = useDispatch<AppDispatch>();

	// Проверка, какие треки лайкнуты
	useEffect(() => {
		if (!token || !trackIds || trackIds.length === 0) {
			setLikedTracks([]);
			return;
		}

		let cancelled = false;

		const fetchLikedTracks = async () => {
			try {
				const chunks: boolean[] = [];

				for (let i = 0; i < trackIds.length; i += 50) {
					const chunk = trackIds.slice(i, i + 50);
					const result = await checkLikedTracks(token, chunk);

					if (Array.isArray(result)) {
						chunks.push(...result);
					} else {
						chunks.push(...Array(chunk.length).fill(false));
					}
				}

				if (!cancelled) {
					setLikedTracks(chunks);
				}
			} catch (error) {
				console.error('Failed to fetch liked tracks:', error);
				if (!cancelled) {
					setLikedTracks(Array(trackIds.length).fill(false));
				}
			}
		};

		fetchLikedTracks();

		return () => {
			cancelled = true;
		};
	}, [trackIds, token]);

	// Переключатель лайков
	const toggleLike = useCallback(
		async (trackId: string, index: number) => {
			if (!token) return;

			try {
				if (likedTracks[index]) {
					await deleteLikedTrack(token, trackId);
					setLikedTracks(prev => {
						const copy = [...prev];
						copy[index] = false;
						return copy;
					});
					dispatch(setNotification('Removed from the "Liked Songs" playlist'));
				} else {
					await saveLikedTrack(token, trackId);
					setLikedTracks(prev => {
						const copy = [...prev];
						copy[index] = true;
						return copy;
					});
					dispatch(setNotification('Added to the "Liked Songs" playlist'));
				}
			} catch (error) {
				console.error(error);
				dispatch(setNotification('Something went wrong'));
			}
		},
		[token, likedTracks, dispatch]
	);

	return { likedTracks, toggleLike };
}