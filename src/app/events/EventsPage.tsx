"use client";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import gsap from "gsap";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";
import Card from "@/components/elements/Card";
import { useSession } from "next-auth/react";
import Radio from "@/components/elements/Radio";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type EventYear = "2023-24" | "2024-25" | "2025-26";
type Event = {
	id: number;
	name: string;
	slug: string | null;
	imgSrc: string;
	description: string | null;
	venue: string | null;
	eventType: "SOLO" | "TEAM";
	category: string;
	fromDate: string;
	toDate: string;
	deadline: string;
	maxTeams: number;
	minTeamSize: number;
	maxTeamSize: number;
	isMembersOnly: boolean;
	flcAmount: number;
	nonFlcAmount: number;
	state: string;
	isLegacy: boolean;
	createdAt: string;
	updatedAt: string;
};
type EventsByYear = Record<EventYear, Event[]>;
type TeamState = {
	registering: boolean;
	action: "NONE" | "CREATE" | "JOIN";
	teamId: string;
	createdTeamId: string;
	members: { id: string; name: string }[];
};

const getEventYear = (dateStr: string): EventYear => {
	const year = new Date(dateStr).getFullYear();
	if (year <= 2023) return "2023-24";
	if (year === 2024) return "2024-25";
	return "2025-26";
};

const BUTTON_CLASSES = {
	primary:
		"px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold shadow hover:from-purple-700 hover:to-indigo-700 transition",
	secondary:
		"px-4 py-2 bg-white border border-purple-300 text-purple-800 rounded-lg font-semibold shadow hover:bg-purple-50 dark:bg-indigo-950 dark:text-purple-100 dark:border-indigo-700 dark:hover:bg-indigo-900 transition",
	destructive:
		"px-4 py-2 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition",
	disabled:
		"px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow cursor-not-allowed",
	input:
		"px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-indigo-950 dark:text-white dark:border-indigo-700",
};

const EventsPage = () => {
	const [selectedYearData, setSelectedYearData] = useState<{
		year: EventYear;
		index: number;
	}>({ year: "2025-26", index: 2 });
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [initialSlug, setInitialSlug] = useState<string | null>(null);
	const [eventsByYear, setEventsByYear] = useState<EventsByYear>({
		"2023-24": [],
		"2024-25": [],
		"2025-26": [],
	});
	const [loading, setLoading] = useState(true);
	const [teamState, setTeamState] = useState<TeamState>({
		registering: false,
		action: "NONE",
		teamId: "",
		createdTeamId: "",
		members: [],
	});
	const [registered, setRegistered] = useState(false);
	const [joining, setJoining] = useState(false);
	const [teamInitialized, setTeamInitialized] = useState(false);
	const [checkingRegistration, setCheckingRegistration] = useState(false);
	const imageRef = useRef<HTMLImageElement>(null);
	const router = useRouter();
	const searchParams = useSearchParams();
	const { data: session } = useSession();
	const userId = session?.user?.id;
	const [drawerDirection, setDrawerDirection] = useState<"right" | "bottom">(
		"right",
	);

	// Fetch events
	useEffect(() => {
		const fetchEvents = async () => {
			setLoading(true);
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/getAll`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
					},
				);
				const json = await res.json();
				if (json.success && Array.isArray(json.data)) {
					const grouped: EventsByYear = {
						"2023-24": [],
						"2024-25": [],
						"2025-26": [],
					};
					for (const event of json.data) {
						const yearKey = getEventYear(event.fromDate);
						grouped[yearKey].push(event);
					}
					setEventsByYear(grouped);
				}
			} catch (error) {
				console.error("Failed to fetch events:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchEvents();
	}, []);

	// Handle slug in URL
	useEffect(() => {
		const slug = searchParams.get("id");
		if (slug && !initialSlug) setInitialSlug(slug);
	}, [searchParams, initialSlug]);

	// Open drawer if slug present
	useEffect(() => {
		if (!initialSlug || loading) return;
		let found: { event: Event; year: EventYear } | null = null;
		for (const year in eventsByYear) {
			const yearKey = year as EventYear;
			const event = eventsByYear[yearKey].find(
				(e) => e.id === Number(initialSlug),
			);
			if (event) {
				found = { event, year: yearKey };
				break;
			}
		}
		if (found) {
			setSelectedEvent(found.event);
			setDrawerOpen(true);
			const yearIndex =
				found.year === "2023-24" ? 0 : found.year === "2024-25" ? 1 : 2;
			setSelectedYearData({ year: found.year, index: yearIndex });
		}
	}, [initialSlug, eventsByYear, loading]);

	// Remove slug from URL when drawer closes
	useEffect(() => {
		if (!drawerOpen) {
			const params = new URLSearchParams(window.location.search);
			params.delete("id");
			const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
			window.history.replaceState({}, "", newUrl);
			setSelectedEvent(null);
			setRegistered(false);
			setTeamState({
				registering: false,
				action: "NONE",
				teamId: "",
				createdTeamId: "",
				members: [],
			});
			setTeamInitialized(false);
		}
	}, [drawerOpen]);

	useEffect(() => {
		const checkMobile = () => {
			const mobile = window.matchMedia("(max-width: 767px)").matches;
			setDrawerDirection(mobile ? "bottom" : "right");
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Animate image on drawer open
	useEffect(() => {
		if (drawerOpen && imageRef.current) {
			gsap.fromTo(
				imageRef.current,
				{ x: "100%", opacity: 0 },
				{ x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
			);
		}
	}, [drawerOpen]);

	useEffect(() => {
		if (!selectedEvent || !userId) return;

		const checkRegistration = async () => {
			setCheckingRegistration(true);
			try {
				if (selectedEvent.eventType === "SOLO") {
					const res = await fetch(
						`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/checkSolo`,
						{
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ userId, eventId: selectedEvent.id }),
						},
					);
					const json = await res.json();
					if (res.ok && json.success) {
						setRegistered(true);
					}
				} else if (selectedEvent.eventType === "TEAM") {
					const res = await fetch(
						`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/getTeam`,
						{
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ userId, eventId: selectedEvent.id }),
						},
					);
					const json = await res.json();
					if (res.ok && json.success && json.data) {
						const members = Array.isArray(json.data.members)
							? json.data.members.map((m: { id: string; name: string }) => ({
									id: m.id,
									name: m.name,
								}))
							: [];

						setTeamState((prev) => ({
							...prev,
							registering: true,
							createdTeamId: json.data.teamId,
							members,
							action: "NONE",
						}));
					} else {
						setTeamState((prev) => ({
							...prev,
							registering: true,
							createdTeamId: "",
							members: [],
							action: "NONE",
						}));
					}
				}
			} catch (err) {
				console.error("Error checking registration/team:", err);
			} finally {
				setTeamInitialized(true);
				setCheckingRegistration(false);
			}
		};

		checkRegistration();
	}, [selectedEvent, userId]);

	const handleToggleChange = (e: React.ChangeEvent<HTMLDivElement>) => {
		const id = (e.target as HTMLElement).id;
		if (id === "glass-silver")
			setSelectedYearData({ year: "2023-24", index: 0 });
		else if (id === "glass-gold")
			setSelectedYearData({ year: "2024-25", index: 1 });
		else if (id === "glass-platinum")
			setSelectedYearData({ year: "2025-26", index: 2 });
	};

	const handleCardClick = (event: Event) => {
		setSelectedEvent(event);
		router.push(`?id=${event.id}`, { scroll: false });
		setDrawerOpen(true);
	};

	useEffect(() => {
		console.log("registered:", registered);
	}, [registered]);

	const handleCopyLink = () => {
		if (selectedEvent) {
			const url = `${window.location.origin}/events?id=${selectedEvent.id}`;
			navigator.clipboard.writeText(url);
			toast.success("Link copied to clipboard");
		}
	};

	const handleRegister = async () => {
		if (!selectedEvent || !userId) return;
		if (selectedEvent.eventType === "SOLO") {
			try {
				setTeamState((prev) => ({ ...prev, registering: true }));
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/registerSolo`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ userId, eventId: selectedEvent.id }),
					},
				);
				const json = await res.json();
				if (json.success) {
					toast.success("Registered successfully!");
					setRegistered(true);
				} else toast.error(json.error || "Failed to register");
			} catch (err) {
				console.error("Error registering for event", err);
				toast.error("Something went wrong.");
			} finally {
				setTeamState((prev) => ({ ...prev, registering: false }));
			}
		}
	};

	const createTeam = async () => {
		if (!selectedEvent || !userId) return;
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/createTeam`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ userId, eventId: selectedEvent.id }),
				},
			);
			const json = await res.json();
			if (json.success && json.data?.teamId) {
				setTeamState((prev) => ({
					...prev,
					createdTeamId: json.data.teamId,
					members: Array.isArray(json.data?.members)
						? json.data.members.map((m: { id: string; name: string }) => ({
								id: m.id,
								name: m.name,
							}))
						: [{ id: userId, name: session?.user?.name || "You" }],
					action: "NONE",
				}));
				toast.success("Team created successfully!");
			} else toast.error(json.error || "Failed to create team");
		} catch {
			toast.error("Error creating team");
		}
	};

	const joinTeam = async () => {
		if (!selectedEvent || !userId || !teamState.teamId) return;
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/joinTeam`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ userId, teamId: teamState.teamId }),
				},
			);
			const json = await res.json();
			console.log("Join team response:", json);

			if (json.success) {
				toast.success("Joined team successfully!");
				setTeamState((prev) => ({
					...prev,
					createdTeamId: teamState.teamId,
					action: "NONE",
					members: Array.isArray(json.members)
						? json.members.map((m: { id: string; name: string }) => ({
								id: m.id,
								name: m.name,
							}))
						: [{ id: userId, name: session?.user?.name || "You" }],
				}));
			} else toast.error(json.error || "Failed to join team");
		} catch {
			toast.error("Error joining team");
		}
	};

	const confirmTeam = async () => {
		if (!selectedEvent || !userId || !teamState.createdTeamId) return;
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/confirmTeam`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ userId, teamId: teamState.createdTeamId }),
				},
			);
			const json = await res.json();
			if (json.success) toast.success("Team confirmed!");
			else toast.error(json.error || "Failed to confirm team");
		} catch {
			toast.error("Error confirming team");
		}
	};

	const deleteTeam = async () => {
		if (!selectedEvent || !userId || !teamState.createdTeamId) return;
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/deleteTeam`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ userId, teamId: teamState.createdTeamId }),
				},
			);
			const json = await res.json();
			if (json.success) {
				toast.success("Team deleted");
				setTeamState((prev) => ({
					...prev,
					createdTeamId: "",
					members: [],
					action: "NONE",
				}));
			} else toast.error(json.error || "Failed to delete");
		} catch {
			toast.error("Error deleting team");
		}
	};

	const renderTeamRegistration = () => {
		if (!teamInitialized) return null;
		if (teamState.createdTeamId) {
			return (
				<div className="flex flex-col gap-3 mt-4">
					<div className="flex items-center gap-2">
						<span className="font-semibold text-purple-900 dark:text-purple-100">
							Team ID:
						</span>
						<span className="text-purple-700 dark:text-purple-200">
							{teamState.createdTeamId}
						</span>
						<button
							type="button"
							onClick={() => {
								navigator.clipboard.writeText(teamState.createdTeamId);
								toast.success("Copied Team ID");
							}}
							className={`${BUTTON_CLASSES.secondary} px-2 py-1 text-xs`}
						>
							Copy
						</button>
					</div>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={confirmTeam}
							className={`${BUTTON_CLASSES.primary} flex-1`}
						>
							Confirm Team
						</button>
						<button
							type="button"
							onClick={deleteTeam}
							className={`${BUTTON_CLASSES.destructive} flex-1`}
						>
							Delete Team
						</button>
					</div>
					<div className="text-xs text-gray-400 mt-2">Members:</div>
					<ul className="text-sm list-disc pl-4">
						{teamState.members.length === 0 ? (
							<li>You</li>
						) : (
							teamState.members.map((m, idx) =>
								typeof m === "string" ? (
									<li key={m}>{m}</li>
								) : (
									<li key={m.id ?? idx}>
										{m.name}
										{session?.user?.id === m.id
											? " (You)"
											: idx === 0
												? " (Leader)"
												: ""}
									</li>
								),
							)
						)}
					</ul>
				</div>
			);
		}

		if (teamState.action === "CREATE") {
			createTeam();
			return (
				<div className="flex flex-col gap-3 mt-4">
					<button type="button" className={BUTTON_CLASSES.primary} disabled>
						Creating Team...
					</button>
				</div>
			);
		}
		if (teamState.action === "JOIN") {
			const handleJoin = async () => {
				setJoining(true);
				await joinTeam();
				setJoining(false);
			};

			return (
				<div className="flex flex-col gap-3 mt-4">
					<input
						type="text"
						placeholder="Enter Team ID"
						value={teamState.teamId}
						onChange={(e) =>
							setTeamState((prev) => ({ ...prev, teamId: e.target.value }))
						}
						className={BUTTON_CLASSES.input}
						disabled={joining}
					/>
					<button
						type="button"
						onClick={handleJoin}
						className={BUTTON_CLASSES.primary}
						disabled={!teamState.teamId || joining}
					>
						{joining ? "Joining..." : "Join"}
					</button>
					<button
						type="button"
						onClick={() =>
							setTeamState((prev) => ({ ...prev, action: "NONE" }))
						}
						className={BUTTON_CLASSES.secondary}
						disabled={joining}
					>
						Back
					</button>
				</div>
			);
		}

		return (
			<div className="flex flex-col gap-3 mt-4">
				<button
					type="button"
					onClick={() =>
						setTeamState((prev) => ({ ...prev, action: "CREATE" }))
					}
					className={BUTTON_CLASSES.primary}
				>
					Create Team
				</button>
				<button
					type="button"
					onClick={() => setTeamState((prev) => ({ ...prev, action: "JOIN" }))}
					className={BUTTON_CLASSES.secondary}
				>
					Join Team
				</button>
			</div>
		);
	};

	return (
		<div className="p-4 md:p-8 h-full w-full bg-transparent flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto mb-20">
			<div className="lilita-font text-6xl md:text-7xl lg:text-8xl font-bold text-flc-yellow relative mt-28 select-none text-center w-full">
				Events
			</div>
			<div
				className="m-4 md:m-8 select-none w-full flex justify-center"
				onChange={handleToggleChange}
			>
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
			<div className="min-h-screen w-[90%] grid justify-center items-start grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-2 md:mt-5 md:px-0">
				{loading ? (
					<div className="lilita-font w-full text-4xl md:text-6xl font-bold text-flc-yellow text-center col-span-full mt-20 md:mt-40">
						Loading...
					</div>
				) : eventsByYear[selectedYearData.year].length === 0 ? (
					<div className="w-full text-2xl md:text-5xl text-black dark:text-white text-center col-span-full mt-20 md:mt-40">
						No Events for {selectedYearData.year}
					</div>
				) : (
					eventsByYear[selectedYearData.year].map((event) => (
						<button
							type="button"
							key={`${event.name}-${event.fromDate}`}
							onClick={() => handleCardClick(event)}
							className="outline-none w-full text-left"
						>
							<Card image={event.imgSrc}>
								<div className="comic-font flex flex-col items-center justify-center h-full w-full">
									<div className="text-md md:text-sm text-black dark:text-white">
										{event.category}
									</div>
									<div className="text-lg md:text-2xl font-bold text-black dark:text-white">
										{event.name}
									</div>
									<div className="text-md md:text-md text-black dark:text-white mb-1">
										Date: {event.fromDate.split("T")[0]}
									</div>
								</div>
							</Card>
						</button>
					))
				)}
			</div>
			<Drawer.Root
				open={drawerOpen && !!selectedEvent}
				onOpenChange={setDrawerOpen}
				direction={drawerDirection}
				modal
			>
				<Drawer.Portal>
					<Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
					<Drawer.Content
						className={`
							fixed
							${
								drawerDirection === "right"
									? "top-0 right-0 h-full w-full sm:w-[420px] md:w-[500px] max-w-full rounded-l-3xl border-l border-purple-200 dark:border-indigo-800"
									: "bottom-0 left-0 w-full h-[90vh] rounded-t-3xl border-t border-purple-200 dark:border-indigo-800"
							}
							bg-gradient-to-l from-white via-purple-50 to-purple-100 dark:from-gray-900 dark:via-indigo-950 dark:to-indigo-900
							shadow-2xl z-50 flex flex-col transition-transform overflow-hidden
						`}
						style={{ maxHeight: "100vh" }}
					>
						<Drawer.Title asChild>
							<VisuallyHidden>{selectedEvent?.name}</VisuallyHidden>
						</Drawer.Title>
						<div
							className={`flex flex-col gap-4 px-4 pb-6 overflow-y-auto flex-1 ${drawerDirection === "bottom" ? "pt-2" : "pt-8"}`}
						>
							<h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 break-words">
								{selectedEvent?.name}
							</h2>
							{selectedEvent?.imgSrc && (
								<div className="flex justify-center">
									{/** biome-ignore lint/performance/noImgElement: <testong> */}
									<img
										ref={imageRef}
										src={selectedEvent.imgSrc}
										alt={selectedEvent.name}
										className="rounded-xl h-36 md:h-44 object-cover w-3/4 md:w-2/3 border border-purple-100 dark:border-indigo-800 shadow"
									/>
								</div>
							)}
							<p className="text-gray-700 dark:text-gray-300 text-sm md:text-base whitespace-pre-line break-words">
								{selectedEvent?.description}
							</p>
							<div className="grid grid-cols-2 gap-2 text-xs md:text-sm mt-2">
								<div>
									<span className="font-semibold text-purple-800 dark:text-purple-200">
										Venue:
									</span>{" "}
									{selectedEvent?.venue}
								</div>
								<div>
									<span className="font-semibold text-purple-800 dark:text-purple-200">
										Format:
									</span>{" "}
									{selectedEvent?.eventType}
								</div>
								<div>
									<span className="font-semibold text-purple-800 dark:text-purple-200">
										Team Size:
									</span>{" "}
									{selectedEvent?.maxTeamSize}
								</div>
								<div>
									<span className="font-semibold text-purple-800 dark:text-purple-200">
										Entry Fee:
									</span>{" "}
									{selectedEvent?.flcAmount}
								</div>
							</div>
							<div className="flex flex-col gap-3 mt-6">
								{selectedEvent?.eventType === "SOLO" && teamInitialized && (
									<button
										type="button"
										onClick={handleRegister}
										disabled={
											teamState.registering ||
											checkingRegistration ||
											registered
										}
										className={
											registered
												? BUTTON_CLASSES.disabled
												: BUTTON_CLASSES.primary
										}
									>
										{checkingRegistration
											? "Checking..."
											: teamState.registering
												? "Processing..."
												: registered
													? "Registered"
													: "Register"}
									</button>
								)}
								{selectedEvent?.eventType === "TEAM" &&
									renderTeamRegistration()}
								<button
									type="button"
									onClick={handleCopyLink}
									className={BUTTON_CLASSES.secondary}
								>
									Copy Link
								</button>
							</div>
						</div>
					</Drawer.Content>
				</Drawer.Portal>
			</Drawer.Root>
		</div>
	);
};

export default EventsPage;
