import editPlaylistStyles from './EditPlaylist.module.css';
import { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../../../store';
import { setEditMode } from '../../../store/general';
import { updatePlaylistName, updatePlaylistCover } from '../../../store/userSlice';

import { type Playlist } from '../../../types/collection/playlistTypes';

import { changePlaylistDetails, changePlaylistCoverImage } from '../../../services/Catalog/playlists';

interface EditPlaylistProps {
	collectionData: Playlist;
}

export default function EditPlaylist({ collectionData }: EditPlaylistProps) {
	const dispatch = useDispatch<AppDispatch>();
	const token = useSelector((state: RootState) => state.auth.accessToken);
	const [isHovered, setIsHovered] = useState(false);
	const [newName, setNewName] = useState(collectionData.name);
	const [newCover, setNewCover] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);

	const playlistFromStore = useSelector((state: RootState) =>
		state.user.userPlaylists?.items.find(
			p => p.id === collectionData.id
		)
	);

	const coverUrl =
		playlistFromStore?.images?.[0]?.url ??
		collectionData.images?.[0]?.url ??
		'/Collection/default-cover.jpg';

	const playlistName = playlistFromStore?.name ?? collectionData.name;

	useEffect(() => {
		setNewName(playlistName);
	}, [playlistName])

	const handleSave = async () => {
		if (newCover && preview) {
			await changePlaylistCoverImage(
				token!,
				collectionData.id,
				newCover
			);

			dispatch(updatePlaylistCover({
				playlistId: collectionData.id,
				coverUrl: preview,
			}));
		}

		if (newName !== collectionData.name) {
			await changePlaylistDetails(token, collectionData.id, newName);

			dispatch(updatePlaylistName({
				playlistId: collectionData.id,
				newName,
			}));
		}

		dispatch(setEditMode(false));
	};

	return (
		<div className={editPlaylistStyles.edit}>
			<h1 className={editPlaylistStyles.editTitle}>Change of information</h1>
			<div className={editPlaylistStyles.editContent}>
				<div className={editPlaylistStyles.coverContent} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
					<img className={editPlaylistStyles.cover} src={preview ?? coverUrl ?? '/Collection/default-cover.jpg'} alt={collectionData.name} />
					<div className={editPlaylistStyles.coverEdit} style={isHovered ? { display: 'flex' } : { display: 'none' }} onClick={() => document.getElementById('playlist-cover-input')?.click()}>
						<svg xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 506 511.95" width={80} height={80}><path fill='white' fillRule="nonzero" d="M400.08 26.04c-1.82-1.81-3.72-3.14-5.7-3.97-1.89-.8-4.05-1.2-6.47-1.2-2.38 0-4.52.41-6.4 1.21-1.95.83-3.83 2.15-5.63 3.96l-36.73 36.73 104.11 104.57 37.22-37.22c1.55-1.54 2.69-3.29 3.44-5.18l.15-.38c.71-1.96 1.06-4.17 1.06-6.56 0-2.49-.4-4.82-1.22-6.89l-.22-.62c-.74-1.64-1.79-3.16-3.16-4.52l-80.45-79.93zM69.03 332.8l105.03 103.23 215.22-215.22-104.09-104.17L69.03 332.8zm86.27 113.97-96.28-94.62-27.86 99.15c-4.45 15.91-7.46 28.06-9.05 36.44 19.79-5.98 40.2-11.61 59.73-18.29 10.75-3.39 21.78-6.87 39.25-12.28l24.1-7.34 10.11-3.06zM402.45 2.91c4.5 1.89 8.61 4.69 12.3 8.37l80.45 79.93c3.35 3.33 5.9 7.12 7.68 11.27l.43.96c1.81 4.57 2.69 9.48 2.69 14.56 0 4.87-.8 9.56-2.45 13.97l-.23.63c-1.79 4.53-4.47 8.67-8.08 12.28l-44.64 44.6c-4.07 4.05-10.66 4.03-14.71-.04L317.04 70.11c-4.07-4.07-4.07-10.68 0-14.76l44.08-44.07c3.65-3.66 7.72-6.45 12.23-8.36C377.92.98 382.77 0 387.91 0c5.1 0 9.94.97 14.54 2.91zM174.77 462.66l-23.54 7.07-24.03 7.32c-30.42 9.57-60.67 18.96-91.16 28.28-10.56 3.19-17.58 5.27-20.89 6.17-1.41.4-2.83.54-4.3.39-6.12-.62-9.68-4.3-10.63-11.06-.33-2.28-.28-5.21.13-8.77 1.03-9 4.62-24.47 10.75-46.39l32.27-114.82c.5-1.78 1.43-3.33 2.66-4.55L277.79 94.52c4.07-4.07 10.68-4.07 14.76 0l118.84 118.97c4.05 4.07 4.03 10.65-.02 14.7l-231.66 231.7a10.373 10.373 0 0 1-4.94 2.77z" /></svg>
					</div>
					<input
						type="file"
						accept="image/jpeg"
						hidden
						id="playlist-cover-input"
						onChange={(e) => {
							const file = e.target.files?.[0];
							if (!file) return;

							setNewCover(file);
							setPreview(URL.createObjectURL(file));
						}}
					/>
				</div>
				<input className={editPlaylistStyles.input} type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
				<div className={editPlaylistStyles.buttonGroup}>
					<button className={editPlaylistStyles.button} onClick={() => dispatch(setEditMode(false))}>Cancel</button>
					<button className={editPlaylistStyles.button} onClick={handleSave}>Save</button>
				</div>
			</div>
		</div>
	)
}	