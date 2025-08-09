"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useBannerData } from "@/hooks/useBannerData";

interface BannerContextType {
	isBannerVisible: boolean;
	bannerHeight: number;
}

const BannerContext = createContext<BannerContextType>({
	isBannerVisible: false,
	bannerHeight: 0,
});

export const useBannerContext = () => useContext(BannerContext);

export const BannerProvider = ({ children }: { children: ReactNode }) => {
	const { isVisible, loading } = useBannerData();
	const pathname = usePathname();
	const [bannerHeight] = useState(40);

	const isBannerVisible = pathname === "/" && isVisible && !loading;

	return (
		<BannerContext.Provider value={{ isBannerVisible, bannerHeight }}>
			{children}
		</BannerContext.Provider>
	);
};
