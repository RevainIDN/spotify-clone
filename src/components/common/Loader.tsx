import loader from './Loader.module.css'

// Компонент загрузки, отображающий анимированный спиннер во время получения данных.
export default function Loader() {
	return (
		<div className={loader.loaderWrapper}>
			<div className={loader.loader}></div>
		</div>
	)
}
