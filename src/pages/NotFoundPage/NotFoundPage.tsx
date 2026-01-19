import notFoundPageStyles from './NotFoundPage.module.css';

export default function NotFoundPage() {
	return (
		<div className='content'>
			<div className={notFoundPageStyles.notFoundPage}>
				<h1 className={notFoundPageStyles.title}>404</h1>
				<p className={notFoundPageStyles.description}>Page not found</p>
			</div>
		</div>
	)
}