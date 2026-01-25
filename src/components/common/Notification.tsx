import notificationStyles from './Notification.module.css'

interface NotificationProps {
	message: string;
}

// Компонент уведомления для отображения сообщений пользователю о выполненных действиях.
export default function Notification({ message }: NotificationProps) {
	return (
		<div className={notificationStyles.notification}>
			{message}
		</div>
	)
}