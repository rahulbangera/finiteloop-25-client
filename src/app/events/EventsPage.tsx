"use client";
import { useEffect, useRef, useState } from "react";
import Card from "@/components/elements/Card";
import Radio from "@/components/elements/Radio";
import { Drawer } from "vaul";
import gsap from "gsap";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter, useSearchParams } from "next/navigation";

type EventYear = "2023-24" | "2024-25" | "2025-26";

type EventType = {
	id: number;
	type: string;
	name: string;
	image: string;
	description: string;
	date: string;
	format: string;
	venue: string;
	membersPerTeam: number;
	entryFee: string;
};

const mockEvents: Record<EventYear, EventType[]> = {
	"2023-24": [
		{
			id: 1,
			type: "Hackathon",
			name: "CodeSprint 1.0",
			image: "/testing/overtime.png",
			description: "",
			date: "2024-02-15",
			format: "Solo",
			venue: "Auditorium",
			membersPerTeam: 1,
			entryFee: "₹100",
		},
		{
			id: 2,
			type: "Special",
			name: "TechQuiz",
			image: "/testing/overtime.png",
			description: "Quiz on latest tech and CS fundamentals.",
			date: "2024-03-10",
			format: "Team",
			venue: "Room 201",
			membersPerTeam: 2,
			entryFee: "₹50",
		},
	],
	"2024-25": [
		{
			id: 3,
			type: "Hackathon",
			name: "Hackverse",
			image: "/testing/overtime.png",
			description: "24 hour hackathon for innovative projects.",
			date: "2025-01-20",
			format: "Team",
			venue: "Lab Block",
			membersPerTeam: 4,
			entryFee: "Free",
		},
		{
			id: 4,
			type: "Competition",
			name: "Algo Clash",
			image: "/testing/overtime.png",
			description: "Head-to-head algorithm challenge.",
			date: "2025-02-05",
			format: "Solo",
			venue: "Online",
			membersPerTeam: 1,
			entryFee: "₹100",
		},
		{
			id: 5,
			type: "Workshop",
			name: "DevJam",
			image: "/testing/overtime.png",
			description: "Web/app development sprint.",
			date: "2025-04-18",
			format: "Team",
			venue: "Main Hall",
			membersPerTeam: 3,
			entryFee: "₹150",
		},
		{
			id: 6,
			type: "Special",
			name: "TechQuiz",
			image: "/testing/overtime.png",
			description: "Quiz on latest tech and CS fundamentals.",
			date: "2025-05-10",
			format: "Team",
			venue: "Room 201",
			membersPerTeam: 2,
			entryFee: "₹50",
		},
	],
	"2025-26": [],
};

const EventsPage = () => {
	const [selectedYearData, setSelectedYearData] = useState<{
		year: EventYear;
		index: number;
	}>({ year: "2025-26", index: 2 });

	const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
	const [showDialog, setShowDialog] = useState(false);
	const imageRef = useRef<HTMLImageElement>(null);
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const eventSlug = searchParams.get("id");
		if (eventSlug) {
			let foundYear: EventYear | null = null;
			for (const year in mockEvents) {
				const yearKey = year as EventYear;
				const event = mockEvents[yearKey].find(
					(e) => e.id === Number(eventSlug),
				);
				if (event) {
					setSelectedEvent(event);
					foundYear = yearKey;
					if (window.innerWidth >= 768) setShowDialog(true);
					break;
				}
			}
			if (foundYear) {
				const yearIndex =
					foundYear === "2023-24" ? 0 : foundYear === "2024-25" ? 1 : 2;
				setSelectedYearData({ year: foundYear, index: yearIndex });
			}
		}
	}, [searchParams]);

	useEffect(() => {
		if (!showDialog) {
			const params = new URLSearchParams(window.location.search);
			params.delete("id");
			const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
			window.history.replaceState({}, "", newUrl);
		}
	}, [showDialog]);

	const handleToggleChange = (e: React.ChangeEvent<HTMLDivElement>) => {
		const id = (e.target as HTMLElement).id;
		if (id === "glass-silver") {
			setSelectedYearData({ year: "2023-24", index: 0 });
		} else if (id === "glass-gold") {
			setSelectedYearData({ year: "2024-25", index: 1 });
		} else if (id === "glass-platinum") {
			setSelectedYearData({ year: "2025-26", index: 2 });
		}
	};

	const handleCardClick = (event: EventType) => {
		setSelectedEvent(event);
		const slug = event.id;
		router.push(`?id=${slug}`, { scroll: false });
		if (window.innerWidth >= 768) setShowDialog(true);
	};

	useEffect(() => {
		if (showDialog && imageRef.current) {
			gsap.fromTo(
				imageRef.current,
				{ x: "100%", opacity: 0 },
				{ x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
			);
		}
	}, [showDialog]);

	const handleCopyLink = () => {
		if (selectedEvent) {
			const slug = selectedEvent.id;
			const url = `${window.location.origin}/events?id=${slug}`;
			navigator.clipboard.writeText(url);
			alert("Link copied to clipboard");
		}
	};

	return (
		<div className="p-8 h-full w-full bg-transparent flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto">
			<div className="text-7xl mt-20 select-none">Events</div>
			<div className="m-8 select-none" onChange={handleToggleChange}>
				<Radio
					plans={[
						{ id: "glass-silver", label: "2023-24" },
						{ id: "glass-gold", label: "2024-25" },
						{ id: "glass-platinum", label: "2025-26" },
					]}
					selected={selectedYearData.index}
					setSelected={(index) => {
						const year =
							index === 0 ? "2023-24" : index === 1 ? "2024-25" : "2025-26";
						setSelectedYearData({ year, index });
					}}
				/>
			</div>

			<div className="min-h-screen w-auto grid justify-center items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
				{mockEvents[selectedYearData.year].length === 0 ? (
					<div className="w-full text-5xl text-black dark:text-white text-center col-span-full mt-40">
						No Events for {selectedYearData.year}
					</div>
				) : (
					mockEvents[selectedYearData.year].map((event) => (
						<button
							type="button"
							key={`${event.name}-${event.date}`}
							onClick={() => handleCardClick(event)}
							className="outline-none w-full text-left"
						>
							<Card image={event.image}>
								<div className="flex flex-col items-center justify-center h-full w-full">
									<div className="text-sm text-black dark:text-white">
										{event.type}
									</div>
									<div className="text-2xl font-bold text-black dark:text-white">
										{event.name}
									</div>
									<div className="text-md text-black dark:text-white mb-1">
										Date: {event.date}
									</div>
								</div>
							</Card>

							{/* Drawer for mobile view */}
							<Drawer.Root
								open={
									selectedEvent?.name === event.name && window.innerWidth < 768
								}
								onOpenChange={(isOpen) => {
									if (!isOpen) {
										setSelectedEvent(null);
										const params = new URLSearchParams(window.location.search);
										params.delete("id");
										const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
										window.history.replaceState({}, "", newUrl);
									}
								}}
							>
								<Drawer.Portal>
									<Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
									<Drawer.Content className="bg-gradient-to-t from-white via-purple-50 to-purple-100 dark:from-gray-900 dark:via-indigo-950 dark:to-indigo-900 rounded-t-3xl p-6 fixed bottom-0 left-0 right-0 z-50 shadow-2xl border-t border-purple-200 dark:border-indigo-800">
										<Drawer.Title asChild>
											<VisuallyHidden>{selectedEvent?.name}</VisuallyHidden>
										</Drawer.Title>
										<div className="flex flex-col gap-4">
											<div className="flex items-center gap-3">
												<span className="inline-block px-3 py-1 rounded-full bg-purple-200 dark:bg-indigo-800 text-xs font-semibold text-purple-800 dark:text-purple-200">
													{event.type}
												</span>
												<span className="text-black dark:text-white text-xs">
													{event.date}
												</span>
											</div>
											<h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
												{event.name}
											</h2>
											{/** biome-ignore lint/performance/noImgElement: <test> */}
											<img
												src={event.image}
												alt={event.name}
												className="rounded-xl h-40 object-cover w-full border border-purple-100 dark:border-indigo-800 shadow"
											/>
											<p className="text-gray-700 dark:text-gray-300">
												{event.description}
											</p>
											<div className="grid grid-cols-2 gap-2 text-sm mt-2">
												<div>
													<span className="font-semibold text-purple-800 dark:text-purple-200">
														Venue:
													</span>{" "}
													{event.venue}
												</div>
												<div>
													<span className="font-semibold text-purple-800 dark:text-purple-200">
														Format:
													</span>{" "}
													{event.format}
												</div>
												<div>
													<span className="font-semibold text-purple-800 dark:text-purple-200">
														Team Size:
													</span>{" "}
													{event.membersPerTeam}
												</div>
												<div>
													<span className="font-semibold text-purple-800 dark:text-purple-200">
														Entry Fee:
													</span>{" "}
													{event.entryFee}
												</div>
											</div>
											<div className="flex gap-3 mt-6">
												<button
													type="button"
													className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold shadow hover:from-purple-700 hover:to-indigo-700 transition"
												>
													Register
												</button>
												<button
													type="button"
													onClick={handleCopyLink}
													className="flex-1 px-4 py-2 bg-white border border-purple-300 text-purple-800 rounded-lg font-semibold shadow hover:bg-purple-50 dark:bg-indigo-950 dark:text-purple-100 dark:border-indigo-700 dark:hover:bg-indigo-900 transition"
												>
													Copy Link
												</button>
											</div>
										</div>
									</Drawer.Content>
								</Drawer.Portal>
							</Drawer.Root>
						</button>
					))
				)}
			</div>

			{/* Desktop Modal */}
			<Dialog.Root open={showDialog} onOpenChange={setShowDialog}>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
					<Dialog.Content
						onPointerDownOutside={(e) => e.preventDefault()}
						className="bg-[radial-gradient(at_top_right,_#FBCFF4,_#E4CCF8,_#C4E2F7,_#FEF9FF)] dark:bg-[radial-gradient(at_top_right,_#7F439D,_#33107C,_#060329)] p-8 rounded-xl w-full max-w-3xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col md:flex-row gap-8 outline-none z-50"
						aria-describedby="event-details"
					>
						<Dialog.Title asChild>
							<VisuallyHidden>{selectedEvent?.name}</VisuallyHidden>
						</Dialog.Title>
						<button
							type="button"
							onClick={() => setShowDialog(false)}
							className="absolute top-4 right-4 text-red-600 hover:text-black dark:hover:text-white text-3xl"
						>
							✕
						</button>
						{selectedEvent && (
							<>
								{/** biome-ignore lint/performance/noImgElement: <testing> */}
								<img
									ref={imageRef}
									src={selectedEvent.image}
									alt={selectedEvent.name}
									className="w-full md:w-1/2 h-auto object-cover rounded-xl"
								/>
								<div
									id="event-details"
									className="flex flex-col gap-4 w-full md:w-1/2 text-black dark:text-white"
								>
									<h2 className="text-4xl font-bold">{selectedEvent.name}</h2>
									<p className="text-md text-gray-500">{selectedEvent.type}</p>
									<p>{selectedEvent.description}</p>
									<p>
										<strong>Date:</strong> {selectedEvent.date}
									</p>
									<p>
										<strong>Venue:</strong> {selectedEvent.venue}
									</p>
									<p>
										<strong>Format:</strong> {selectedEvent.format}
									</p>
									<p>
										<strong>Team Size:</strong> {selectedEvent.membersPerTeam}
									</p>
									<p>
										<strong>Entry Fee:</strong> {selectedEvent.entryFee}
									</p>
									<div className="flex gap-4 mt-4">
										<button
											type="button"
											className="px-6 py-3 bg-black text-white rounded-lg w-fit"
										>
											Register
										</button>
										<button
											type="button"
											onClick={handleCopyLink}
											className="px-6 py-3 bg-white border text-black rounded-lg w-fit dark:bg-black dark:text-white"
										>
											Copy Link
										</button>
									</div>
								</div>
							</>
						)}
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</div>
	);
};

export default EventsPage;
