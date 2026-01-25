import overlay from './Overlay.module.css';

import { useDispatch } from 'react-redux';
import { type AppDispatch } from '../../store';
import { setEditMode, setConfirmDeletePlaylistMode } from '../../store/general';

// Полупрозрачный оверлей, закрывающий модальные окна редактирования и удаления плейлиста при клике.
export default function Overlay() {
	const dispatch = useDispatch<AppDispatch>();

	// Закрывает оба режима (редактирование и удаление) при клике на оверлей.
	const handleClose = () => {
		dispatch(setEditMode(false));
		dispatch(setConfirmDeletePlaylistMode(false));
	}

	return <div className={overlay.overlay} onClick={handleClose}></div>;
}