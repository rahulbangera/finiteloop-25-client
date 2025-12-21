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
	width: number;
	height: number;
	pages: Array<{
		number: number;
		filename: string;
	}>;
}

export default function MagazineViewer({ pdfUrl, year }: MagazineViewerProps) {
	const [metadata, setMetadata] = useState<MagazineMetadata | null>(null);
	const [containerWidth, setContainerWidth] = useState<number>(1200);
	const containerRef = useRef<HTMLDivElement>(null);
	const [isMobile, setIsMobile] = useState(true);
	const [loadedPages, setLoadedPages] = useState<Set<number>>(
		new Set([1, 2, 3, 4]),
	);
	const [currentPage, setCurrentPage] = useState(0);
	const [isLoadingYear, setIsLoadingYear] = useState(false);

	useEffect(() => {
		const fetchMetadata = async () => {
			setIsLoadingYear(true);
			setMetadata(null);
			setLoadedPages(new Set([1, 2, 3, 4]));
			setCurrentPage(0);

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
			} finally {
				setIsLoadingYear(false);
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
				setIsMobile(width < 800);
			}
		};

		updateWidth();
		window.addEventListener("resize", updateWidth);
		return () => window.removeEventListener("resize", updateWidth);
	}, []);

	const maxBookWidth = isMobile
		? Math.min(containerWidth - 32, 380)
		: Math.min(containerWidth * 0.9, 1400);

	const pageWidth = isMobile ? maxBookWidth : maxBookWidth / 2;
	const pageHeight = metadata
		? pageWidth * (metadata.height / metadata.width)
		: pageWidth * 1.4;

	if (!metadata || isLoadingYear) {
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
			className="w-full flex justify-center items-center py-4 sm:py-8 md:py-10 touch-none overflow-hidden"
			ref={containerRef}
		>
			{metadata && metadata.totalPages > 0 && (
				<div className="flex flex-col items-center gap-6 w-full">
					{/* @ts-ignore */}
					<HTMLFlipBook
						key={`${year}-${isMobile ? "mobile" : "desktop"}`}
						width={pageWidth}
						height={pageHeight}
						size="fixed"
						minWidth={isMobile ? 250 : 250}
						maxWidth={isMobile ? 400 : 700}
						minHeight={isMobile ? 350 : 350}
						maxHeight={isMobile ? 650 : 1000}
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
										<div className="relative w-full h-full bg-white flex items-center justify-center">
											<Image
												src={`/magazines/${year}/${page.filename}`}
												alt={`Page ${page.number}`}
												width={metadata.width}
												height={metadata.height}
												className="w-full h-full object-contain"
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
