"use client";

import { useBannerData } from "@/hooks/useBannerData";
import MovingBanner from "./MovingBanner";

const MovingBannerWrapper = () => {
	const { isVisible, description, loading } = useBannerData();

	return <MovingBanner text={description} isVisible={isVisible && !loading} />;
};

export default MovingBannerWrapper;
