import { it, describe, expect, vi } from 'vitest';
import axios from "axios";
import getNewReleases from "./playlists";

vi.mock("axios");
const mockedAxios = vi.mocked(axios);

describe("getNewReleases", () => {
	it("should fetch new releases successfully", async () => {
		const mockResponse = {
			data: {
				albums: {
					items: [
						{ name: "Album 1" },
						{ name: "Album 2" }
					]
				}
			}
		};

		vi.spyOn(axios, 'get').mockResolvedValueOnce(mockResponse);

		const token = "test_token";
		const result = await getNewReleases(token);

		expect(mockedAxios.get).toHaveBeenCalledWith("https://api.spotify.com/v1/browse/new-releases", {
			headers: { Authorization: `Bearer ${token}` },
			params: { limit: 20, country: 'US' }
		});
		expect(result).toEqual(mockResponse.data);
	});

	it("should handle errors when fetching new releases", async () => {
		const errorMessage = "Network Error";
		vi.spyOn(axios, 'get').mockRejectedValueOnce(new Error(errorMessage));

		const token = "test_token";

		await expect(getNewReleases(token)).rejects.toThrow(errorMessage);
	});
});