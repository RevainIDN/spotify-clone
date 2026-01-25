import { createPortal } from "react-dom";

// Компонент для отображения модальных окон используя React Portal
// Это позволяет отрендерить компоненты в отдельном DOM узле (modal-root) вне иерархии основного приложения
export default function ModalPortal({ children }: { children: React.ReactNode }) {
	const modalRoot = document.getElementById("modal-root");
	if (!modalRoot) return null;

	// Отправляем элементы в modal-root вместо текущего родителя
	return createPortal(children, modalRoot);
}