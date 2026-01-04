"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { useBannerData, type PopupData } from "@/hooks/useBannerData";
import Image from "next/image";

const PopupBanner = () => {
	const { popupIsVisible, popupValue, loading } = useBannerData();
	const [isOpen, setIsOpen] = useState(false);
	const [popupData, setPopupData] = useState<PopupData | null>(null);

	useEffect(() => {
		if (!popupValue) return;
		try {
			setPopupData(JSON.parse(popupValue) as PopupData);
		} catch {
			console.error("Failed to parse popupValue:", popupValue);
			setPopupData(null);
		}
	}, [popupValue]);

	useEffect(() => {
		if (popupIsVisible && !loading) {
			setTimeout(() => {
				setIsOpen(true);
			}, 1000);
		}
	}, [popupIsVisible, loading]);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				handleClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "";
		};
	}, [isOpen, handleClose]);

	if (!popupIsVisible || loading || !isOpen || !popupData) return null;

	const { imageUrl, title, description, link, buttonText } = popupData;

	return (
		<div className="fixed inset-0 z-40 flex items-center justify-center">
			<button
				type="button"
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
				onClick={handleClose}
				aria-label="Close popup"
			/>

			<div className="relative w-[90%] max-h-[80%] overflow-scroll scrollbar-hide bg-purple-950 md:w-[80%] lg:w-[70%] max-w-[1200px] rounded-2xl p-1 animate-in fade-in duration-300">
				<div className="bg-white/40 dark:bg-white/15 rounded-xl p-6 md:p-8">
					<button
						type="button"
						onClick={handleClose}
						className="absolute top-3 right-3 p-2 rounded-full bg-white/50 dark:bg-black/30 hover:bg-white/80 dark:hover:bg-black/50 transition-colors z-10"
						aria-label="Close popup"
					>
						<X className="w-5 h-5 text-purple-800 dark:text-purple-200" />
					</button>
					<div className="flex flex-col md:flex-row gap-6 text-white dark:text-purple-100 min-h-[300px] md:min-h-[350px]">
						{imageUrl && (
							<div className="flex justify-center items-center md:w-[40%] md:shrink-0">
								<Image
									src={imageUrl}
									alt={title || "Popup banner"}
									width={500}
									height={500}
									priority
									className="rounded-lg object-cover"
								/>
							</div>
						)}
						<div className="flex flex-col justify-center text-center md:text-left md:w-[60%]">
							{title && (
								<h2 className="text-2xl md:text-3xl font-bold mb-3">{title}</h2>
							)}
							{description && (
								<p className="text-base md:text-lg mb-4 opacity-90 whitespace-pre-line">
									{description}
								</p>
							)}
							{link && buttonText && (
								<div>
									<a
										href={link}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
									>
										{buttonText}
									</a>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PopupBanner;
