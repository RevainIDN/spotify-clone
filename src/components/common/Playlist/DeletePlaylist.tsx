import deletePlaylistStyles from './DeletePlaylist.module.css';

import { useDispatch } from 'react-redux';
import { type AppDispatch } from '../../../store';
import { setConfirmDeletePlaylistMode } from '../../../store/general';

import { useNavigate } from 'react-router-dom';

import { unfollowPlaylist } from '../../../services/User/userActivity';
import { removeUserPlaylist } from '../../../store/userSlice';

interface DeletePlaylistProps {
	token: string;
	playlistId: string | undefined;
}

export default function DeletePlaylist({ token, playlistId }: DeletePlaylistProps) {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const handleDelete = async () => {
		if (!playlistId) return;

		dispatch(removeUserPlaylist(playlistId));
		dispatch(setConfirmDeletePlaylistMode(false));
		navigate('/');

		try {
			await unfollowPlaylist(token, playlistId);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<div className={deletePlaylistStyles.deletePlaylist}>
			<h1 className={deletePlaylistStyles.title}>Remove from media library?</h1>
			<p className={deletePlaylistStyles.description}>This playlist will be <strong>removed</strong> from your library.</p>
			<div className={deletePlaylistStyles.buttonContainer}>
				<button className={deletePlaylistStyles.cancelBtn} onClick={() => dispatch(setConfirmDeletePlaylistMode(false))}>Cancel</button>
				<button className={deletePlaylistStyles.deleteBtn} onClick={handleDelete}>Delete</button>
			</div>
		</div>
	)
}