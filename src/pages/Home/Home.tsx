import home from './Home.module.css'
import PlaylistSection from '../../components/SectionModule/PlaylistSection/PlaylistSection';
import { usePlaylistsOverview } from '../../hooks/usePlaylistsOverview';
import { type SimplifiedMappedPlaylistItem } from '../../types/collection/generalTypes';
import { mapPlaylistToSimplified } from '../../services/Selections/selections';

import Loader from '../../components/common/Loader';

interface HomeProps {
	token: string | null;
}

export default function Home({ token }: HomeProps) {
	const { newReleases, popPlaylists, rockPlaylists, relaxPlaylists } = usePlaylistsOverview(token);

	if (!newReleases || !popPlaylists || !rockPlaylists || !relaxPlaylists) {
		return <Loader />;
	}

	return (
		<div className={home.home}>
			<PlaylistSection
				title="New Releases"
				sectionKey='new-releases'
				items={newReleases.data?.albums.items || []}
			/>
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
		</div>
	)
}