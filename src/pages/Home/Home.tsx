import { useEffect } from 'react';
import { usePlaylistsOverview } from '../../hooks/usePlaylistsOverview';
import { mapPlaylistToSimplified } from '../../mappers';
import { type SimplifiedMappedPlaylistItem } from '../../types/collection/generalTypes';

import { useDispatch } from 'react-redux';
import { type AppDispatch } from '../../store';
import { setNavigation } from '../../store/general';

import PlaylistSection from '../../components/SectionModule/PlaylistSection/PlaylistSection';
import AlbumsSection from '../../components/SectionModule/AlbumsSection/AlbumsSection';
import Loader from '../../components/common/Loader';

interface HomeProps {
	token: string | null;
}

export default function Home({ token }: HomeProps) {
	const dispatch = useDispatch<AppDispatch>();
	const { newReleases, popPlaylists, rockPlaylists, relaxPlaylists } = usePlaylistsOverview(token);

	useEffect(() => {
		dispatch(setNavigation('home'));
	}, [])

	const isLoading =
		newReleases.isLoading ||
		popPlaylists.isLoading ||
		rockPlaylists.isLoading ||
		relaxPlaylists.isLoading;

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className='content'>
			<AlbumsSection
				title='New Releases'
				sectionKey='new-releases'
				isFiltered={false}
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