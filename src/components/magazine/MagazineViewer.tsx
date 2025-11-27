"use client";

import { useState, useEffect, useRef, forwardRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface MagazineViewerProps {
	pdfUrl: string;
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

export default function MagazineViewer({ pdfUrl }: MagazineViewerProps) {
	const [numPages, setNumPages] = useState<number>(0);
	const [containerWidth, setContainerWidth] = useState<number>(1200); // Start with default value
	const containerRef = useRef<HTMLDivElement>(null);

	function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
		console.log("PDF loaded successfully with", numPages, "pages");
		setNumPages(numPages);
	}

	useEffect(() => {
		const updateWidth = () => {
			if (containerRef.current) {
				setContainerWidth(containerRef.current.clientWidth);
			}
		};

		// Update immediately and on resize
		updateWidth();
		window.addEventListener("resize", updateWidth);
		return () => window.removeEventListener("resize", updateWidth);
	}, []);

	const maxBookWidth = Math.min(containerWidth * 0.9, 1400);
	const pageWidth = maxBookWidth / 2;
	const pageHeight = pageWidth * 1.19;

	return (
		<div
			className="w-full flex justify-center items-center py-10"
			ref={containerRef}
		>
			<Document
				file={pdfUrl}
				onLoadSuccess={onDocumentLoadSuccess}
				onLoadError={(error) => {
					console.error("Error loading PDF:", error);
					alert("Error loading PDF: " + error.message);
				}}
				className="flex justify-center"
				loading={
					<div className="text-purple-900 dark:text-purple-100 text-xl animate-pulse bg-white/20 p-8 rounded-lg">
						Loading Magazine...
					</div>
				}
				error={
					<div className="text-red-500 text-xl bg-white p-4 rounded-lg shadow-lg">
						Failed to load PDF. Please check the console for details.
					</div>
				}
			>
				{numPages > 0 && (
					<div className="flex flex-col items-center gap-6">
						{/* @ts-ignore - react-pageflip types might be slightly off */}
						<HTMLFlipBook
							width={pageWidth}
							height={pageHeight}
							size="fixed"
							minWidth={250}
							maxWidth={700}
							minHeight={350}
							maxHeight={1000}
							maxShadowOpacity={0.5}
							showCover={true}
							mobileScrollSupport={true}
							className="shadow-2xl"
							drawShadow={true}
							flippingTime={800}
							usePortrait={false}
							startPage={0}
							clickEventForward={true}
							useMouseEvents={true}
							swipeDistance={30}
							showPageCorners={true}
							disableFlipByClick={false}
						>
							{/* Render all pages */}
							{Array.from(new Array(numPages), (el, index) => {
								const pageNum = index + 1;
								const Component = pageNum === 1 ? PageCover : PageContent;

								return (
									<Component key={`page_${pageNum}`}>
										<Page
											pageNumber={pageNum}
											width={pageWidth}
											renderAnnotationLayer={false}
											renderTextLayer={false}
											loading={
												<div className="flex items-center justify-center h-full">
													<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-600" />
												</div>
											}
										/>
									</Component>
								);
							})}
						</HTMLFlipBook>
					</div>
				)}
			</Document>
		</div>
	);
}
