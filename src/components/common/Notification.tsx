import notificationStyles from './Notification.module.css'

interface NotificationProps {
	message: string;
}

export default function Notification({ message }: NotificationProps) {
	return (
		<div className={notificationStyles.notification}>
			{message}
		</div>
	)
}