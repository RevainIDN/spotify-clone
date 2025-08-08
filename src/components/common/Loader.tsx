import loader from './Loader.module.css'

export default function Loader() {
	return (
		<div className={loader.loaderWrapper}>
			<div className={loader.loader}></div>
		</div>
	)
}
