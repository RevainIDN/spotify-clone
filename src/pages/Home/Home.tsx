import home from './Home.module.css'
import PlaylistSection from '../../components/PlaylistSection/PlaylistSection';
import { usePlaylistsOverview } from '../../hooks/usePlaylistsOverview';
import { type SimplifiedMappedPlaylistItem } from '../../types/playlists/generalTypes';
import { mapPlaylistToSimplified } from '../../services/Playlists/playlists';

interface HomeProps {
	token: string | null;
}

export default function Home({ token }: HomeProps) {
	const { newReleases, popPlaylists, rockPlaylists, relaxPlaylists } = usePlaylistsOverview(token);

	return (
		<div className={home.home}>
			{newReleases.isLoading ? (
				<div className={home.skeletonLoader}></div>
			) : (
				<PlaylistSection
					title="New Releases"
					sectionKey='new-releases'
					items={newReleases.data?.albums.items || []}
				/>
			)}
			{popPlaylists.isLoading ? (
				<div className={home.skeletonLoader}></div>
			) : (
				<PlaylistSection
					title="Pop"
					sectionKey='pop'
					items={
						popPlaylists.data
							? popPlaylists.data.playlists.items
								.map(mapPlaylistToSimplified)
								.filter(Boolean) as SimplifiedMappedPlaylistItem[]
							: []
					}
				/>
			)}
			{rockPlaylists.isLoading ? (
				<div className={home.skeletonLoader}></div>
			) : (
				<PlaylistSection
					title="Rock"
					sectionKey='rock'
					items={
						rockPlaylists.data
							? rockPlaylists.data.playlists.items
								.map(mapPlaylistToSimplified)
								.filter(Boolean) as SimplifiedMappedPlaylistItem[]
							: []
					}
				/>
			)}
			{relaxPlaylists.isLoading ? (
				<div className={home.skeletonLoader}></div>
			) : (
				<PlaylistSection
					title="Relax"
					sectionKey='relax'
					items={
						relaxPlaylists.data
							? relaxPlaylists.data.playlists.items
								.map(mapPlaylistToSimplified)
								.filter(Boolean) as SimplifiedMappedPlaylistItem[]
							: []
					}
				/>
			)}
		</div>
	)
}