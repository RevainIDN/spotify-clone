import player from './Player.module.css'

export default function Player() {
	return (
		<div className={player.player}>
			<div className={player.trackInfo}>
				<img className={player.trackImage} src="/Player/example-album.png" alt="" />
				<div className={player.trackDetails}>
					<h2 className={player.trackTitle}>Some cool song</h2>
					<h3 className={player.trackArtist}>Some cool artist</h3>
				</div>
				<img className={player.addToFavorites} src="/Player/add-to-favorite.svg" alt="" />
			</div>
			<div className={player.progressContainer}>
				<div className={player.controls}>
					<button className={player.previousTrack}>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M13 3L5 7.619V3.5H3V13.5H5V9.381L13 14V3Z" fill="#B2B2B2" />
						</svg>
					</button>
					<button className={player.playPause}><img src="/Player/play.svg" alt="Play/Pause" /></button>
					<button className={player.nextTrack}>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M3 3L11 7.619V3.5H13V13.5H11V9.381L3 14V3Z" fill="#B2B2B2" />
						</svg>
					</button>
				</div>
				<div className={player.progressBarContainer}>
					<span className={player.currentTime}>0:00</span>
					<div className={player.progressBar}></div>
					<span className={player.totalTime}>0:00</span>
				</div>
			</div>
			<div className={player.options}>
				<button className={player.volumeIcon}><img src="/Player/volume.svg" alt="Volume" /></button>
				<div className={player.volumeControl}></div>
			</div>
		</div>
	)
}