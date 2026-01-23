import dropDownStyles from './PlaylistDropdown.module.css';
import axios from 'axios';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../store';
import { closeDropdown } from '../../store/dropdownSlice';

interface PlaylistDropdownProps {
	trackUri: string;
	onClose: () => void;
	anchorRef?: React.RefObject<HTMLButtonElement | null>;
	dropdownPositionLeft?: string;
	dropdownPositionUp?: string;
}

export default function PlaylistDropdown({ trackUri, onClose, anchorRef, dropdownPositionLeft, dropdownPositionUp }: PlaylistDropdownProps) {
	const token = useSelector((state: RootState) => state.auth.accessToken);
	const userId = useSelector((state: RootState) => state.user.userProfileData?.id);
	const userPlaylists = useSelector((state: RootState) => state.user.userPlaylists);
	const dropdownRef = useRef<HTMLDivElement | null>(null);
	const dispatch = useDispatch<AppDispatch>();

	const [trackInPlaylists, setTrackInPlaylists] = useState<Record<string, boolean>>({});
	const [initialState, setInitialState] = useState<Record<string, boolean>>({});
	const userTouchedRef = useRef(false);
	const fetchIdRef = useRef(0);

	const [position, setPosition] = useState<'up' | 'down'>('down');

	const ownedPlaylists = userPlaylists?.items.filter(
		playlist => playlist.owner?.id === userId
	) ?? [];

	useLayoutEffect(() => {
		if (!anchorRef?.current || !dropdownRef.current) return;

		const buttonRect = anchorRef.current.getBoundingClientRect();
		const dropdownHeight = dropdownRef.current.offsetHeight;
		const spaceBelow = window.innerHeight - buttonRect.bottom;
		const spaceAbove = buttonRect.top;

		if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
			setPosition('up');
		} else {
			setPosition('down');
		}
	}, [anchorRef]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;

			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(target) &&
				anchorRef?.current &&
				!anchorRef.current.contains(target)
			) {
				dispatch(closeDropdown());
				onClose();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [dispatch, onClose, anchorRef]);

	useEffect(() => {
		let cancelled = false;
		const myFetchId = ++fetchIdRef.current;

		const fetchTrackState = async () => {
			if (!token || !trackUri || !userPlaylists?.items) {
				if (!cancelled) {
					setInitialState({});
					setTrackInPlaylists(prev => prev ?? {});
				}
				return;
			}

			try {
				const stateFromServer: Record<string, boolean> = {};

				for (const playlist of ownedPlaylists) {
					const response = await axios.get(
						`https://api.spotify.com/v1/playlists/${playlist.id}/tracks?fields=items(track(uri))&limit=100`,
						{ headers: { Authorization: `Bearer ${token}` } }
					);
					const uris: string[] = response.data.items
						.map((item: any) => item?.track?.uri)
						.filter(Boolean);
					stateFromServer[playlist.id] = uris.includes(trackUri);
				}

				if (cancelled) return;
				if (myFetchId !== fetchIdRef.current) return;

				setTrackInPlaylists(prev => {
					if (!prev || Object.keys(prev).length === 0) {
						return stateFromServer;
					}
					const merged: Record<string, boolean> = { ...stateFromServer };
					for (const k of Object.keys(prev)) merged[k] = prev[k];
					return merged;
				});

				setInitialState(stateFromServer);
			} catch (err) {
				console.error('Ошибка при получении состояния трека в плейлистах:', err);
			}
		};

		userTouchedRef.current = false;
		setTrackInPlaylists({});
		setInitialState({});

		fetchTrackState();

		return () => {
			cancelled = true;
		};
	}, [token, trackUri, userPlaylists]);

	const handlePlaylistToggle = (playlistId: string) => {
		userTouchedRef.current = true;
		setTrackInPlaylists(prev => {
			const prevVal = prev?.[playlistId] ?? false;
			return { ...prev, [playlistId]: !prevVal };
		});
	};

	// Ready видна, если хотя бы одна галочка выбрана
	const hasChanges = Object.keys(trackInPlaylists).some(
		key => trackInPlaylists[key] !== (initialState[key] ?? false)
	);

	// Сохраняем изменения на сервер
	const handleReady = async () => {
		if (!token) return;

		for (const playlistId of Object.keys(trackInPlaylists)) {
			if (trackInPlaylists[playlistId] !== (initialState[playlistId] ?? false)) {
				try {
					if (trackInPlaylists[playlistId]) {
						await axios.post(
							`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
							{ uris: [trackUri] },
							{ headers: { Authorization: `Bearer ${token}` } }
						);
					} else {
						await axios({
							method: 'DELETE',
							url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
							headers: { Authorization: `Bearer ${token}` },
							data: { tracks: [{ uri: trackUri }] }
						});
					}
				} catch (err) {
					console.error('Ошибка при обновлении плейлиста:', err);
				}
			}
		}

		setInitialState({ ...trackInPlaylists });
		userTouchedRef.current = false;
		dispatch(closeDropdown());
		onClose();
	};

	return (
		<div
			ref={dropdownRef}
			className={`${dropDownStyles.dropdown} ${position === 'up' ? dropDownStyles.up : dropDownStyles.down}`}
			style={{ left: `${dropdownPositionLeft}`, bottom: `${dropdownPositionUp}` }}
		>
			<h3 className={dropDownStyles.dropdownTitle}>Add to playlist</h3>
			<ul className={dropDownStyles.dropdownList}>
				{ownedPlaylists?.map(playlist => (
					<li className={dropDownStyles.dropdownItem} key={playlist.id}>
						<div className={dropDownStyles.playlistInfoWrapper}>
							<img className={dropDownStyles.playlistCover} src={playlist?.images?.[0]?.url ?? '/Collection/default-cover.jpg'} alt="Cover" />
							<div className={dropDownStyles.playlistInfo}>
								<h3 className={dropDownStyles.playlistName}>{playlist.name}</h3>
								<p className={dropDownStyles.songCount}>{playlist.tracks?.total} songs</p>
							</div>
						</div>
						<label className={dropDownStyles.radioWrapper}>
							<input
								className={dropDownStyles.radioButton}
								type="checkbox"
								value={playlist.id}
								checked={!!trackInPlaylists[playlist.id]}
								onChange={() => handlePlaylistToggle(playlist.id)}
							/>
							<span className={dropDownStyles.customRadio}></span>
						</label>
					</li>
				))}
			</ul>
			<div className={dropDownStyles.dropdownActions}>
				<button className={dropDownStyles.cancelButton} onClick={() => onClose()}>Cancel</button>
				{hasChanges && (
					<button className={dropDownStyles.readyButton} onClick={handleReady}>Ready</button>
				)}
			</div>
		</div>
	)
}