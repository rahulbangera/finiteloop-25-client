"use client";
import { useEffect, useRef, useState } from "react";
import Card from "@/components/Card";
import Radio from "@/components/Radio";
import { Drawer } from "vaul";
import gsap from "gsap";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter, useSearchParams } from "next/navigation";

type EventYear = "2023-24" | "2024-25" | "2025-26";

type EventType = {
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
			type: "Hackathon",
			name: "CodeSprint 1.0",
			image: "/testing/overtime.png",
			description: "A solo coding competition testing DSA skills.",
			date: "2024-02-15",
			format: "Solo",
			venue: "Auditorium",
			membersPerTeam: 1,
			entryFee: "₹100",
		},
		{
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
		const eventSlug = searchParams.get("event");
		if (eventSlug) {
			let foundYear: EventYear | null = null;
			for (const year in mockEvents) {
				const yearKey = year as EventYear;
				const event = mockEvents[yearKey].find(
					(e) => e.name.toLowerCase().replace(/\s+/g, "-") === eventSlug,
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
			params.delete("event");
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
		const slug = event.name.toLowerCase().replace(/\s+/g, "-");
		router.push(`?event=${slug}`);
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
			const slug = selectedEvent.name.toLowerCase().replace(/\s+/g, "-");
			const url = `${window.location.origin}/events?event=${slug}`;
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
										params.delete("event");
										const newUrl = `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`;
										window.history.replaceState({}, "", newUrl);
									}
								}}
							>
								<Drawer.Portal>
									<Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
									<Drawer.Content className="bg-white dark:bg-gray-900 rounded-t-xl p-6 fixed bottom-0 left-0 right-0 z-50">
										<Drawer.Title asChild>
											<VisuallyHidden>{selectedEvent?.name}</VisuallyHidden>
										</Drawer.Title>
										<div className="flex flex-col gap-4">
											<h2 className="text-2xl font-bold">{event.name}</h2>
											{/** biome-ignore lint/performance/noImgElement: <testing> */}
											<img
												src={event.image}
												alt={event.name}
												className="rounded-xl h-40 object-cover w-full"
											/>
											<p>{event.description}</p>
											<p>
												<strong>Date:</strong> {event.date}
											</p>
											<p>
												<strong>Venue:</strong> {event.venue}
											</p>
											<p>
												<strong>Format:</strong> {event.format}
											</p>
											<p>
												<strong>Team Size:</strong> {event.membersPerTeam}
											</p>
											<p>
												<strong>Entry Fee:</strong> {event.entryFee}
											</p>
											<button
												type="button"
												className="mt-4 px-4 py-2 bg-black text-white rounded w-fit"
											>
												Register
											</button>
											<button
												type="button"
												onClick={handleCopyLink}
												className="mt-2 px-4 py-2 bg-white border text-black rounded w-fit dark:bg-black dark:text-white"
											>
												Copy Link
											</button>
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
						onPointerDownOutside={(e) => e.preventDefault()} // 🛑 prevent close on outside click
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
