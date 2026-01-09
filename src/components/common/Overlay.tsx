import overlay from './Overlay.module.css';

import { useDispatch } from 'react-redux';
import { type AppDispatch } from '../../store';
import { setEditMode } from '../../store/general';

export default function Overlay() {
	const dispatch = useDispatch<AppDispatch>();

	const handleClose = () => {
		dispatch(setEditMode(false));
	}

	return <div className={overlay.overlay} onClick={handleClose}></div>;
}