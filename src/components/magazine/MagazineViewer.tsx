"use client";

import { useState, useEffect, useRef, forwardRef } from "react";
import HTMLFlipBook from "react-pageflip";
import Image from "next/image";

interface MagazineViewerProps {
	pdfUrl: string;
	year: string;
}

// ForwardRef component for pages to work with react-pageflip
const PageCover = forwardRef<HTMLDivElement, any>((props, ref) => {
	return (
		<div
			className="page-content bg-white shadow-lg h-full w-full overflow-hidden"
			ref={ref}
			data-density="hard"
		>
			<div className="relative h-full w-full">{props.children}</div>
		</div>
	);
});

PageCover.displayName = "PageCover";

const PageContent = forwardRef<HTMLDivElement, any>((props, ref) => {
	return (
		<div
			className="page-content bg-white shadow-md h-full w-full overflow-hidden border-l border-gray-100"
			ref={ref}
			data-density="soft"
		>
			<div className="relative h-full w-full">{props.children}</div>
		</div>
	);
});

PageContent.displayName = "PageContent";

interface MagazineMetadata {
	year: string;
	totalPages: number;
	format: string;
	pages: Array<{
		number: number;
		filename: string;
	}>;
}

export default function MagazineViewer({ pdfUrl, year }: MagazineViewerProps) {
	const [metadata, setMetadata] = useState<MagazineMetadata | null>(null);
	const [containerWidth, setContainerWidth] = useState<number>(1200);
	const containerRef = useRef<HTMLDivElement>(null);
	const [isMobile, setIsMobile] = useState(false);
	const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set([1]));
	const [currentPage, setCurrentPage] = useState(0);

	useEffect(() => {
		const fetchMetadata = async () => {
			try {
				const res = await fetch(`/magazines/${year}/metadata.json`);
				if (res.ok) {
					const data = await res.json();
					setMetadata(data);
				} else {
					console.error("Failed to load magazine metadata");
				}
			} catch (error) {
				console.error("Error loading metadata:", error);
			}
		};

		fetchMetadata();
	}, [year]);

	const onFlip = (e: any) => {
		const newPage = e.data;
		setCurrentPage(newPage);

		const pagesToLoad = new Set<number>();
		const BUFFER = 3;

		for (
			let i = Math.max(0, newPage - BUFFER);
			i <= Math.min((metadata?.totalPages || 0) - 1, newPage + BUFFER);
			i++
		) {
			pagesToLoad.add(i + 1);
		}

		setLoadedPages((prev) => new Set([...prev, ...pagesToLoad]));
	};

	useEffect(() => {
		const updateWidth = () => {
			if (containerRef.current) {
				const width = containerRef.current.clientWidth;
				setContainerWidth((prev) => {
					if (Math.abs(prev - width) > 10) {
						return width;
					}
					return prev;
				});
				setIsMobile(width < 768);
			}
		};

		updateWidth();
		window.addEventListener("resize", updateWidth);
		return () => window.removeEventListener("resize", updateWidth);
	}, []);

	const maxBookWidth = isMobile
		? Math.min(containerWidth * 0.95, 600)
		: Math.min(containerWidth * 0.9, 1400);

	const pageWidth = isMobile ? maxBookWidth : maxBookWidth / 2;
	const pageHeight = pageWidth * (year === "2024-25" ? 1.414 : 1.19);

	if (!metadata) {
		return (
			<div className="w-full flex justify-center items-center py-10">
				<div className="text-purple-900 dark:text-purple-100 text-xl animate-pulse bg-white/20 p-8 rounded-lg">
					Loading Magazine...
				</div>
			</div>
		);
	}

	return (
		<div
			className="w-full flex justify-center items-center py-10 touch-none"
			ref={containerRef}
		>
			{metadata && metadata.totalPages > 0 && (
				<div className="flex flex-col items-center gap-6">
					{/* @ts-ignore */}
					<HTMLFlipBook
						width={pageWidth}
						height={pageHeight}
						size="fixed"
						minWidth={isMobile ? 200 : 250}
						maxWidth={isMobile ? 600 : 700}
						minHeight={isMobile ? 300 : 350}
						maxHeight={isMobile ? 850 : 1000}
						maxShadowOpacity={0.5}
						showCover={true}
						mobileScrollSupport={true}
						className="shadow-2xl"
						drawShadow={true}
						flippingTime={800}
						usePortrait={isMobile}
						startPage={0}
						clickEventForward={true}
						useMouseEvents={true}
						swipeDistance={30}
						showPageCorners={true}
						disableFlipByClick={false}
						onFlip={onFlip}
					>
						{metadata.pages.map((page) => {
							const Component = page.number === 1 ? PageCover : PageContent;
							const shouldLoad = loadedPages.has(page.number);

							return (
								<Component key={`page_${page.number}`}>
									{shouldLoad ? (
										<div className="relative w-full h-full bg-white">
											<Image
												src={`/magazines/${year}/${page.filename}`}
												alt={`Page ${page.number}`}
												fill
												className="object-contain"
												quality={90}
												priority={page.number <= 3}
												loading={page.number <= 3 ? "eager" : "lazy"}
											/>
										</div>
									) : (
										<div className="flex items-center justify-center h-full bg-gray-50">
											<p className="text-gray-400 text-sm">
												Page {page.number}
											</p>
										</div>
									)}
								</Component>
							);
						})}
					</HTMLFlipBook>
				</div>
			)}
		</div>
	);
}
