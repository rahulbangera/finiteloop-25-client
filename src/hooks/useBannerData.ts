"use client";

import { useEffect, useState } from "react";

interface BannerData {
	isVisible: boolean;
	description: string;
}

let cachedBannerData: BannerData | null = null;
let isCurrentlyFetching = false;
let cachePromise: Promise<BannerData> | null = null;

export const useBannerData = () => {
	const [bannerData, setBannerData] = useState<BannerData>({
		isVisible: false,
		description: "",
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getBannerData = async () => {
			if (cachedBannerData) {
				setBannerData(cachedBannerData);
				setLoading(false);
				return;
			}

			if (isCurrentlyFetching && cachePromise) {
				try {
					const data = await cachePromise;
					setBannerData(data);
					setLoading(false);
				} catch (error) {
					console.error("Error waiting for banner data:", error);
					setLoading(false);
				}
				return;
			}

			isCurrentlyFetching = true;
			setLoading(true);

			cachePromise = fetchBannerDataFromAPI();

			try {
				const data = await cachePromise;
				cachedBannerData = data;
				setBannerData(data);
			} catch (error) {
				console.error("Error fetching banner data:", error);
				const fallbackData: BannerData = {
					isVisible: false,
					description: "",
				};
				cachedBannerData = fallbackData;
				setBannerData(fallbackData);
			} finally {
				setLoading(false);
				isCurrentlyFetching = false;
			}
		};

		getBannerData();
	}, []);

	return {
		...bannerData,
		loading,
	};
};

const fetchBannerDataFromAPI = async (): Promise<BannerData> => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/api/specialnotice`,
		);

		if (!response.ok) {
			throw new Error("Failed to fetch banner data");
		}

		const data = await response.json();
		return {
			isVisible: Boolean(data.isVisible),
			description: String(data.description || "").trim(),
		};
	} catch (_error) {}
	return {
		isVisible: false,
		description: "",
	};
};
