import homeStyles from './Home.module.css';
import { useEffect, useState, useMemo } from 'react';
import { getNewReleases } from '../../services/Selections/selections';
import { getUserRecentlyPlayedTracks } from '../../services/User/userContent';
import { type RecentlyPlayedResponse } from '../../types/collection/trackTypes';

import { useSelector } from 'react-redux';
import { type RootState } from '../../store';

import { mapTrackToSimplified, mapAlbumToSimplified } from '../../mappers';
import { type SimplifiedMappedTrackItem, type SimplifiedMappedAlbumItem, type RawCombinedResults } from '../../types/collection/generalTypes';

import { useDispatch } from 'react-redux';
import { type AppDispatch } from '../../store';
import { setNavigation } from '../../store/general';

import TrackSection from '../../components/SectionModule/TrackSection/TrackSection';
import AlbumsSection from '../../components/SectionModule/AlbumsSection/AlbumsSection';
import Loader from '../../components/common/Loader';

interface HomeProps {
	token: string | null;
}

export default function Home({ token }: HomeProps) {
	const dispatch = useDispatch<AppDispatch>();
	// Недавно проигрываемые треки пользователя
	const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState<RecentlyPlayedResponse | null>(null);
	// Новые релизы (новые альбомы и синглы)
	const [newReleases, setNewReleases] = useState<RawCombinedResults>();
	const userName = useSelector((state: RootState) => state.user.userProfileData?.display_name);
	// Определяем время суток для приветствия
	const timeNow = new Date().getHours();
	useEffect(() => {
		// Загружает недавно проигрываемые треки пользователя
		const fetchRecentlyPlayed = async () => {
			if (token) {
				const data = await getUserRecentlyPlayedTracks(token);
				setRecentlyPlayedTracks(data);
			}
		};
		fetchRecentlyPlayed();

		// Загружает новые релизы на Spotify
		const fetchNewReleases = async () => {
			if (token) {
				const data = await getNewReleases(token);
				setNewReleases(data);
			}
		};
		fetchNewReleases();

		// Уведомляем Redux о текущей странице
		dispatch(setNavigation('home'));
	}, [])

	const simplifiedTracks = useMemo(() => {
		if (!recentlyPlayedTracks?.items) return [];

		// Преобразуем треки в упрощённый формат и удаляем дубликаты
		const mapped = recentlyPlayedTracks.items
			.map(item => mapTrackToSimplified(item.track))
			.filter((t): t is SimplifiedMappedTrackItem => t !== null);

		// Оставляем только уникальные треки по ID
		const unique = mapped.filter(
			(track, index, self) =>
				index === self.findIndex(t => t.id === track.id)
		);

		return unique;
	}, [recentlyPlayedTracks]);

	const isLoading = !recentlyPlayedTracks;

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className="content">
			<div className={homeStyles.greeting}>
				{(timeNow >= 6 && timeNow <= 11) && <h1>Good morning, {userName}! New day, new music.</h1>}
				{(timeNow >= 12 && timeNow <= 17) && <h1>Have a wonderful day, {userName}!</h1>}
				{(timeNow >= 18 && timeNow <= 22) && <h1>The evening promises to be musical, {userName}!</h1>}
				{(timeNow >= 23 || timeNow <= 5) && <h1>Good night, {userName}! Immerse yourself in the melodies!</h1>}
			</div>
			<TrackSection
				title="Recently Played"
				items={simplifiedTracks}
			/>
			<AlbumsSection
				title="New Releases"
				sectionKey='new-releases'
				items={
					newReleases
						? newReleases.albums.items
							.map(mapAlbumToSimplified)
							.filter(Boolean) as SimplifiedMappedAlbumItem[]
						: []
				}
			/>
		</div>
	);
}