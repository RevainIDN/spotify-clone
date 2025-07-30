import { useState, useEffect } from "react";
import { getSpotifyAccessToken } from "../services/authSpotify";

export const useSpotifyToken = () => {
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		const fetchToken = async () => {
			try {
				setIsLoading(true);
				const newToken = await getSpotifyAccessToken();
				if (newToken) {
					setToken(newToken);
				} else {
					setIsError(true);
				}
			} catch (error) {
				console.error("Ошибка в useSpotifyToken:", error);
				setIsError(true);
			} finally {
				setIsLoading(false);
			}
		};

		fetchToken();
	}, []);

	return { token, isLoading, isError };
};