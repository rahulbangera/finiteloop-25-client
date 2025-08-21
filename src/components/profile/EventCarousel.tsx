import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Drawer } from "vaul";

const getVisibleCount = () => {
	if (typeof window === "undefined") return 1;
	if (window.innerWidth < 640) return 1;
	return 3;
};

type EventType = {
	id?: string | number;
	name?: string;
	imgSrc?: string;
	fromDate?: string;
	state?: string;
	isConfirmed?: boolean;
	hasAttended?: boolean;
	certificates?: {
		eventId: number;
		id: string;
		issuedOn: string;
		link: string;
		statusOfMailing: boolean;
	};
	// Add other event properties as needed
};

export default function EventCarousel({
	events,
	isViewingOtherProfile = false,
}: {
	events?: EventType[];
	isViewingOtherProfile?: boolean;
}) {
	const safeEvents = Array.isArray(events)
		? [...events].reverse().filter((e) => e?.isConfirmed)
		: [];
	const [current, setCurrent] = useState(0);
	const [drawerDirection, setDrawerDirection] = useState<"right" | "bottom">(
		"right",
	);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [visibleCount, setVisibleCount] = useState(getVisibleCount());
	const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleResize = () => setVisibleCount(getVisibleCount());
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const totalPages = Math.ceil(safeEvents.length / visibleCount);

	useEffect(() => {
		if (current > totalPages - 1) {
			setCurrent(Math.max(0, totalPages - 1));
		}
	}, [current, totalPages]);

	const goPrev = () => {
		if (current > 0) setCurrent((c) => c - 1);
	};
	const goNext = () => {
		if (current < totalPages - 1) setCurrent((c) => c + 1);
	};

	const startIdx = current * visibleCount;
	const endIdx = startIdx + visibleCount;
	const visibleEvents = safeEvents.slice(startIdx, endIdx);

	useEffect(() => {
		const checkMobile = () => {
			const mobile = window.matchMedia("(max-width: 767px)").matches;
			setDrawerDirection(mobile ? "bottom" : "right");
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const handleDrawerClose = (open: boolean) => {
		setDrawerOpen(open);
		if (!open) setSelectedEvent(null);
	};

	return (
		<div className="relative w-full flex flex-col items-center">
			<div className="flex items-center justify-center gap-2 w-full">
				{safeEvents.length > 0 && (
					<button
						type="button"
						onClick={goPrev}
						disabled={current === 0}
						className="p-2 rounded-full bg-gradient-to-tr from-neutral-900 to-neutral-800 text-white hover:bg-orange-400/90 disabled:opacity-30 shadow-lg transition-all duration-200 border-2 border-neutral-700 hover:border-orange-400"
						aria-label="Previous"
					>
						<svg
							width="22"
							height="22"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
						>
							<title>Previous</title>
							<polyline points="13 17 7 12 13 7" />
						</svg>
					</button>
				)}
				<div className="flex gap-6 w-full justify-center" ref={containerRef}>
					{visibleEvents.map((event, idx) => (
						<div
							key={event.id || idx}
							className="bg-gradient-to-tr from-neutral-800 to-neutral-900 sm:rounded-xl border border-orange-400/30 rounded-2xl p-5 min-w-[220px] max-w-[260px] flex-1 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center group relative overflow-hidden cursor-pointer"
							style={{
								boxShadow:
									"0 4px 24px 0 rgba(255, 186, 73, 0.10), 0 1.5px 6px 0 rgba(255, 186, 73, 0.08)",
							}}
						>
							{/* Glow effect */}
							<div className="absolute -top-10 -left-10 w-32 h-32 bg-orange-400/10 rounded-full blur-2xl pointer-events-none z-0" />
							{event.imgSrc ? (
								<div className="w-full flex justify-center mb-3 relative z-10">
									{/** biome-ignore lint/performance/noImgElement: <test> */}
									<img
										src={event.imgSrc}
										alt={event.name}
										className="w-full h-full object-cover rounded-xl border-2 border-orange-400 shadow-lg group-hover:scale-105 group-hover:shadow-2xl transition-all duration-300 bg-neutral-700"
									/>
								</div>
							) : (
								<div className="w-24 h-24 rounded-xl bg-gradient-to-tr from-orange-400 to-yellow-400 flex items-center justify-center mb-3 text-3xl font-bold text-white shadow-lg">
									{event.name?.[0] || "E"}
								</div>
							)}
							<div className="font-extrabold text-lg sm:text-xl text-orange-400 mb-1 truncate text-center drop-shadow-sm z-10">
								{event.name}
							</div>
							{event.fromDate && (
								<div className="text-sm text-gray-300 mb-2 font-mono z-10">
									On:{" "}
									{new Date(event.fromDate).toLocaleDateString(undefined, {
										year: "numeric",
										month: "short",
										day: "numeric",
									})}
								</div>
							)}

							{isViewingOtherProfile ? (
								<Link
									href={`/events?id=${event.id}`}
									className="w-full z-10"
									onClick={(e) => e.stopPropagation()}
								>
									<button
										type="button"
										className="mt-4 w-full px-4 py-2 rounded-full bg-gradient-to-tr from-white via-gray-200 to-gray-100 font-bold text-md shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 border-2 border-gray-300/60 hover:border-orange-300 text-gray-900"
										style={{
											textShadow: "0 1px 6px rgba(0,0,0,0.08)",
											letterSpacing: "0.03em",
										}}
									>
										View Event Details
									</button>
								</Link>
							) : (
								<>
									{event.state === "COMPLETED" &&
										event.isConfirmed &&
										!event.hasAttended && (
											<button
												type="button"
												className="mt-4 w-full px-4 py-2 rounded-full bg-gradient-to-tr from-red-500 to-red-700 font-bold text-md shadow-lg border-2 border-red-600/60 text-white cursor-pointer"
												onClick={(e) => {
													e.stopPropagation();
													window.location.href = `/events?id=${event.id}`;
												}}
											>
												Not attended
											</button>
										)}
									{event.state === "PUBLISHED" && (
										<button
											type="button"
											className="mt-4 w-full px-4 py-2 rounded-full bg-gradient-to-tr from-white via-gray-200 to-gray-100 font-bold text-md shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 border-2 border-blue-400/60 hover:border-blue-300 text-black"
											onClick={(e) => {
												e.stopPropagation();
												window.location.href = `/events?id=${event.id}`;
											}}
										>
											Registered – View Event
										</button>
									)}
									{event.state === "COMPLETED" &&
										event.isConfirmed &&
										event.hasAttended &&
										!event.certificates?.statusOfMailing && (
											<button
												type="button"
												className="mt-4 w-full px-4 py-2 rounded-full bg-gradient-to-tr from-yellow-300 to-yellow-500 font-bold text-md shadow-lg border-2 border-yellow-400/60 text-yellow-900 cursor-default"
												disabled
												onClick={(e) => e.stopPropagation()}
											>
												Certificate on the way
											</button>
										)}
									{event.state === "COMPLETED" &&
										event.isConfirmed &&
										event.hasAttended &&
										event.certificates?.statusOfMailing && (
											<button
												type="button"
												className="mt-4 w-full px-4 py-2 rounded-full bg-gradient-to-tr from-green-400 to-green-600 font-bold text-md shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 border-2 border-green-400/60 hover:border-green-500 text-white"
												onClick={(e) => {
													e.stopPropagation();
													setSelectedEvent(event);
													setDrawerOpen(true);
												}}
											>
												View Certificate
											</button>
										)}
								</>
							)}
							{/* Decorative border glow */}
							<div className="absolute inset-0 rounded-2xl border-2 border-orange-400/10 group-hover:border-orange-400/40 transition-all duration-300 pointer-events-none z-0" />
						</div>
					))}
				</div>
				{safeEvents.length > 0 && (
					<button
						type="button"
						onClick={goNext}
						disabled={current >= totalPages - 1}
						className="p-2 rounded-full bg-gradient-to-tr from-neutral-900 to-neutral-800 text-white hover:bg-orange-400/90 disabled:opacity-30 shadow-lg transition-all duration-200 border-2 border-neutral-700 hover:border-orange-400"
						aria-label="Next"
					>
						<svg
							width="22"
							height="22"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
						>
							<title>Next</title>
							<polyline points="7 17 13 12 7 7" />
						</svg>
					</button>
				)}
			</div>

			{safeEvents.length === 0 &&
				(isViewingOtherProfile ? (
					<>
						<p className="text-sm sm:text-base md:text-lg font-medium mb-1 sm:mb-2">
							No events to show!
						</p>
						<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mb-3 sm:mb-4 px-2">
							This user hasn't participated in any events yet.
						</p>
					</>
				) : (
					<>
						<p className="text-sm sm:text-base md:text-lg font-medium mb-1 sm:mb-2">
							You're missing out!
						</p>
						<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mb-3 sm:mb-4 px-2">
							Register for events to get started and make the most of your
							experience!
						</p>
						<Link href="/events" className="inline-block">
							<button
								type="button"
								className="px-5 sm:px-6 md:px-8 py-2 sm:py-3 font-semibold bg-gradient-to-tr from-orange-500 to-yellow-400 rounded-full shadow transition hover:scale-105 hover:shadow-lg text-white text-sm sm:text-base md:text-lg whitespace-nowrap"
							>
								Browse Events
							</button>
						</Link>
					</>
				))}

			{/* Drawer for certificate */}
			<Drawer.Root
				open={drawerOpen}
				onOpenChange={handleDrawerClose}
				direction={drawerDirection}
				modal={true}
				dismissible={true}
			>
				<Drawer.Portal>
					<Drawer.Overlay
						className="fixed inset-0 bg-black/40 z-40 cursor-pointer"
						onClick={(e) => {
							e.stopPropagation();
							handleDrawerClose(false);
						}}
					/>
					<Drawer.Content
						className={`
                            fixed
                            ${
															drawerDirection === "right"
																? "top-0 right-0 h-full w-full sm:w-[420px] md:w-[550px] max-w-full rounded-l-3xl border-l border-purple-200 dark:border-indigo-800"
																: "bottom-0 left-0 w-full h-[70vh] rounded-t-3xl border-t border-purple-200 dark:border-indigo-800"
														}
                            bg-[radial-gradient(at_top_right,_#FBCFF4,_#E4CCF8,_#C4E2F7,_#FEF9FF)] dark:bg-[radial-gradient(at_top_right,_#7F439D,_#33107C,_#060329)]
                            shadow-2xl z-50 flex flex-col transition-transform overflow-hidden
                        `}
						style={{ maxHeight: "100vh" }}
					>
						<Drawer.Title asChild>
							<span className="sr-only">{selectedEvent?.name}</span>
						</Drawer.Title>
						<div
							className={`flex flex-col gap-6 px-4 pb-8 overflow-y-auto flex-1 ${drawerDirection === "bottom" ? "pt-2" : "pt-8"}`}
						>
							{selectedEvent && (
								<>
									<h2 className="lilita-font text-3xl md:text-4xl font-bold text-purple-900 dark:text-purple-100 break-words text-center mt-5">
										{selectedEvent.name}
									</h2>
									{selectedEvent.certificates?.link && (
										<div className="flex flex-col items-center gap-5">
											<div className="w-full flex justify-center">
												{/** biome-ignore lint/performance/noImgElement: <test> */}
												<img
													src={selectedEvent.certificates?.link}
													alt="Certificate"
													className="w-full max-w-md rounded-2xl border-2 border-purple-300 dark:border-indigo-700 shadow-lg object-contain bg-white"
													style={{
														background:
															"linear-gradient(135deg, #fbcff4 0%, #c4e2f7 100%)",
													}}
												/>
											</div>
											{selectedEvent.certificates?.issuedOn && (
												<div className="text-xl text-gray-700 dark:text-gray-200 mt-2">
													<span className="font-semibold">Issued on: </span>
													{new Date(
														selectedEvent.certificates.issuedOn,
													).toLocaleDateString(undefined, {
														year: "numeric",
														month: "short",
														day: "numeric",
													})}
												</div>
											)}
											<div className="flex gap-3 mt-2">
												<a
													href={selectedEvent.certificates?.link}
													download
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-tr from-green-400 to-green-600 font-semibold text-white shadow-md hover:scale-105 hover:shadow-lg border-green-400/60 hover:border-green-500 transition-all duration-200 text-xl"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="20"
														height="20"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														className="inline-block"
													>
														<title>Download Certificate</title>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
														/>
													</svg>
													Download
												</a>
												{/* <button
                                                    type="button"
                                                    className="px-5 py-2 rounded-full bg-gradient-to-tr from-red-500 to-pink-500 font-semibold text-white shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200 text-base"
                                                    onClick={() => {
                                                        alert("Report submitted.");
                                                    }}
                                                >
                                                    Report Issue
                                                </button> */}
											</div>
										</div>
									)}
								</>
							)}
						</div>
					</Drawer.Content>
				</Drawer.Portal>
			</Drawer.Root>
		</div>
	);
}
