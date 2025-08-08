import { useQueries } from "@tanstack/react-query";
import playlists from "../services/Selections/selections";

export const usePlaylistsOverview = (accessToken: string | null) => {
    const results = useQueries({
        queries: [
            {
                queryKey: ["newReleases", accessToken],
                queryFn: () => playlists.getNewReleases(accessToken),
                staleTime: 5 * 60 * 1000,
                enabled: !!accessToken,
            },
            {
                queryKey: ["popPlaylists", accessToken],
                queryFn: () => playlists.getPopPlaylists(accessToken),
                staleTime: 5 * 60 * 1000,
                enabled: !!accessToken,
            },
            {
                queryKey: ["rockPlaylists", accessToken],
                queryFn: () => playlists.getRockPlaylists(accessToken),
                staleTime: 5 * 60 * 1000,
                enabled: !!accessToken,
            },
            {
                queryKey: ["relaxPlaylists", accessToken],
                queryFn: () => playlists.getRelaxPlaylists(accessToken),
                staleTime: 5 * 60 * 1000,
                enabled: !!accessToken,
            }
        ]
    });

    return {
        newReleases: results[0],
        popPlaylists: results[1],
        rockPlaylists: results[2],
        relaxPlaylists: results[3]
    };
};