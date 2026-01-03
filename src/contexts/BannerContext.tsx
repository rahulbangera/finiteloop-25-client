"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useBannerData } from "@/hooks/useBannerData";

interface BannerContextType {
	isBannerVisible: boolean;
	bannerHeight: number;
	isPopupVisible: boolean;
}

const BannerContext = createContext<BannerContextType>({
	isBannerVisible: false,
	bannerHeight: 0,
	isPopupVisible: false,
});

export const useBannerContext = () => useContext(BannerContext);

export const BannerProvider = ({ children }: { children: ReactNode }) => {
	const { isVisible, loading, popupIsVisible } = useBannerData();
	const pathname = usePathname();
	const [bannerHeight] = useState(40);
	const isBannerVisible = pathname === "/" && isVisible && !loading;
	const isPopupVisible = pathname === "/" && popupIsVisible && !loading;

	return (
		<BannerContext.Provider
			value={{ isBannerVisible, bannerHeight, isPopupVisible }}
		>
			{children}
		</BannerContext.Provider>
	);
};
