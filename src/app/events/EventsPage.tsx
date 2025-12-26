"use client";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import gsap from "gsap";
import { MailIcon, PhoneIcon, Trash2Icon, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Drawer } from "vaul";
import Card from "@/components/elements/Card";
import Radio from "@/components/elements/Radio";
import EventWhatsAppShare from "@/components/events/EventWhatsAppShare";
import PaymentButton from "@/components/razorpay/paymentButton";
import { Button } from "@/components/ui/button";
import { HTMLContent } from "@/components/ui/custom/html-content";
import SantaClaus from "@/components/ui/custom/SantaClaus";
import GlowingSigil from "@/components/ui/custom/GlowingSigil";

type EventYear =
	| "2020-21"
	| "2021-22"
	| "2022-23"
	| "2023-24"
	| "2024-25"
	| "2025-26";
type Member = {
	id: number;
	name: string;
};
type Event = {
	id: number;
	name: string;
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
	statusOfBatchRestriction: boolean;
	batchRestriction?: {
		year: number;
	}[];
	Organiser?: {
		name: string;
		email: string;
		phone: string;
		eventId: number;
	}[];
};
type EventsByYear = Record<EventYear, Event[]>;
type TeamState = {
	registering: boolean;
	leaderId: string;
	isConfirmed: boolean;
	isLeader: boolean;
	action: "NONE" | "CREATE" | "JOIN";
	teamName: string;
	yearOfStudy?: number;
	teamId: string;
	createdTeamId: string;
	members: { id: string; name: string }[];
};

const getEventYear = (dateStr: string): EventYear => {
	const eventDate = new Date(dateStr);
	const year = eventDate.getFullYear();
	const month = eventDate.getMonth();

	const academicYear = month < 5 ? year - 1 : year;

	if (academicYear <= 2020) return "2020-21";
	if (academicYear <= 2021) return "2021-22";
	if (academicYear <= 2022) return "2022-23";
	if (academicYear <= 2023) return "2023-24";
	if (academicYear === 2024) return "2024-25";
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
	}>({ year: "2025-26", index: 5 });
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [showSoloConfirm, setSoloConfirm] = useState(false);
	const [showTeamDialog, setShowTeamDialog] = useState(false);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [initialSlug, setInitialSlug] = useState<string | null>(null);
	const [teamInviteId, setTeamInviteId] = useState<string | null>(null);
	const [isTeamInviteFlow, setIsTeamInviteFlow] = useState(false);
	const [teamInviteProcessed, setTeamInviteProcessed] = useState(false);
	const [isClosingDrawer, setIsClosingDrawer] = useState(false);
	const [eventsByYear, setEventsByYear] = useState<EventsByYear>({
		"2020-21": [],
		"2021-22": [],
		"2022-23": [],
		"2023-24": [],
		"2024-25": [],
		"2025-26": [],
	});
	const [showDeleteTeam, setShowDeleteTeam] = useState(false);

	const [loading, setLoading] = useState({
		events: true,
		checkingRegistration: false,
		register: false,
		createTeam: false,
		confirmTeam: false,
		deleteTeam: false,
		leaveTeam: false,
		joinTeam: false,
		removeMember: false,
		checkAvailable: false,
	});
	const [teamState, setTeamState] = useState<TeamState>({
		teamName: "",
		registering: false,
		action: "NONE",
		isLeader: false,
		teamId: "",
		leaderId: "",
		yearOfStudy: 1,
		isConfirmed: false,
		createdTeamId: "",
		members: [],
	});
	const [registered, setRegistered] = useState(false);
	const [joining, setJoining] = useState(false);
	const [showQrModal, setShowQrModal] = useState(false);
	const [teamInitialized, setTeamInitialized] = useState(false);
	const [showLeaveDialog, setShowLeaveDialog] = useState(false);
	const [teamSize, setTeamSize] = useState("");
	const imageRef = useRef<HTMLImageElement>(null);
	const radioContainerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const searchParams = useSearchParams();
	const { data: session, status: sessionStatus } = useSession();
	const userId = session?.user?.id;
	const [drawerDirection, setDrawerDirection] = useState<"right" | "bottom">(
		"right",
	);
	const [toBeDeletedMember, setToBeDeletedMember] = useState<Member | null>(
		null,
	);
	const [showRemoveMemberDialog, setShowRemoveMemberDialog] = useState(false);
	const [available, setAvailable] = useState<null | boolean>(null);

	useEffect(() => {
		const fetchEvents = async () => {
			setLoading((prev) => ({ ...prev, events: true }));
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
						"2020-21": [],
						"2021-22": [],
						"2022-23": [],
						"2023-24": [],
						"2024-25": [],
						"2025-26": [],
					};
					for (const event of json.data) {
						const yearKey = getEventYear(event.fromDate);
						grouped[yearKey].push(event);
					}
					for (const year in grouped) {
						grouped[year as EventYear].sort(
							(a, b) =>
								new Date(b.fromDate).getTime() - new Date(a.fromDate).getTime(),
						);
					}
					setEventsByYear(grouped);
				}
			} catch (_error) {
				// Failed to fetch events
			} finally {
				setLoading((prev) => ({ ...prev, events: false }));
			}
		};
		fetchEvents();
	}, []);

	const resetUrl = () => {
		const params = new URLSearchParams(window.location.search);
		params.delete("teamInvite");
		const newUrl = `${window.location.pathname}${
			params.toString() ? `?${params.toString()}` : ""
		}`;
		window.history.replaceState({}, "", newUrl);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <no need of exhaustive dependencies>
	useEffect(() => {
		if (isClosingDrawer) return;

		const slug = searchParams.get("id");
		const teamInvite = searchParams.get("teamInvite");
		console.log("Search params:", searchParams.toString());

		if (slug && !initialSlug) setInitialSlug(slug);

		if (teamInvite && !teamInviteId) {
			setTeamInviteId(teamInvite);
			setIsTeamInviteFlow(true);
		}
	}, [searchParams, initialSlug, isClosingDrawer]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <no need of exhaustive dependencies>
	useEffect(() => {
		if (!initialSlug || loading.events || isClosingDrawer) return;
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
			const yearIndex =
				found.year === "2020-21"
					? 0
					: found.year === "2021-22"
						? 1
						: found.year === "2022-23"
							? 2
							: found.year === "2023-24"
								? 3
								: found.year === "2024-25"
									? 4
									: 5;
			setSelectedYearData({ year: found.year, index: yearIndex });

			if (
				teamInviteId &&
				found.event.eventType === "TEAM" &&
				isTeamInviteFlow &&
				!teamInviteProcessed
			) {
				if (sessionStatus === "loading") {
					return;
				}

				if (sessionStatus === "unauthenticated" || !userId) {
					toast.info("Please login to join the team!");
					router.push(
						`/auth/login?returnTo=${encodeURIComponent(window.location.href)}`,
					);
					return;
				}

				if (
					sessionStatus === "authenticated" &&
					userId &&
					!teamState.createdTeamId
				) {
					setDrawerOpen(true);
					setTeamInviteProcessed(true);
					toast.success(`Welcome! Ready to join team: ${teamInviteId}`, {
						autoClose: 3000,
					});

					setTeamState((prev) => ({
						...prev,
						action: "JOIN",
						teamId: teamInviteId,
					}));
				}
			} else if (!isTeamInviteFlow || teamInviteProcessed) {
				if (!drawerOpen) {
					setDrawerOpen(true);
				}
			}
		}
	}, [
		initialSlug,
		eventsByYear,
		loading.events,
		teamInviteId,
		isTeamInviteFlow,
		sessionStatus,
		userId,
		teamInviteProcessed,
		drawerOpen,
		isClosingDrawer,
		router.push,
	]);

	useEffect(() => {
		const checkMobile = () => {
			const mobile = window.matchMedia("(max-width: 767px)").matches;
			setDrawerDirection(mobile ? "bottom" : "right");
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		if (drawerOpen && imageRef.current) {
			gsap.fromTo(
				imageRef.current,
				{ x: "100%", opacity: 0 },
				{ x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
			);
		}
	}, [drawerOpen]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <to be fixed>
	useEffect(() => {
		setShowTeamDialog(false);
		setSoloConfirm(false);
		const checkRegistrationAndAvailable = async () => {
			if (!selectedEvent) {
				setTeamInitialized(true);
				return;
			}

			setLoading((prev) => ({
				...prev,
				checkingRegistration: true,
				checkAvailable: true,
			}));

			try {
				let isRegistered = false;
				if (userId) {
					if (selectedEvent.eventType === "SOLO") {
						const resSolo = await fetch(
							`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/checkSolo`,
							{
								method: "POST",
								headers: {
									"Content-Type": "application/json",
									Authorization: `Bearer ${session?.user?.accessToken}`,
								},
								body: JSON.stringify({ eventId: selectedEvent.id }),
							},
						);
						const jsonSolo = await resSolo.json();
						if (resSolo.ok && jsonSolo.result.success) {
							setRegistered(true);
							setTeamState((prev) => ({
								...prev,
								isConfirmed: jsonSolo.result.isConfirmed || false,
								createdTeamId: jsonSolo.result.teamId,
							}));
							isRegistered = true;
						} else {
							setRegistered(false);
						}
					} else if (selectedEvent.eventType === "TEAM") {
						const resTeam = await fetch(
							`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/getTeam`,
							{
								method: "POST",
								headers: {
									"Content-Type": "application/json",
									Authorization: `Bearer ${session?.user?.accessToken}`,
								},
								body: JSON.stringify({ eventId: selectedEvent.id }),
							},
						);
						const jsonTeam = await resTeam.json();
						if (resTeam.ok && jsonTeam.success && jsonTeam.data) {
							const members = Array.isArray(jsonTeam.data.members)
								? jsonTeam.data.members.map(
										(m: { id: string; name: string }) => ({
											id: m.id,
											name: m.name,
										}),
									)
								: [];
							setTeamState((prev) => ({
								...prev,
								isConfirmed: jsonTeam.data.isConfirmed || false,
								teamName: jsonTeam.data.teamName || "",
								leaderId: jsonTeam.data.leaderId || "",
								isLeader: jsonTeam.data.isLeader || false,
								registering: true,
								createdTeamId: jsonTeam.data.teamId,
								members,
								action:
									prev.action === "JOIN" && prev.teamId && isTeamInviteFlow
										? prev.action
										: "NONE",
								teamId:
									prev.action === "JOIN" && prev.teamId && isTeamInviteFlow
										? prev.teamId
										: "",
							}));
							setRegistered(true);
						} else {
							if (!isTeamInviteFlow && teamState.action !== "JOIN") {
								setTeamState((prev) => ({
									...prev,
									teamName: "",
									isConfirmed: false,
									isLeader: false,
									registering: true,
									createdTeamId: "",
									members: [],
									action: "NONE",
								}));
							}
						}
					}
				}

				const resAvailable = await fetch(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/check-available`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ eventId: selectedEvent.id }),
					},
				);
				const jsonAvailable = await resAvailable.json();
				if (resAvailable.ok && typeof jsonAvailable.available === "boolean") {
					setAvailable(jsonAvailable.available);
				} else {
					setAvailable(null);
				}

				if (!isRegistered) setTeamInitialized(true);
			} catch (_err) {
				setAvailable(null);
			} finally {
				setTeamInitialized(true);
				setLoading((prev) => ({
					...prev,
					checkAvailable: false,
					checkingRegistration: false,
				}));
			}
		};

		setAvailable(null);
		setRegistered(false);
		setTeamInitialized(false);

		if (selectedEvent) {
			if (teamState.action === "JOIN") {
				setTeamInitialized(true);
			}

			checkRegistrationAndAvailable();
		}
		if (selectedEvent) {
			const size =
				selectedEvent.eventType === "SOLO"
					? "1"
					: selectedEvent.minTeamSize === selectedEvent.maxTeamSize
						? `${selectedEvent.minTeamSize}`
						: `${selectedEvent.minTeamSize} - ${selectedEvent.maxTeamSize}  `;
			setTeamSize(size);
		}
	}, [selectedEvent, userId, isTeamInviteFlow, teamState.action]);

	const handleToggleChange = (e: React.ChangeEvent<HTMLDivElement>) => {
		const id = (e.target as HTMLElement).id;
		if (id === "glass-bronze")
			setSelectedYearData({ year: "2020-21", index: 0 });
		else if (id === "glass-mad")
			setSelectedYearData({ year: "2021-22", index: 1 });
		else if (id === "glass-gd")
			setSelectedYearData({ year: "2022-23", index: 2 });
		else if (id === "glass-silver")
			setSelectedYearData({ year: "2023-24", index: 3 });
		else if (id === "glass-gold")
			setSelectedYearData({ year: "2024-25", index: 4 });
		else if (id === "glass-platinum")
			setSelectedYearData({ year: "2025-26", index: 5 });
	};

	const handleDrawerClose = (open: boolean) => {
		if (!open && drawerOpen) {
			setIsClosingDrawer(true);
		}
		setDrawerOpen(open);

		if (!open) {
			const params = new URLSearchParams(window.location.search);
			params.delete("id");
			params.delete("teamInvite");
			const newUrl = `${window.location.pathname}${
				params.toString() ? `?${params.toString()}` : ""
			}`;
			window.history.replaceState({}, "", newUrl);

			setSelectedEvent(null);
			setRegistered(false);
			setInitialSlug(null);
			setTeamInviteId(null);
			setIsTeamInviteFlow(false);
			setTeamInviteProcessed(true);
			setTeamState({
				teamName: "",
				isConfirmed: false,
				registering: false,
				action: "NONE",
				isLeader: false,
				leaderId: "",
				teamId: "",
				createdTeamId: "",
				members: [],
			});
			setTeamInitialized(false);
			setAvailable(null);

			setTimeout(() => {
				setIsClosingDrawer(false);
			}, 100);
		}
	};

	const handleCardClick = (event: Event) => {
		if (isClosingDrawer) return;
		setSelectedEvent(event);
		router.push(`?id=${event.id}`, { scroll: false });
		setDrawerOpen(true);
	};

	const removeMemberFromTeam = async (memberId: number | null) => {
		if (!selectedEvent || !userId || !memberId || !teamState.createdTeamId)
			return;

		try {
			setLoading((prev) => ({ ...prev, removeMember: true }));
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/removeMember`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${session?.user?.accessToken}`,
					},
					body: JSON.stringify({
						memberId,
						teamId: teamState.createdTeamId,
					}),
				},
			);
			const json = await res.json();
			if (json.success) {
				toast.success("Member removed successfully!");
				setTeamState((prev) => ({
					...prev,
					members: prev.members.filter((m) => m.id !== memberId.toString()),
				}));
				if (memberId.toString() === userId) {
					setRegistered(false);
					setTeamState((prev) => ({
						...prev,
						action: "NONE",
						isLeader: false,
						createdTeamId: "",
						members: [],
					}));
				}
			} else {
				toast.error(json.error || "Failed to remove member");
			}
		} catch (error) {
			const errorMessage =
				typeof error === "object" && error !== null && "message" in error
					? (error as { message?: string }).message
					: String(error);
			toast.error(`Error removing member: ${errorMessage}`);
		}
	};

	const handleCopyLink = () => {
		if (selectedEvent) {
			const url = `${window.location.origin}/events?id=${selectedEvent.id}`;
			navigator.clipboard.writeText(url);
			toast.success("Link copied to clipboard");
		}
	};

	const handleRegister = async () => {
		if (!selectedEvent) return;
		if (!userId) {
			toast.error("Login to register");
			return;
		}
		if (selectedEvent.eventType === "SOLO") {
			try {
				setLoading((prev) => ({ ...prev, register: true }));
				setTeamState((prev) => ({ ...prev, registering: true }));
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/registerSolo`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${session?.user?.accessToken}`,
						},
						body: JSON.stringify({ eventId: selectedEvent.id }),
					},
				);
				const json = await res.json();
				if (json.success) {
					toast.success("Registered successfully!");
					setRegistered(true);
					setTeamState((prev) => ({
						...prev,
						createdTeamId: json.data.teamId,
						leaderId: userId,
					}));
					setTimeout(() => refreshRegistrationData(), 500);
				} else toast.error(json.error || "Failed to register");
			} catch (_err) {
				toast.error("Something went wrong.");
			} finally {
				setTeamState((prev) => ({ ...prev, registering: false }));
				setLoading((prev) => ({ ...prev, register: false }));
			}
		}
	};

	const refreshRegistrationData = useCallback(async () => {
		if (!selectedEvent) return;

		setLoading((prev) => ({
			...prev,
			checkingRegistration: true,
			checkAvailable: true,
		}));

		try {
			let _isRegistered = false;
			if (userId) {
				if (selectedEvent.eventType === "SOLO") {
					const resSolo = await fetch(
						`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/checkSolo`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${session?.user?.accessToken}`,
							},
							body: JSON.stringify({ eventId: selectedEvent.id }),
						},
					);
					const jsonSolo = await resSolo.json();
					if (resSolo.ok && jsonSolo.result.success) {
						setRegistered(true);
						setTeamState((prev) => ({
							...prev,
							isConfirmed: jsonSolo.result.isConfirmed || false,
							createdTeamId: jsonSolo.result.teamId,
						}));
						_isRegistered = true;
					} else {
						setRegistered(false);
					}
				} else if (selectedEvent.eventType === "TEAM") {
					const resTeam = await fetch(
						`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/getTeam`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${session?.user?.accessToken}`,
							},
							body: JSON.stringify({ eventId: selectedEvent.id }),
						},
					);
					const jsonTeam = await resTeam.json();
					if (resTeam.ok && jsonTeam.success && jsonTeam.data) {
						const members = Array.isArray(jsonTeam.data.members)
							? jsonTeam.data.members.map(
									(m: { id: string; name: string }) => ({
										id: m.id,
										name: m.name,
									}),
								)
							: [];
						setTeamState((prev) => ({
							...prev,
							isConfirmed: jsonTeam.data.isConfirmed || false,
							teamName: jsonTeam.data.teamName || "",
							leaderId: jsonTeam.data.leaderId || "",
							isLeader: jsonTeam.data.isLeader || false,
							registering: true,
							createdTeamId: jsonTeam.data.teamId,
							members,
						}));
						setRegistered(true);
					} else {
						setTeamState((prev) => ({
							...prev,
							teamName: "",
							isConfirmed: false,
							isLeader: false,
							registering: true,
							createdTeamId: "",
							leaderId: "",
							members: [],
							action: "NONE",
						}));
					}
				}
			}

			const resAvailable = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/check-available`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ eventId: selectedEvent.id }),
				},
			);
			const jsonAvailable = await resAvailable.json();
			if (resAvailable.ok && typeof jsonAvailable.available === "boolean") {
				setAvailable(jsonAvailable.available);
			} else {
				setAvailable(null);
			}
		} catch (_err) {
			setAvailable(null);
		} finally {
			setLoading((prev) => ({
				...prev,
				checkAvailable: false,
				checkingRegistration: false,
			}));
		}
	}, [selectedEvent, userId, session?.user?.accessToken]);

	useEffect(() => {
		const scrollToEnd = () => {
			if (radioContainerRef.current && window.innerWidth <= 768) {
				setTimeout(() => {
					const container = radioContainerRef.current;
					if (container) {
						container.scrollLeft =
							container.scrollWidth - container.clientWidth;
					}
				}, 100);
			}
		};

		scrollToEnd();

		const handleResize = () => {
			if (window.innerWidth <= 768) {
				if (radioContainerRef.current) {
					const container = radioContainerRef.current;
					const isAtEnd =
						container.scrollLeft >=
						container.scrollWidth - container.clientWidth - 10;
					if (isAtEnd) {
						scrollToEnd();
					}
				}
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const createTeam = useCallback(async () => {
		if (!selectedEvent) return;
		if (!userId) {
			toast.error("Login to register");
			setLoading((prev) => ({ ...prev, createTeam: false }));
			return;
		}
		try {
			setLoading((prev) => ({ ...prev, createTeam: true }));
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/createTeam`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${session?.user?.accessToken}`,
					},
					body: JSON.stringify({
						eventId: selectedEvent.id,
						teamName: teamState.teamName,
						yearOfStudy: teamState.yearOfStudy,
					}),
				},
			);
			const json = await res.json();
			if (json.success && json.data?.teamId) {
				setTeamState((prev) => ({
					...prev,
					createdTeamId: json.data.teamId,
					isLeader: true,
					leaderId: userId,
					yearOfStudy: prev.yearOfStudy,
					members: Array.isArray(json.data?.members)
						? json.data.members.map((m: { id: string; name: string }) => ({
								id: m.id,
								name: m.name,
							}))
						: [{ id: userId, name: session?.user?.name || "You" }],
					action: "NONE",
				}));
				toast.success("Team created successfully!");

				await refreshRegistrationData(); // have removed timeout from here, might be needed to test if anything breaks due to this
				setShowTeamDialog(false);
			} else {
				toast.error(json.error || "Failed to create team");
				setTeamState((prev) => ({
					...prev,
					action: "NONE",
				}));
				return null;
			}
		} catch {
			toast.error("Error creating team");
		} finally {
			setLoading((prev) => ({ ...prev, createTeam: false }));
		}
	}, [
		selectedEvent,
		userId,
		session,
		teamState.teamName,
		refreshRegistrationData,
		teamState.yearOfStudy,
	]);

	const joinTeam = useCallback(async () => {
		if (!selectedEvent) return;
		if (!userId) {
			toast.error("Login to register");
			setLoading((prev) => ({ ...prev, joinTeam: false }));
			return;
		}
		if (!teamState.teamId) return;
		try {
			setLoading((prev) => ({ ...prev, joinTeam: true }));
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/joinTeam`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${session?.user?.accessToken}`,
					},
					body: JSON.stringify({
						teamId: teamState.teamId,
						eventId: selectedEvent.id,
					}),
				},
			);
			const json = await res.json();
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
				setTimeout(() => refreshRegistrationData(), 500);
			} else {
				toast.error(json.error || "Failed to join team");
				setTeamState((prev) => ({
					...prev,
					action: "NONE",
				}));
			}
		} catch {
			toast.error("Error joining team");
		} finally {
			setLoading((prev) => ({ ...prev, joinTeam: false }));
		}
	}, [
		selectedEvent,
		userId,
		teamState.teamId,
		session,
		refreshRegistrationData,
	]);

	const confirmTeam = async () => {
		if (!selectedEvent) return;
		if (!userId) {
			toast.error("Login to register");
			setLoading((prev) => ({ ...prev, confirmTeam: false }));
			return;
		}
		if (!teamState.createdTeamId) return;
		try {
			setLoading((prev) => ({ ...prev, confirmTeam: true }));
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/confirmTeam`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${session?.user?.accessToken}`,
					},
					body: JSON.stringify({ teamId: teamState.createdTeamId }),
				},
			);
			const json = await res.json();
			if (json.success) {
				toast.success("Team confirmed!");
				setTimeout(() => refreshRegistrationData(), 500);
			} else toast.error(json.error || "Failed to confirm team");
		} catch {
			toast.error("Error confirming team");
		} finally {
			setLoading((prev) => ({ ...prev, confirmTeam: false }));
		}
	};

	const deleteTeam = async () => {
		if (!selectedEvent) return;
		if (!userId) {
			toast.error("Login to register");
			setLoading((prev) => ({ ...prev, deleteTeam: false }));
			return;
		}
		if (!teamState.createdTeamId) return;
		try {
			setLoading((prev) => ({ ...prev, deleteTeam: true }));
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/deleteTeam`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${session?.user?.accessToken}`,
					},
					body: JSON.stringify({ teamId: teamState.createdTeamId }),
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
				setTimeout(() => refreshRegistrationData(), 500);
			} else toast.error(json.error || "Failed to delete");
		} catch {
			toast.error("Error deleting team");
		} finally {
			setLoading((prev) => ({ ...prev, deleteTeam: false }));
		}
	};

	const leaveTeam = async () => {
		if (!selectedEvent) return;
		if (!userId) {
			toast.error("Login to register");
			setLoading((prev) => ({ ...prev, leaveTeam: false }));
			return;
		}
		if (!teamState.createdTeamId) return;
		try {
			setLoading((prev) => ({ ...prev, leaveTeam: true }));
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/leaveTeam`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${session?.user?.accessToken}`,
					},
					body: JSON.stringify({ teamId: teamState.createdTeamId }),
				},
			);
			const json = await res.json();
			if (json.success) {
				toast.success("Left team successfully");
				setTeamState((prev) => ({
					...prev,
					createdTeamId: "",
					members: [],
					action: "NONE",
				}));
				setTimeout(() => refreshRegistrationData(), 500);
			} else toast.error(json.error || "Failed to leave team");
		} catch {
			toast.error("Error leaving team");
		} finally {
			setLoading((prev) => ({ ...prev, leaveTeam: false }));
		}
	};

	const renderTeamRegistration = () => {
		if (!teamInitialized) return null;

		if (loading.checkingRegistration) {
			return (
				<div className="flex flex-col gap-3 mt-4">
					<button type="button" className={BUTTON_CLASSES.primary} disabled>
						Checking...
					</button>
				</div>
			);
		}
		if (teamState.createdTeamId && teamState.teamName) {
			return (
				<div className="flex flex-col gap-3 mt-4">
					<div className="flex flex-col sm:flex-row items-start gap-4 w-full bg-white/50 dark:bg-indigo-900/30 rounded-xl p-4 border border-purple-200 dark:border-indigo-700">
						<div className="flex flex-col gap-3 flex-1 min-w-0">
							<div className="flex flex-col sm:flex-row sm:items-center gap-2">
								<span className="font-semibold text-purple-900 dark:text-purple-100 text-base md:text-lg whitespace-nowrap">
									Team Name:
								</span>
								<span className="px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-indigo-800 text-purple-700 dark:text-purple-200 text-base md:text-lg font-mono shadow-sm truncate">
									{teamState.teamName}
								</span>
							</div>
							<div className="flex flex-col sm:flex-row sm:items-center gap-2">
								<span className="font-semibold text-purple-900 dark:text-purple-100 text-base md:text-lg whitespace-nowrap">
									Team ID:
								</span>
								<div className="flex items-center gap-2 min-w-0 flex-1">
									<span
										className="px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-indigo-800 text-purple-700 dark:text-purple-200 text-base md:text-lg font-mono shadow-sm truncate flex-1"
										title={teamState.createdTeamId}
									>
										{teamState.createdTeamId}
									</span>
									<button
										type="button"
										onClick={() => {
											navigator.clipboard.writeText(teamState.createdTeamId);
											toast.success("Copied Team ID");
										}}
										className={`${BUTTON_CLASSES.secondary} px-3 py-1.5 text-xs whitespace-nowrap rounded-lg border border-purple-300 dark:border-indigo-700 hover:bg-purple-200 dark:hover:bg-indigo-800 transition flex-shrink-0`}
										title="Copy Team ID"
									>
										Copy
									</button>
								</div>
							</div>
						</div>
						<div className="flex-shrink-0 flex justify-center sm:justify-end">
							<button
								type="button"
								className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-purple-100 dark:bg-zinc-400 rounded-xl border border-purple-300 dark:border-indigo-700 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
								onClick={() => setShowQrModal(true)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										setShowQrModal(true);
									}
								}}
								aria-label="Show QR Code"
								tabIndex={0}
							>
								<QRCodeSVG
									value={teamState.createdTeamId}
									size={80}
									bgColor="#F3E8FF"
									fgColor="#59168b"
									className="w-16 h-16 md:w-20 md:h-20 object-contain"
								/>
							</button>
						</div>
					</div>
					{showQrModal && (
						<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
							<div className="relative bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
								<button
									type="button"
									onClick={() => setShowQrModal(false)}
									className="absolute top-2 right-2 text-black hover:text-gray-600"
									aria-label="Close"
								>
									<X className="h-6 w-6" />
								</button>
								<QRCodeSVG
									value={teamState.createdTeamId}
									size={256}
									bgColor="#FFFFFF"
									fgColor="#000000"
									className="w-64 h-64 object-contain p-3 mx-auto"
								/>
								<div className="mt-4 text-center text-black break-all font-mono">
									{teamState.createdTeamId}
								</div>
							</div>
						</div>
					)}
					{teamState.isConfirmed ? (
						<div className="w-full rounded-xl border border-green-500 bg-green-100 dark:bg-green-950 dark:border-green-400 p-4 text-center">
							<span className="text-green-800 dark:text-green-300 font-semibold text-lg md:text-xl">
								Team has been confirmed!
							</span>
						</div>
					) : teamState.isLeader &&
						selectedEvent?.deadline &&
						new Date(selectedEvent.deadline) > new Date() ? (
						<>
							<div className="flex gap-2">
								{selectedEvent &&
								(selectedEvent?.flcAmount > 0 ||
									selectedEvent?.nonFlcAmount > 0) ? (
									<PaymentButton
										id="confirm-team-payment"
										paymentType="EVENT"
										extraClassName={BUTTON_CLASSES.primary}
										amountInINR={400}
										onStart={() => {
											setLoading((prev) => ({ ...prev, confirmTeam: true }));
										}}
										onEnd={() => {
											setLoading((prev) => ({ ...prev, confirmTeam: false }));
										}}
										description={selectedEvent.name}
										teamId={teamState.createdTeamId}
										disabled={
											loading.confirmTeam ||
											!userId ||
											teamState.isConfirmed ||
											(selectedEvent.deadline &&
												new Date(selectedEvent.deadline) <= new Date()) ||
											!selectedEvent ||
											teamState.members.length < selectedEvent.minTeamSize ||
											teamState.members.length > selectedEvent.maxTeamSize
										}
										onSuccess={async (_paymentId) => {
											setLoading((prev) => ({
												...prev,
												confirmTeam: false,
											}));
											toast.success("Payment successful");
											// Refresh the drawer data to show updated state
											setTimeout(() => refreshRegistrationData(), 500);
										}}
										onFailure={(error) => {
											setLoading((prev) => ({
												...prev,
												confirmTeam: false,
											}));
											toast.error(error || "Payment failed");
										}}
									>
										{loading.confirmTeam
											? "Confirming..."
											: "Pay to confirm Team"}
									</PaymentButton>
								) : (
									<button
										type="button"
										onClick={confirmTeam}
										className={`${BUTTON_CLASSES.primary} flex-1`}
										disabled={loading.confirmTeam || !userId}
									>
										{loading.confirmTeam ? "Confirming..." : "Confirm Team"}
									</button>
								)}
								<button
									type="button"
									onClick={() => setShowDeleteTeam(true)}
									className={`${BUTTON_CLASSES.destructive}`}
									disabled={loading.deleteTeam || !userId}
								>
									{loading.deleteTeam ? "Deleting..." : "Delete Team"}
								</button>
							</div>
							{teamState.members.length < selectedEvent.minTeamSize ? (
								<span className="text-red-800 text-center dark:text-red-400 font-semibold text-md md:text-xl">
									Team Size not met! Please add more members.
								</span>
							) : teamState.members.length > selectedEvent.maxTeamSize ? (
								<span className="text-red-800 text-center dark:text-red-400 font-semibold text-md md:text-xl">
									Team Size exceeded! Please remove some members.
								</span>
							) : null}
						</>
					) : !teamState.isLeader &&
						selectedEvent?.deadline &&
						!teamState.isConfirmed &&
						new Date(selectedEvent.deadline) > new Date() ? (
						<Button
							disabled={loading.leaveTeam || !userId}
							onClick={() => setShowLeaveDialog(true)}
							className={BUTTON_CLASSES.destructive}
						>
							Leave Team
						</Button>
					) : (
						selectedEvent?.deadline &&
						new Date(selectedEvent.deadline) <= new Date() && (
							<div className="w-full rounded-xl border border-red-500 bg-red-100 dark:bg-red-950 dark:border-red-400 p-4 text-center">
								<span className="text-red-800 dark:text-red-300 font-semibold text-lg md:text-xl">
									Team registration has ended!
								</span>
							</div>
						)
					)}
					<div className="flex items-center gap-4 mt-1">
						<div className="text-base md:text-lg text-purple-800 dark:text-purple-200 font-semibold">
							Members:
						</div>
					</div>
					<ul className="text-lg md:text-xl list-disc pl-2 text-purple-900 dark:text-purple-100">
						{teamState.members.length === 0 ? (
							<li>You</li>
						) : (
							teamState.members.map((m, idx) =>
								typeof m === "string" ? (
									<li key={m}>{m}</li>
								) : (
									<li key={m.id ?? idx} className="flex items-center gap-2">
										<span>
											<span className="mr-2">•</span>
											{m.name}
											{session?.user?.id === m.id
												? " (You)"
												: m.id === teamState.leaderId
													? " (Leader)"
													: ""}
										</span>
										{m.id !== teamState.leaderId &&
											m.id !== session?.user?.id &&
											teamState.isLeader && (
												<span className="flex items-center">
													<Trash2Icon
														onClick={() => {
															setToBeDeletedMember({
																id: parseInt(m.id),
																name: m.name,
															});
															setShowRemoveMemberDialog(true);
														}}
														className="inline"
														size={18}
													/>
												</span>
											)}
									</li>
								),
							)
						)}
					</ul>
				</div>
			);
		}

		if (teamState.action === "CREATE") {
			if (!userId) {
				toast.error("Login to register");
				setTeamState((prev) => ({ ...prev, action: "NONE" }));
				return null;
			}
			if (!loading.createTeam) createTeam();
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
				if (!userId) {
					toast.error("Login to register");
					return;
				}
				if (!teamState.teamId.trim()) {
					toast.error("Please enter a team ID");
					return;
				}
				setJoining(true);
				await joinTeam();
				resetUrl();
				setIsTeamInviteFlow(false);
				setJoining(false);
			};

			return (
				<div className="flex flex-col gap-4 mt-4 p-4 border border-purple-200 dark:border-indigo-700 rounded-xl bg-purple-50 dark:bg-indigo-900/30">
					{isTeamInviteFlow && teamState.teamId && (
						<div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4">
							<div className="flex items-center gap-3 text-green-700 dark:text-green-300 mb-2">
								<div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full">
									<span className="text-lg">🎉</span>
								</div>
								<span className="font-semibold text-base">
									You're invited to join this team!
								</span>
							</div>
							<div className="bg-white dark:bg-green-800/20 rounded-md p-2 border border-green-200 dark:border-green-600">
								<span className="text-green-600 dark:text-green-400 text-sm font-medium">
									Team ID:{" "}
								</span>
								<span className="text-green-800 dark:text-green-200 font-mono text-sm">
									{teamState.teamId}
								</span>
							</div>
						</div>
					)}

					<div className="space-y-3">
						<label
							htmlFor="team-id-input"
							className="block text-purple-900 dark:text-purple-100 font-semibold text-sm"
						>
							{isTeamInviteFlow && teamState.teamId
								? "Confirm Team ID"
								: "Enter Team ID"}
						</label>
						<input
							id="team-id-input"
							type="text"
							placeholder={
								isTeamInviteFlow && teamState.teamId
									? "Team ID (pre-filled)"
									: "Enter the team ID you want to join"
							}
							value={teamState.teamId}
							onChange={(e) =>
								setTeamState((prev) => ({ ...prev, teamId: e.target.value }))
							}
							className={`${BUTTON_CLASSES.input} transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
							disabled={joining || loading.joinTeam}
							readOnly={isTeamInviteFlow && !!teamState.teamId}
						/>
					</div>

					<div className="flex gap-3">
						<button
							type="button"
							onClick={handleJoin}
							className={`flex-1 transition-all duration-200 ${
								isTeamInviteFlow && teamState.teamId
									? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
									: BUTTON_CLASSES.primary
							}`}
							disabled={!teamState.teamId.trim() || joining || loading.joinTeam}
						>
							{joining || loading.joinTeam ? (
								<div className="flex items-center justify-center gap-2">
									<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
									<span>Joining...</span>
								</div>
							) : isTeamInviteFlow && teamState.teamId ? (
								<div className="flex items-center justify-center gap-2">
									<span>✨</span>
									<span>Accept Invitation</span>
								</div>
							) : (
								"Join Team"
							)}
						</button>

						<button
							type="button"
							onClick={() => {
								setTeamState((prev) => ({
									...prev,
									action: "NONE",
									teamId: isTeamInviteFlow ? prev.teamId : "",
								}));
								if (isTeamInviteFlow) {
									toast.info("Team invite declined");
									resetUrl();
									setIsTeamInviteFlow(false);
									setTeamInviteId(null);
									setTeamInviteProcessed(true);
								}
							}}
							className={`px-6 transition-all duration-200 ${BUTTON_CLASSES.secondary} hover:bg-purple-100 dark:hover:bg-indigo-800`}
							disabled={joining || loading.joinTeam}
						>
							{isTeamInviteFlow && teamState.teamId ? "Decline" : "Cancel"}
						</button>
					</div>

					{!isTeamInviteFlow && (
						<div className="text-xs text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-indigo-800/30 p-2 rounded-md">
							💡 <strong>Tip:</strong> Get the team ID from your team leader or
							the team QR code
						</div>
					)}
				</div>
			);
		}

		if (
			selectedEvent?.deadline &&
			new Date(selectedEvent.deadline) > new Date() &&
			selectedEvent.state !== "COMPLETED"
		) {
			return (
				<div className="flex flex-col gap-3 mt-4">
					<button
						type="button"
						className={BUTTON_CLASSES.primary}
						onClick={() => {
							setShowTeamDialog(true);
						}}
						disabled={loading.createTeam}
					>
						{loading.createTeam ? "Creating Team..." : "Create Team"}
					</button>

					<button
						type="button"
						onClick={() => {
							if (!userId) {
								toast.error("Login to register");
								return;
							}
							setTeamState((prev) => ({
								...prev,
								action: "JOIN",
								teamId: "",
								teamName: "",
								isConfirmed: false,
								isLeader: false,
								leaderId: "",
								registering: false,
								createdTeamId: "",
								members: [],
							}));
						}}
						className={BUTTON_CLASSES.secondary}
						disabled={loading.joinTeam}
					>
						{loading.joinTeam ? "Joining..." : "Join Team"}
					</button>
				</div>
			);
		}
	};

	return (
		<div className="p-4 md:p-8 h-full w-full bg-transparent flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto mb-20">
			<div className="lilita-font text-6xl md:text-7xl lg:text-8xl font-bold text-flc-yellow relative mt-32 md:mt-20 select-none text-center w-full mb-5">
				EVENTS
			</div>
			<div
				ref={radioContainerRef}
				className="m-4 md:m-8 select-none w-full flex justify-center overflow-x-auto scrollbar-hide rounded-2xl"
				onChange={handleToggleChange}
				style={{
					scrollbarWidth: "none",
					msOverflowStyle: "none",
				}}
			>
				<Radio
					plans={[
						{ id: "glass-bronze", label: "2020-21" },
						{ id: "glass-mad", label: "2021-22" },
						{ id: "glass-gd", label: "2022-23" },
						{ id: "glass-silver", label: "2023-24" },
						{ id: "glass-gold", label: "2024-25" },
						{ id: "glass-platinum", label: "2025-26" },
					]}
					selected={selectedYearData.index}
					setSelected={(index) => {
						const year =
							index === 0
								? "2020-21"
								: index === 1
									? "2021-22"
									: index === 2
										? "2022-23"
										: index === 3
											? "2023-24"
											: index === 4
												? "2024-25"
												: "2025-26";
						setSelectedYearData({ year, index });
					}}
				/>
			</div>
			<div
				key={selectedYearData.year}
				className="w-full md:w-[90%] grid justify-center items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-2 md:mt-5 md:px-0"
				style={{
					gridAutoRows: "minmax(400px, 1fr)",
					display: "grid",
				}}
			>
				{loading.events || (isTeamInviteFlow && sessionStatus === "loading") ? (
					<div className="lilita-font w-full text-4xl md:text-6xl font-bold text-flc-yellow text-center col-span-full md:mt-40">
						<div className="animate-spin rounded-full h-32 w-32 border-t-4 border-[#FCA410] border-b-4 mx-auto mb-4"></div>
						<p className="text-3xl lilita-font font-bold text-[#FCA410]">
							{isTeamInviteFlow && sessionStatus === "loading"
								? "Checking Authentication..."
								: "Loading Events..."}
						</p>
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
							className="outline-none w-full text-left h-full"
						>
							<Card image={event.imgSrc}>
								<div className="comic-font flex flex-col items-center justify-center text-center space-y-2 h-full">
									<div className="text-sm md:text-base text-black dark:text-white font-medium opacity-80">
										{event.category}
									</div>
									<div className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white leading-tight">
										{event.name}
									</div>
									<div className="text-sm md:text-base text-black dark:text-white opacity-70">
										{new Date(event.fromDate).toLocaleDateString("en-US", {
											year: "numeric",
											month: "short",
											day: "numeric",
										})}
									</div>
								</div>
							</Card>
						</button>
					))
				)}
				{selectedYearData.year === "2021-22" && <SantaClaus />}
			</div>
			<Drawer.Root
				open={drawerOpen && !!selectedEvent}
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
									: "bottom-0 left-0 w-full h-[80vh] rounded-t-3xl border-t border-purple-200 dark:border-indigo-800"
							}
							bg-[radial-gradient(at_top_right,_#FBCFF4,_#E4CCF8,_#C4E2F7,_#FEF9FF)] dark:bg-[radial-gradient(at_top_right,_#7F439D,_#33107C,_#060329)]
							shadow-2xl z-50 flex flex-col transition-transform overflow-hidden
						`}
						style={{ maxHeight: "100vh" }}
					>
						<Drawer.Title asChild>
							<VisuallyHidden>{selectedEvent?.name}</VisuallyHidden>
						</Drawer.Title>
						<div
							className={`flex flex-col gap-6 px-4 pb-8 overflow-y-auto flex-1 ${
								drawerDirection === "bottom" ? "pt-2" : "pt-8"
							}`}
						>
							<h2 className="lilita-font text-3xl md:text-4xl font-bold text-purple-900 dark:text-purple-100 break-words text-center">
								{selectedEvent?.name}
							</h2>
							{selectedEvent?.imgSrc && (
								<div className="flex justify-center relative">
									{/** biome-ignore lint/performance/noImgElement: <testing> */}
									<img
										ref={imageRef}
										src={selectedEvent.imgSrc}
										alt={selectedEvent.name}
										className="rounded-xl w-full max-w-md object-contain border border-purple-100 dark:border-indigo-800 shadow"
									/>
								</div>
							)}
							<div className="text-black dark:text-white">
								<HTMLContent
									content={selectedEvent?.description || ""}
									className=""
								/>
							</div>

							{/* Organisers Section */}
							{selectedEvent?.Organiser &&
								selectedEvent.Organiser.length > 0 && (
									<div className="w-full">
										<h3 className="font-semibold text-base text-purple-900 dark:text-purple-100 mb-2">
											Event Organisers
										</h3>
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
											{selectedEvent.Organiser.map((organiser, index) => (
												<div
													key={organiser.email || `organiser-${index}`}
													className="bg-white/50 dark:bg-indigo-950/50 rounded-lg p-3 border border-purple-200/50 dark:border-indigo-700/50 min-w-0 flex flex-col"
													style={{ minWidth: 0 }}
												>
													<div className="flex flex-col space-y-1 min-w-0">
														<h4 className="font-medium text-purple-900 dark:text-purple-100 text-sm truncate">
															{organiser.name}
														</h4>
														<div className="flex flex-col space-y-0.5 min-w-0">
															<div className="flex items-center gap-2 min-w-0">
																<MailIcon className="w-4 h-4 text-purple-600 dark:text-purple-300" />
																<a
																	href={`mailto:${organiser.email}`}
																	className="text-xs text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-100 transition-colors "
																	title={organiser.email}
																	style={{ minWidth: 0, maxWidth: "100%" }}
																>
																	{organiser.email}
																</a>
															</div>
															<div className="flex items-center gap-2 min-w-0">
																<PhoneIcon className="w-4 h-4 text-purple-600 dark:text-purple-300" />
																<a
																	href={`tel:${organiser.phone}`}
																	className="text-xs text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-100 transition-colors "
																	style={{ minWidth: 0, maxWidth: "100%" }}
																>
																	{organiser.phone}
																</a>
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								)}

							<div className="w-full mt-2">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 text-base md:text-lg justify-center items-center">
									{[
										{
											label: "Venue",
											value: selectedEvent?.venue || "TBA",
										},
										{
											label: "Format",
											value: selectedEvent?.eventType,
										},
										{
											label: "Team Size",
											value: teamSize,
										},
										{
											label: "Entry Fee",
											value: selectedEvent?.isMembersOnly ? (
												selectedEvent?.flcAmount === 0 ? (
													"Free"
												) : (
													`Member: ${selectedEvent?.flcAmount}rs`
												)
											) : selectedEvent?.flcAmount === 0 &&
												selectedEvent?.nonFlcAmount === 0 ? (
												"Free"
											) : (
												<div className="flex flex-col text-center">
													Member: {selectedEvent?.flcAmount}rs
													<br />
													Non Member: {selectedEvent?.nonFlcAmount}rs
												</div>
											),
										},
										{
											label:
												selectedEvent?.fromDate &&
												selectedEvent?.toDate &&
												new Date(selectedEvent.fromDate).toDateString() ===
													new Date(selectedEvent.toDate).toDateString()
													? "Date"
													: "From - To",
											value: (
												<>
													{selectedEvent?.fromDate &&
													selectedEvent?.toDate &&
													new Date(selectedEvent.fromDate).toDateString() ===
														new Date(selectedEvent.toDate).toDateString() ? (
														<>
															{new Date(
																selectedEvent.fromDate,
															).toLocaleDateString("en-US", {
																year: "numeric",
																month: "short",
																day: "numeric",
															})}
															{" at "}
															{new Date(
																selectedEvent.fromDate,
															).toLocaleTimeString("en-US", {
																hour: "2-digit",
																minute: "2-digit",
															})}
														</>
													) : selectedEvent?.fromDate &&
														!selectedEvent?.toDate ? (
														new Date(selectedEvent.fromDate).toLocaleDateString(
															"en-US",
															{
																year: "numeric",
																month: "short",
																day: "numeric",
															},
														)
													) : (
														<>
															{new Date(
																selectedEvent?.fromDate ?? "",
															).toLocaleDateString("en-US", {
																year: "numeric",
																month: "short",
																day: "numeric",
															})}
															{" - "}
															{new Date(
																selectedEvent?.toDate ?? "",
															).toLocaleDateString("en-US", {
																year: "numeric",
																month: "short",
																day: "numeric",
															})}
														</>
													)}
												</>
											),
										},
										{
											label: "Registration Deadline",
											value: (
												<>
													{new Date(
														selectedEvent?.deadline ?? "",
													).toLocaleDateString("en-US", {
														year: "numeric",
														month: "short",
														day: "numeric",
													})}{" "}
													at{" "}
													{new Date(
														selectedEvent?.deadline ?? "",
													).toLocaleTimeString("en-US", {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</>
											),
										},
									].map((item) => (
										<div
											key={item.label}
											className="rounded-xl p-2 flex flex-col items-center justify-center w-full h-full bg-white dark:bg-gradient-to-r dark:from-purple-600 dark:to-indigo-600"
										>
											<span className="font-bold text-purple-900 dark:text-purple-100 truncate">
												{item.label}
											</span>
											<span className="font-normal text-purple-900 dark:text-purple-100 truncate flex">
												{item.value}
											</span>
										</div>
									))}
								</div>
							</div>
							<div className="flex flex-col gap-4 mt-6">
								{loading.checkingRegistration ? (
									<button
										type="button"
										disabled
										className={BUTTON_CLASSES.primary}
									>
										Checking registration...
									</button>
								) : (selectedEvent?.toDate &&
										new Date(selectedEvent.toDate) < new Date()) ||
									selectedEvent?.state === "COMPLETED" ? (
									<div className="w-full rounded-xl border border-gray-400 bg-gray-100 dark:bg-gray-900 dark:border-gray-700 p-4 text-center">
										<span className="text-gray-800 dark:text-gray-300 font-semibold text-lg md:text-xl">
											Event has been completed
										</span>
									</div>
								) : selectedEvent &&
									selectedEvent?.state === "LIVE" &&
									new Date(selectedEvent.deadline) < new Date() ? (
									<>
										<div className="w-full rounded-xl border border-green-500 bg-green-100 dark:bg-green-950 dark:border-green-400 p-4 text-center">
											<span className="text-green-800 dark:text-green-300 font-semibold text-lg md:text-xl">
												Event is Live
											</span>
										</div>
										{selectedEvent?.eventType === "SOLO" &&
											teamInitialized &&
											registered &&
											teamState.isConfirmed &&
											teamState.createdTeamId && (
												<>
													<div className="bg-white/50 dark:bg-indigo-900/30 rounded-xl p-4 border border-purple-200 dark:border-indigo-700">
														<div className="flex flex-col sm:flex-row items-start gap-4 w-full">
															<div className="flex flex-col gap-2 flex-1 min-w-0">
																<div className="flex flex-col sm:flex-row sm:items-center gap-2">
																	<span className="font-semibold text-purple-800 dark:text-purple-200 text-base md:text-lg whitespace-nowrap">
																		Team ID:
																	</span>
																	<div className="flex items-center gap-2 min-w-0 flex-1">
																		<span
																			className="px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-indigo-800 text-purple-700 dark:text-purple-200 text-base md:text-lg font-mono shadow-sm truncate flex-1"
																			title={teamState.createdTeamId}
																		>
																			{teamState.createdTeamId}
																		</span>
																		<button
																			type="button"
																			onClick={() => {
																				navigator.clipboard.writeText(
																					teamState.createdTeamId,
																				);
																				toast.success("Copied Team ID");
																			}}
																			className={`${BUTTON_CLASSES.secondary} px-3 py-1.5 text-xs whitespace-nowrap rounded-lg border border-purple-300 dark:border-indigo-700 hover:bg-purple-200 dark:hover:bg-indigo-800 transition flex-shrink-0`}
																			title="Copy Team ID"
																		>
																			Copy
																		</button>
																	</div>
																</div>
															</div>
															<div className="flex-shrink-0 flex justify-center sm:justify-end">
																<button
																	type="button"
																	className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-purple-100 dark:bg-zinc-400 rounded-xl border border-purple-300 dark:border-indigo-700 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
																	onClick={() => setShowQrModal(true)}
																	onKeyDown={(e) => {
																		if (e.key === "Enter" || e.key === " ") {
																			setShowQrModal(true);
																		}
																	}}
																	aria-label="Show QR Code"
																	tabIndex={0}
																>
																	<QRCodeSVG
																		value={teamState.createdTeamId}
																		size={80}
																		bgColor="#F3E8FF"
																		fgColor="#59168b"
																		className="w-16 h-16 md:w-20 md:h-20 object-contain"
																	/>
																</button>
															</div>
														</div>
													</div>
													{showQrModal && (
														<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
															<div className="relative bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
																<button
																	type="button"
																	onClick={() => setShowQrModal(false)}
																	className="absolute top-2 right-2 text-black hover:text-gray-600"
																	aria-label="Close"
																>
																	<X className="h-6 w-6" />
																</button>
																<QRCodeSVG
																	value={teamState.createdTeamId}
																	size={256}
																	bgColor="#FFFFFF"
																	fgColor="#000000"
																	className="w-64 h-64 object-contain p-3 mx-auto"
																/>
																<div className="mt-4 text-center text-black break-all font-mono">
																	{teamState.createdTeamId}
																</div>
															</div>
														</div>
													)}
												</>
											)}
										{selectedEvent?.eventType === "TEAM" &&
											renderTeamRegistration()}
									</>
								) : registered &&
									selectedEvent?.deadline &&
									new Date(selectedEvent.deadline) < new Date() &&
									!teamState.isConfirmed ? (
									<div className="w-full rounded-xl border border-yellow-400 bg-yellow-100 dark:bg-yellow-950 dark:border-yellow-500 p-4 text-center">
										<span className="text-yellow-900 dark:text-yellow-200 font-semibold text-lg md:text-xl">
											Registration was successful but not confirmed!
										</span>
									</div>
								) : selectedEvent?.deadline &&
									!registered &&
									!teamState.isConfirmed &&
									new Date(selectedEvent.deadline) < new Date() ? (
									<>
										<div className="w-full rounded-xl border border-red-500 bg-red-100 dark:bg-red-950 dark:border-red-400 p-4 text-center">
											<span className="text-red-800 dark:text-red-300 font-semibold text-lg md:text-xl">
												Registrations are Closed
											</span>
										</div>
										{selectedEvent?.eventType === "SOLO" &&
											teamInitialized &&
											registered &&
											teamState.isConfirmed &&
											teamState.createdTeamId && (
												<>
													<div className="flex flex-row items-left">
														<button
															type="button"
															className="flex-shrink-0 flex items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-purple-100 dark:bg-zinc-400 rounded-xl border border-purple-300 dark:border-indigo-700 cursor-pointer"
															onClick={() => setShowQrModal(true)}
															onKeyDown={(e) => {
																if (e.key === "Enter" || e.key === " ") {
																	setShowQrModal(true);
																}
															}}
															aria-label="Show QR Code"
															tabIndex={0}
														>
															<QRCodeSVG
																value={teamState.createdTeamId}
																size={112}
																bgColor="#F3E8FF"
																fgColor="#59168b"
																className="w-20 h-20 md:w-28 md:h-28 object-contain"
															/>
														</button>
														<div className="flex flex-col ml-4">
															<div className="text-lg md:text-xl font-semibold text-purple-800 dark:text-purple-200">
																Team ID:
															</div>
															<div className="px-2 py-1 rounded-lg text-purple-900 dark:text-purple-100 text-lg md:text-xl break-all font-mono">
																{teamState.createdTeamId}
															</div>
															<button
																type="button"
																onClick={() => {
																	navigator.clipboard.writeText(
																		teamState.createdTeamId,
																	);
																	toast.success("Copied Team ID");
																}}
																className={`${BUTTON_CLASSES.secondary} px-2 py-1 w-20 text-xs rounded-lg border border-purple-300 dark:border-indigo-700 hover:bg-purple-200 dark:hover:bg-indigo-800 transition`}
																title="Copy Team ID"
															>
																Copy
															</button>
														</div>
													</div>
													{showQrModal && (
														<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
															<div className="relative bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
																<button
																	type="button"
																	onClick={() => setShowQrModal(false)}
																	className="absolute top-2 right-2 text-black hover:text-gray-600"
																	aria-label="Close"
																>
																	<X className="h-6 w-6" />
																</button>
																<QRCodeSVG
																	value={teamState.createdTeamId}
																	size={256}
																	bgColor="#FFFFFF"
																	fgColor="#000000"
																	className="w-64 h-64 object-contain p-3 mx-auto"
																/>
																<div className="mt-4 text-center text-black break-all font-mono">
																	{teamState.createdTeamId}
																</div>
															</div>
														</div>
													)}
												</>
											)}
										{selectedEvent?.eventType === "TEAM" &&
											renderTeamRegistration()}
									</>
								) : available === false ? (
									registered && teamState.isConfirmed ? (
										<>
											{selectedEvent?.eventType === "SOLO" &&
												teamInitialized && (
													<>
														{teamState.isConfirmed &&
															teamState.createdTeamId && (
																<div className="w-full rounded-xl border border-green-500 bg-green-100 dark:bg-green-950 dark:border-green-400 p-4 text-center">
																	<span className="text-green-800 dark:text-green-300 font-semibold text-lg md:text-xl">
																		🎉 Registration confirmed! You're all set
																		for the event.
																	</span>
																</div>
															)}
														{registered &&
															teamState.isConfirmed &&
															teamState.createdTeamId && (
																<>
																	<div className="flex flex-row items-left">
																		<button
																			type="button"
																			className="flex-shrink-0 flex items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-purple-100 dark:bg-zinc-400 rounded-xl border border-purple-300 dark:border-indigo-700 cursor-pointer"
																			onClick={() => setShowQrModal(true)}
																			onKeyDown={(e) => {
																				if (
																					e.key === "Enter" ||
																					e.key === " "
																				) {
																					setShowQrModal(true);
																				}
																			}}
																			aria-label="Show QR Code"
																			tabIndex={0}
																		>
																			<QRCodeSVG
																				value={teamState.createdTeamId}
																				size={112}
																				bgColor="#F3E8FF"
																				fgColor="#59168b"
																				className="w-20 h-20 md:w-28 md:h-28 object-contain"
																			/>
																		</button>
																		<div className="flex flex-col ml-4">
																			<div className="text-lg md:text-xl font-semibold text-purple-800 dark:text-purple-200">
																				Team ID:
																			</div>
																			<div className="px-2 py-1 rounded-lg text-purple-900 dark:text-purple-100 text-lg md:text-xl break-all font-mono">
																				{teamState.createdTeamId}
																			</div>
																			<button
																				type="button"
																				onClick={() => {
																					navigator.clipboard.writeText(
																						teamState.createdTeamId,
																					);
																					toast.success("Copied Team ID");
																				}}
																				className={`${BUTTON_CLASSES.secondary} px-2 py-1 w-20 text-xs rounded-lg border border-purple-300 dark:border-indigo-700 hover:bg-purple-200 dark:hover:bg-indigo-800 transition`}
																				title="Copy Team ID"
																			>
																				Copy
																			</button>
																		</div>
																	</div>
																	{showQrModal && (
																		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
																			<div className="relative bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
																				<button
																					type="button"
																					onClick={() => setShowQrModal(false)}
																					className="absolute top-2 right-2 text-black hover:text-gray-600"
																					aria-label="Close"
																				>
																					<X className="h-6 w-6" />
																				</button>
																				<QRCodeSVG
																					value={teamState.createdTeamId}
																					size={256}
																					bgColor="#FFFFFF"
																					fgColor="#000000"
																					className="w-64 h-64 object-contain p-3 mx-auto"
																				/>
																				<div className="mt-4 text-center text-black break-all font-mono">
																					{teamState.createdTeamId}
																				</div>
																			</div>
																		</div>
																	)}
																</>
															)}
														{/* <button
															type="button"
															onClick={() => setSoloConfirm(true)}
															disabled={
																teamState.registering ||
																loading.checkingRegistration ||
																registered ||
																loading.register
															}
															className={
																registered
																	? BUTTON_CLASSES.disabled
																	: BUTTON_CLASSES.primary
															}
														>
															{loading.checkingRegistration
																? "Checking..."
																: teamState.registering || loading.register
																	? "Processing..."
																	: registered
																		? "Registered"
																		: selectedEvent.flcAmount > 0 ||
																				selectedEvent.nonFlcAmount > 0
																			? "Pay to Register"
																			: "Register"}
														</button> */}
													</>
												)}
											{selectedEvent?.eventType === "TEAM" &&
												renderTeamRegistration()}
										</>
									) : (
										<div className="w-full rounded-xl border border-yellow-400 bg-yellow-100 dark:bg-yellow-950 dark:border-yellow-500 p-4 text-center">
											<span className="text-yellow-900 dark:text-yellow-200 font-semibold text-lg md:text-xl">
												Registrations are Full
											</span>
										</div>
									)
								) : available === true ? (
									<>
										{selectedEvent?.eventType === "SOLO" && teamInitialized && (
											<>
												{teamState.isConfirmed && teamState.createdTeamId && (
													<div className="w-full rounded-xl border border-green-500 bg-green-100 dark:bg-green-950 dark:border-green-400 p-4 text-center">
														<span className="text-green-800 dark:text-green-300 font-semibold text-lg md:text-xl">
															🎉 Registration confirmed! You're all set for the
															event.
														</span>
													</div>
												)}
												{registered &&
													teamState.createdTeamId &&
													teamState.isConfirmed && (
														<>
															<div className="bg-white/50 dark:bg-indigo-900/30 rounded-xl p-4 border border-purple-200 dark:border-indigo-700">
																<div className="flex flex-col sm:flex-row items-start gap-4 w-full">
																	<div className="flex flex-col gap-2 flex-1 min-w-0">
																		<div className="flex flex-col sm:flex-row sm:items-center gap-2">
																			<span className="font-semibold text-purple-800 dark:text-purple-200 text-base md:text-lg whitespace-nowrap">
																				Team ID:
																			</span>
																			<div className="flex items-center gap-2 min-w-0 flex-1">
																				<span
																					className="px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-indigo-800 text-purple-700 dark:text-purple-200 text-base md:text-lg font-mono shadow-sm truncate flex-1"
																					title={teamState.createdTeamId}
																				>
																					{teamState.createdTeamId}
																				</span>
																				<button
																					type="button"
																					onClick={() => {
																						navigator.clipboard.writeText(
																							teamState.createdTeamId,
																						);
																						toast.success("Copied Team ID");
																					}}
																					className={`${BUTTON_CLASSES.secondary} px-3 py-1.5 text-xs whitespace-nowrap rounded-lg border border-purple-300 dark:border-indigo-700 hover:bg-purple-200 dark:hover:bg-indigo-800 transition flex-shrink-0`}
																					title="Copy Team ID"
																				>
																					Copy
																				</button>
																			</div>
																		</div>
																	</div>
																	<div className="flex-shrink-0 flex justify-center sm:justify-end">
																		<button
																			type="button"
																			className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-purple-100 dark:bg-zinc-400 rounded-xl border border-purple-300 dark:border-indigo-700 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
																			onClick={() => setShowQrModal(true)}
																			onKeyDown={(e) => {
																				if (
																					e.key === "Enter" ||
																					e.key === " "
																				) {
																					setShowQrModal(true);
																				}
																			}}
																			aria-label="Show QR Code"
																			tabIndex={0}
																		>
																			<QRCodeSVG
																				value={teamState.createdTeamId}
																				size={80}
																				bgColor="#F3E8FF"
																				fgColor="#59168b"
																				className="w-16 h-16 md:w-20 md:h-20 object-contain"
																			/>
																		</button>
																	</div>
																</div>
															</div>
															{showQrModal && (
																<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
																	<div className="relative bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
																		<button
																			type="button"
																			onClick={() => setShowQrModal(false)}
																			className="absolute top-2 right-2 text-black hover:text-gray-600"
																			aria-label="Close"
																		>
																			<X className="h-6 w-6" />
																		</button>
																		<QRCodeSVG
																			value={teamState.createdTeamId}
																			size={256}
																			bgColor="#FFFFFF"
																			fgColor="#000000"
																			className="w-64 h-64 object-contain p-3 mx-auto"
																		/>
																		<div className="mt-4 text-center text-black break-all font-mono">
																			{teamState.createdTeamId}
																		</div>
																	</div>
																</div>
															)}
														</>
													)}
												{selectedEvent.deadline &&
													new Date(selectedEvent.deadline) > new Date() && (
														<>
															{(selectedEvent.flcAmount > 0 ||
																selectedEvent.nonFlcAmount > 0) &&
															registered &&
															!teamState.isConfirmed ? (
																<div className="w-full rounded-xl border border-yellow-400 bg-yellow-100 dark:bg-yellow-950 dark:border-yellow-500 p-4 text-center">
																	<span className="text-yellow-900 dark:text-yellow-200 font-semibold text-lg md:text-xl">
																		Registration successful! Please pay to
																		confirm your spot.
																	</span>
																</div>
															) : null}
															<button
																type="button"
																onClick={() => setSoloConfirm(true)}
																disabled={
																	teamState.registering ||
																	loading.checkingRegistration ||
																	(selectedEvent.deadline &&
																		new Date(selectedEvent.deadline) <
																			new Date()) ||
																	(registered && teamState.isConfirmed) ||
																	loading.register
																}
																className={
																	registered && teamState.isConfirmed
																		? BUTTON_CLASSES.disabled
																		: BUTTON_CLASSES.primary
																}
															>
																{loading.checkingRegistration
																	? "Checking..."
																	: teamState.registering || loading.register
																		? "Processing..."
																		: registered && teamState.isConfirmed
																			? "Registered"
																			: registered &&
																					!teamState.isConfirmed &&
																					(selectedEvent?.flcAmount > 0 ||
																						selectedEvent?.nonFlcAmount > 0)
																				? "Pay to Confirm"
																				: "Register"}
															</button>
														</>
													)}
											</>
										)}
										{selectedEvent?.eventType === "TEAM" &&
											renderTeamRegistration()}
									</>
								) : null}
								<div className="flex gap-2">
									{selectedEvent && (
										<EventWhatsAppShare
											event={selectedEvent}
											teamState={teamState}
											registered={registered}
											variant="button"
											className="flex-1"
										/>
									)}
									<button
										type="button"
										onClick={handleCopyLink}
										className={`${BUTTON_CLASSES.secondary} ${
											selectedEvent ? "flex-1" : "w-full"
										}`}
									>
										Copy Link
									</button>
								</div>
								{showLeaveDialog && (
									<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
										<div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl max-w-md w-[90%]">
											<h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-4">
												Leave Team
											</h2>
											<p className="text-sm text-zinc-600 dark:text-zinc-300	 mb-6">
												Are you sure you want to leave the team?
											</p>
											<div className="flex justify-center gap-3">
												<button
													type="button"
													className={BUTTON_CLASSES.primary}
													onClick={async () => {
														await leaveTeam();
														setShowLeaveDialog(false);
													}}
												>
													{loading.leaveTeam ? "Leaving Team..." : "Yes, Leave"}
												</button>
												<button
													type="button"
													onClick={() => setShowLeaveDialog(false)}
													className={BUTTON_CLASSES.secondary}
												>
													Cancel
												</button>
											</div>
										</div>
									</div>
								)}
								{showRemoveMemberDialog && toBeDeletedMember && (
									<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
										<div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl max-w-md w-[90%]">
											<h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-4">
												Remove Member from Team
											</h2>
											{toBeDeletedMember && (
												<p className="text-sm text-zinc-600 dark:text-zinc-300	 mb-6">
													Are you sure you want to remove (
													{toBeDeletedMember?.name}) from the team?
												</p>
											)}
											<div className="flex justify-center gap-3">
												<button
													type="button"
													className={BUTTON_CLASSES.primary}
													onClick={async () => {
														await removeMemberFromTeam(toBeDeletedMember?.id);
														setShowRemoveMemberDialog(false);
														setTimeout(() => {
															refreshRegistrationData();
														}, 500);
													}}
												>
													{loading.removeMember
														? "Removing Member..."
														: "Yes, Remove"}
												</button>
												<button
													type="button"
													onClick={() => setShowRemoveMemberDialog(false)}
													className={BUTTON_CLASSES.secondary}
												>
													Cancel
												</button>
											</div>
										</div>
									</div>
								)}
								{showDeleteTeam && (
									<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
										<div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl max-w-md w-[90%]">
											<h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-4">
												Delete Team
											</h2>
											<p className="text-sm text-zinc-600 dark:text-zinc-300	 mb-6">
												Are you sure you want to delete the team? This action
												cannot be undone.
											</p>
											<div className="flex justify-center gap-3">
												<button
													type="button"
													className={BUTTON_CLASSES.destructive}
													onClick={async () => {
														setShowDeleteTeam(false);
														await deleteTeam();
													}}
												>
													{loading.leaveTeam
														? "Leaving Team..."
														: "Yes, Delete"}
												</button>
												<button
													type="button"
													onClick={() => setShowDeleteTeam(false)}
													className={BUTTON_CLASSES.secondary}
												>
													Cancel
												</button>
											</div>
										</div>
									</div>
								)}
								{showTeamDialog && (
									<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
										<div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl max-w-md w-[90%]">
											<div className="flex justify-between items-center mb-4">
												<h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
													Create a Team
												</h2>
												<button
													type="button"
													onClick={() => setShowTeamDialog(false)}
													className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
												>
													<X className="h-5 w-5" />
												</button>
											</div>

											<div className="flex flex-col gap-4">
												<label className="text-sm text-zinc-700 dark:text-zinc-300">
													Team Name
													<input
														type="text"
														value={teamState.teamName}
														onChange={(e) =>
															setTeamState((prev) => ({
																...prev,
																teamName: e.target.value,
															}))
														}
														className="mt-1 w-full p-2 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 text-black dark:text-white"
														placeholder="Enter your team name"
													/>
												</label>
												{selectedEvent?.statusOfBatchRestriction === true && (
													<label className="text-sm text-zinc-700 dark:text-zinc-300">
														Year of Study
														<select
															value={teamState.yearOfStudy}
															onChange={(e) =>
																setTeamState((prev) => ({
																	...prev,
																	yearOfStudy: Number(e.target.value),
																}))
															}
															className="mt-1 w-full p-2 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 text-black dark:text-white"
														>
															<option value="">Select Year of Study</option>
															{selectedEvent.batchRestriction?.map((item) => (
																<option key={item.year} value={item.year}>
																	{item.year}
																</option>
															))}
														</select>
													</label>
												)}
												<button
													type="button"
													onClick={() => {
														if (!userId) {
															toast.error("Login to register");
															return;
														}
														setTeamState((prev) => ({
															...prev,
															action: "CREATE",
														}));
													}}
													className="mt-2 px-4 py-2 rounded-lg bg-purple-700 dark:bg-purple-400 text-white dark:text-black font-medium hover:scale-105 transition"
												>
													Create
												</button>
											</div>
										</div>
									</div>
								)}
								{showSoloConfirm && (
									<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
										<div className="bg-white dark:bg-zinc-900 p-6 md:p-7 rounded-xl shadow-xl max-w-sm w-full">
											<h3 className="text-lg font-semibold mb-4 text-center text-zinc-800 dark:text-zinc-100">
												Confirm Registration
											</h3>
											<p className="text-sm text-center mb-6 text-zinc-600 dark:text-zinc-300">
												Are you sure you want to{" "}
												{selectedEvent &&
												(selectedEvent?.flcAmount > 0 ||
													selectedEvent?.nonFlcAmount)
													? "pay and "
													: ""}{" "}
												register for this event?
											</p>
											<div className="flex justify-center gap-3">
												{selectedEvent && !registered ? (
													<button
														type="button"
														onClick={async () => {
															await handleRegister();
															if (
																!(
																	selectedEvent.flcAmount > 0 ||
																	selectedEvent.nonFlcAmount
																)
															) {
																setSoloConfirm(false);
															}
														}}
														className={BUTTON_CLASSES.primary}
													>
														Yes, Register
													</button>
												) : selectedEvent &&
													registered &&
													selectedEvent.deadline &&
													new Date(selectedEvent.deadline) > new Date() &&
													!teamState.isConfirmed &&
													(selectedEvent.flcAmount > 0 ||
														selectedEvent?.nonFlcAmount) ? (
													<PaymentButton
														paymentType="EVENT"
														className="bg-purple-600  hover:bg-purple-700 text-white dark:text-black font-medium hover:scale-105 transition"
														amountInINR={400}
														description={selectedEvent.name}
														onStart={() => {
															setLoading((prev) => ({
																...prev,
																confirmTeam: true,
															}));
														}}
														onEnd={() => {
															setLoading((prev) => ({
																...prev,
																confirmTeam: false,
															}));
															setSoloConfirm(false);
														}}
														disabled={
															loading.confirmTeam ||
															!userId ||
															(selectedEvent.deadline &&
																new Date(selectedEvent.deadline) <
																	new Date()) ||
															!selectedEvent ||
															teamState.isConfirmed
														}
														teamId={teamState.createdTeamId}
														onSuccess={async (_paymentId) => {
															toast.success("Payment successful");
															setLoading((prev) => ({
																...prev,
																confirmTeam: false,
															}));
															setSoloConfirm(false);
															// Refresh the drawer data to show updated state
															setTimeout(() => refreshRegistrationData(), 500);
														}}
														onFailure={(error) => {
															setLoading((prev) => ({
																...prev,
																confirmTeam: false,
															}));

															toast.error(error || "Payment failed");
															setSoloConfirm(false);
														}}
													>
														{loading.confirmTeam
															? "Confirming..."
															: "Pay to Confirm"}
													</PaymentButton>
												) : null}
												<button
													type="button"
													onClick={() => setSoloConfirm(false)}
													className={BUTTON_CLASSES.secondary}
												>
													Cancel
												</button>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</Drawer.Content>
				</Drawer.Portal>
			</Drawer.Root>
			<GlowingSigil />
		</div>
	);
};

export default EventsPage;
