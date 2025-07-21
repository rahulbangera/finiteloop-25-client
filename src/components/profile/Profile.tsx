"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import PaymentButton from "../razorpay/paymentButton";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { FaInstagram, FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { MdDelete } from "react-icons/md";
import type { AppUser } from "@/lib/auth";
import { useWhatsAppShare, WHATSAPP_SHARE_CONFIG } from "./WhatsAppShare";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

function ProfileDetail({
	label,
	value,
	isViewingOther = false,
	userName = "This user",
}: {
	label: string;
	value: string;
	isViewingOther?: boolean;
	userName?: string;
}) {
	const hasValue = value && value.trim() !== "";

	return (
		<div className="interactive bg-gradient-to-tr from-neutral-800 to-neutral-900 border border-neutral-700 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm hover:border-orange-400 hover:shadow-md transition-all duration-200">
			<div className="text-xs text-gray-400 uppercase font-semibold mb-1 tracking-wide">
				{label}
			</div>
			<div className="text-sm sm:text-base font-medium break-words">
				{hasValue ? (
					<span className="text-white">{value}</span>
				) : (
					<span className="text-gray-500 italic">
						{isViewingOther
							? `${userName} hasn't shared this information`
							: "Not shared"}
					</span>
				)}
			</div>
		</div>
	);
}

function StatItem({ label, value }: { label: string; value: string | number }) {
	return (
		<div className="interactive text-center bg-gradient-to-tr from-neutral-800 to-neutral-900 border border-neutral-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow transition-all duration-300 hover:scale-105 hover:border-orange-500 hover:shadow-lg">
			<div className="text-xs text-gray-400 uppercase font-semibold mb-1 tracking-wide">
				{label}
			</div>
			<div className="text-lg sm:text-xl md:text-2xl font-extrabold bg-gradient-to-tr from-orange-500 to-yellow-400 bg-clip-text text-transparent drop-shadow">
				{value}
			</div>
		</div>
	);
}

type Branch = {
	id: string;
	name: string;
};

function EditProfileDialog({
	open,
	onClose,
	form,
	onChange,
	onSave,
	loading,
	branches,
}: {
	open: boolean;
	onClose: () => void;
	form: {
		name: string;
		usn: string;
		year: string;
		bio: string;
		branch: string;
	};
	onChange: (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => void;
	onSave: () => void;
	loading: boolean;
	branches: Branch[];
}) {
	if (!open) return null;
	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-lg p-2 sm:p-4 pt-16 sm:pt-20">
			<div className="bg-gradient-to-br from-neutral-900/95 via-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-600/50 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-md lg:max-w-lg relative animate-fade-in max-h-[90vh] overflow-y-auto">
				<button
					type="button"
					className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-neutral-700/50 hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-all duration-200 z-10"
					onClick={onClose}
					aria-label="Close"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						className="w-4 h-4 sm:w-5 sm:h-5"
					>
						<title>Close</title>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>

				<div className="text-center mb-4 sm:mb-6 md:mb-8 pr-8 sm:pr-0">
					<h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
						Edit Profile
					</h2>
					<p className="text-sm sm:text-base text-gray-400">
						Update your personal information
					</p>
				</div>

				<div className="space-y-4 sm:space-y-6">
					<div className="grid grid-cols-1 gap-4">
						<div>
							<label
								htmlFor="name"
								className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2"
							>
								<span className="flex items-center gap-2">
									<svg
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										className="sm:w-4 sm:h-4"
									>
										<title>Name</title>
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
										<circle cx="12" cy="7" r="4"></circle>
									</svg>
									Full Name
								</span>
							</label>
							<input
								id="name"
								type="text"
								name="name"
								value={form.name}
								onChange={onChange}
								className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-neutral-800/50 backdrop-blur-sm text-white border border-neutral-600 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all duration-200 placeholder-gray-400 text-sm sm:text-base"
								placeholder="Enter your full name"
								autoComplete="off"
							/>
						</div>
						<div>
							<label
								htmlFor="usn"
								className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2"
							>
								<span className="flex items-center gap-2">
									<svg
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										className="sm:w-4 sm:h-4"
									>
										<title>USN</title>
										<rect
											x="2"
											y="3"
											width="20"
											height="14"
											rx="2"
											ry="2"
										></rect>
										<line x1="8" y1="21" x2="16" y2="21"></line>
										<line x1="12" y1="17" x2="12" y2="21"></line>
									</svg>
									USN
								</span>
							</label>
							<input
								id="usn"
								type="text"
								name="usn"
								value={form.usn}
								onChange={onChange}
								className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-neutral-800/50 backdrop-blur-sm text-white border border-neutral-600 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all duration-200 placeholder-gray-400 text-sm sm:text-base"
								placeholder="Your USN"
								autoComplete="off"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-4">
						<div>
							<label
								htmlFor="branch"
								className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2"
							>
								<span className="flex items-center gap-2">
									<svg
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										className="sm:w-4 sm:h-4"
									>
										<title>Branch</title>
										<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z"></path>
									</svg>
									Branch
								</span>
							</label>
							<select
								id="branch"
								name="branch"
								value={form.branch}
								onChange={onChange}
								className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-neutral-800/50 backdrop-blur-sm text-white border border-neutral-600 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all duration-200 text-sm sm:text-base"
							>
								<option value="">Select Branch</option>
								{branches.map((b) => (
									<option key={b.id} value={b.id} className="bg-neutral-800">
										{b.name}
									</option>
								))}
							</select>
						</div>
						<div>
							<label
								htmlFor="year"
								className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2"
							>
								<span className="flex items-center gap-2">
									<svg
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										className="sm:w-4 sm:h-4"
									>
										<title>Year</title>
										<rect
											x="3"
											y="4"
											width="18"
											height="18"
											rx="2"
											ry="2"
										></rect>
										<line x1="16" y1="2" x2="16" y2="6"></line>
										<line x1="8" y1="2" x2="8" y2="6"></line>
										<line x1="3" y1="10" x2="21" y2="10"></line>
									</svg>
									Graduation Year
								</span>
							</label>
							<input
								id="year"
								type="text"
								name="year"
								value={form.year}
								onChange={onChange}
								className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-neutral-800/50 backdrop-blur-sm text-white border border-neutral-600 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all duration-200 placeholder-gray-400 text-sm sm:text-base"
								placeholder="2025"
								autoComplete="off"
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="bio"
							className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2"
						>
							<span className="flex items-center gap-2">
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									className="sm:w-4 sm:h-4"
								>
									<title>Bio</title>
									<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
									<polyline points="14,2 14,8 20,8"></polyline>
									<line x1="16" y1="13" x2="8" y2="13"></line>
									<line x1="16" y1="17" x2="8" y2="17"></line>
									<polyline points="10,9 9,9 8,9"></polyline>
								</svg>
								Bio
							</span>
						</label>
						<textarea
							id="bio"
							name="bio"
							value={form.bio}
							onChange={onChange}
							className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-neutral-800/50 backdrop-blur-sm text-white border border-neutral-600 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all duration-200 resize-none placeholder-gray-400 text-sm sm:text-base"
							placeholder="Tell us about yourself..."
							rows={3}
						/>
					</div>
				</div>

				<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6 md:mt-8 justify-center">
					<button
						type="button"
						className="interactive flex items-center justify-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] sm:min-w-[120px] text-sm sm:text-base order-2 sm:order-1"
						onClick={onSave}
						disabled={loading}
					>
						{loading ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
								<span className="hidden sm:inline">Saving...</span>
								<span className="sm:hidden">Save...</span>
							</>
						) : (
							<>
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									className="sm:w-4 sm:h-4"
								>
									<title>Save</title>
									<polyline points="20,6 9,17 4,12"></polyline>
								</svg>
								<span className="hidden sm:inline">Save Changes</span>
								<span className="sm:hidden">Save</span>
							</>
						)}
					</button>
					<button
						type="button"
						className="interactive px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 text-sm sm:text-base order-1 sm:order-2"
						onClick={onClose}
						disabled={loading}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}

export default function Profile({ userId }: { userId?: number }) {
	const router = useRouter();
	const { data: session, update } = useSession();
	const [editMode, setEditMode] = useState(false);
	const [form, setForm] = useState({
		name: "",
		usn: "",
		year: "",
		bio: "",
		branch: "",
	});
	const [branches, setBranches] = useState<Branch[]>([]);
	const [loading, setLoading] = useState(false);
	const [viewedUser, setViewedUser] = useState<AppUser | null>(null);

	const [socialName, setSocialName] = useState<string>("");
	const [socialUrl, setSocialUrl] = useState<string>("");
	const [addingSocialLink, setAddingSocialLink] = useState(false);
	const [removingLinkIndex, setRemovingLinkIndex] = useState<number | null>(
		null,
	);
	const [shareLoading, setShareLoading] = useState(false);
	const [showShareOptions, setShowShareOptions] = useState(false);

	// Determine if we're viewing someone else's profile
	const isViewingOtherProfile =
		userId && userId !== parseInt(session?.user?.id || "0", 10);

	const [fetchingUser, setFetchingUser] = useState(isViewingOtherProfile);

	// Get the current user data
	const currentUser = isViewingOtherProfile ? viewedUser : session?.user;

	// WhatsApp sharing functionality
	const { handleWhatsAppShare } = useWhatsAppShare({
		user: currentUser, // Type assertion handled in WhatsAppShare component
		isViewingOtherProfile: !!isViewingOtherProfile,
		userId: session?.user?.id,
		onShareComplete: () => setShowShareOptions(false),
		enabled: WHATSAPP_SHARE_CONFIG.enabled,
	});

	// Share function
	const handleShareProfile = () => {
		setShowShareOptions(!showShareOptions);
	};

	const handleCopyLink = async () => {
		setShareLoading(true);
		try {
			const currentUrl = window.location.origin + window.location.pathname;
			const shareUrl = isViewingOtherProfile
				? currentUrl
				: `${currentUrl}/${session?.user?.id}`;

			await navigator.clipboard.writeText(shareUrl);
			toast.success("Profile link copied to clipboard!");
			setShowShareOptions(false);
		} catch (err) {
			console.error("Failed to copy link:", err);
			toast.error("Failed to copy link");
		} finally {
			setShareLoading(false);
		}
	};

	const getRoleName = (user: AppUser | null | undefined) => {
		if (!user) return "";
		return typeof user.role === "string"
			? user.role
			: (user as unknown as { role: { name: string } }).role?.name;
	};

	const getUserLinks = (user: AppUser | null | undefined) => {
		if (!user) return [];
		return (
			user.userLinks ||
			(user as unknown as { UserLink: { linkName: string; url: string }[] })
				.UserLink ||
			[]
		);
	};

	useEffect(() => {
		const rippleHandler = (e: Event) => {
			const button = e.currentTarget as HTMLElement;
			const rect = button.getBoundingClientRect();
			const size = Math.max(button.offsetWidth, button.offsetHeight);

			let x = 0;
			let y = 0;

			if (e.type === "touchstart" && "touches" in e) {
				const touchEvent = e as TouchEvent;
				x = touchEvent.touches[0]?.clientX - rect.left - size / 2;
				y = touchEvent.touches[0]?.clientY - rect.top - size / 2;
			} else if (e.type === "click" && "clientX" in e) {
				const mouseEvent = e as MouseEvent;
				x = mouseEvent.clientX - rect.left - size / 2;
				y = mouseEvent.clientY - rect.top - size / 2;
			}

			const ripple = document.createElement("span");
			ripple.className = "ripple";
			ripple.style.width = ripple.style.height = `${size}px`;
			ripple.style.left = `${x}px`;
			ripple.style.top = `${y}px`;

			button.appendChild(ripple);
			setTimeout(() => ripple.remove(), 600);
		};

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (!target.closest(".share-dropdown-container")) {
				setShowShareOptions(false);
			}
		};

		document.querySelectorAll(".interactive").forEach((el) => {
			el.addEventListener("click", rippleHandler);
			el.addEventListener("touchstart", rippleHandler);
		});

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.querySelectorAll(".interactive").forEach((el) => {
				el.removeEventListener("click", rippleHandler);
				el.removeEventListener("touchstart", rippleHandler);
			});
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		const fetchBranches = async () => {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/api/branch`,
				);
				const json = await res.json();
				setBranches(json.data);
			} catch {
				toast.error("Failed to load branches");
			}
		};
		fetchBranches();
	}, []);

	useEffect(() => {
		if (session?.user) {
			let branchId = "";
			if (session.user.branch && branches.length > 0) {
				const found = branches.find(
					(b) =>
						b.name.toLowerCase() === session.user.branch.toLowerCase() ||
						b.id === session.user.branch,
				);
				if (found) branchId = found.id;
			}
			setForm({
				name: session.user.name || "",
				usn: session.user.usn || "",
				year: session.user.year || "",
				bio: session.user.bio || "",
				branch: branchId || "",
			});
		}
	}, [session, branches]);

	useEffect(() => {
		const fetchUserData = async () => {
			if (!isViewingOtherProfile || !userId) return;

			setFetchingUser(true);
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/searchbyId`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							userId: userId.toString(),
						}),
					},
				);

				if (!res.ok) throw new Error("User not found");

				const data = await res.json();
				if (data.success && data.id) {
					// Transform the server response to match expected user structure
					setViewedUser({
						...data,
						role: data.role?.name || data.role,
						userLinks: data.UserLink || [],
						branch: data.Branch?.name || "",
						totalActivityPoints: data.totalActivityPoints || 0,
						activityPoints: data.totalActivityPoints || 0,
						attendance: data.attendance || 0,
						image: data.image || null,
					});
				} else {
					toast.error("User not found");
				}
			} catch (error) {
				console.error("Error fetching user:", error);
				toast.error("Failed to load user profile");
			} finally {
				setFetchingUser(false);
			}
		};

		fetchUserData();
	}, [userId, isViewingOtherProfile]);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleEdit = () => setEditMode(true);

	const handleCancel = () => {
		setEditMode(false);
		if (session?.user) {
			setForm({
				name: session.user.name || "",
				usn: session.user.usn || "",
				year: session.user.year || "",
				bio: session.user.bio || "",
				branch: session.user.branch || "",
			});
		}
	};

	const handleSave = async () => {
		if (!form.name.trim()) {
			toast.error("Name is required");
			return;
		}
		if (!form.usn.trim()) {
			toast.error("USN is required");
			return;
		}

		setLoading(true);
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/update-user`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${session?.user?.accessToken}`,
					},
					body: JSON.stringify({
						name: form.name.trim(),
						usn: form.usn.trim(),
						year: form.year.trim(),
						bio: form.bio.trim(),
						branch: form.branch,
					}),
				},
			);
			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || "Failed to update profile");
			}
			await update();

			if (session?.user) {
				const userRes = await fetch(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/searchbyId`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ userId: session.user.id }),
					},
				);
				if (userRes.ok) {
					const data = await userRes.json();
					setForm({
						name: data.name || "",
						usn: data.usn || "",
						year: data.year || "",
						bio: data.bio || "",
						branch: data.branch || data.Branch?.id || "",
					});
				}
			}
			toast.success("Profile updated successfully!");
			setEditMode(false);
		} catch (err) {
			console.error(err);
			toast.error(
				err instanceof Error ? err.message : "Update failed. Please try again.",
			);
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveSocial = async (idx: number) => {
		if (!session?.user?.id || !Array.isArray(session.user.userLinks)) return;
		const link = session.user.userLinks[idx];

		const schema = z.object({
			linkName: z.string().min(1),
		});

		const payload = {
			linkName: link.linkName,
		};

		const result = schema.safeParse(payload);
		if (!result.success) {
			toast.error("Invalid data for removing social link");
			return;
		}

		setRemovingLinkIndex(idx);
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/removeUserLink`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${session?.user?.accessToken}`,
					},
					body: JSON.stringify(payload),
				},
			);
			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || "Failed to remove link");
			}
			await update();
			toast.success("Social link removed successfully!");
		} catch (err) {
			console.error(err);
			toast.error(
				err instanceof Error
					? err.message
					: "Failed to remove social link. Please try again.",
			);
		} finally {
			setRemovingLinkIndex(null);
		}
	};

	if (isViewingOtherProfile && fetchingUser) {
		return (
			<section className="relative z-10 flex items-center justify-center min-h-[300px] sm:min-h-[400px] px-3 sm:px-4 py-4 sm:py-6 md:py-10 max-w-full sm:max-w-4xl lg:max-w-6xl mx-auto mt-16 sm:mt-20">
				<div className="text-white text-center bg-gradient-to-tr from-neutral-900/60 via-neutral-800/40 to-neutral-700/20 border border-neutral-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-2xl animate-fade-in max-w-md">
					<div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-orange-400 border-t-transparent mx-auto mb-4"></div>
					<h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-orange-400">
						Loading Profile
					</h2>
					<p className="text-sm sm:text-base text-gray-400 px-2">
						Please wait while we fetch the profile information...
					</p>
				</div>
			</section>
		);
	}

	if (isViewingOtherProfile && !fetchingUser && !viewedUser) {
		return (
			<section className="relative z-10 flex items-center justify-center min-h-[300px] sm:min-h-[400px] px-3 sm:px-4 py-4 sm:py-6 md:py-10 max-w-full sm:max-w-4xl lg:max-w-6xl mx-auto mt-16 sm:mt-20">
				<div className="text-white text-center bg-gradient-to-tr from-neutral-900/60 via-neutral-800/40 to-neutral-700/20 border border-neutral-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-2xl animate-fade-in max-w-md">
					<div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
					<h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-orange-400">
						User Not Found
					</h2>
					<p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4 px-2">
						The profile you're looking for doesn't exist or may have been
						removed.
					</p>
					<button
						type="button"
						onClick={() => window.history.back()}
						className="px-5 sm:px-6 py-2 bg-gradient-to-tr from-orange-500 to-yellow-400 text-white rounded-full font-semibold hover:scale-105 transition shadow-lg text-sm sm:text-base whitespace-nowrap"
					>
						Go Back
					</button>
				</div>
			</section>
		);
	}

	return (
		<section className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 px-3 sm:px-4 py-4 sm:py-6 md:py-10 max-w-full sm:max-w-4xl lg:max-w-6xl mx-auto mt-16 sm:mt-20 animate-fade-in">
			{/* Profile Viewing Indicator */}
			{isViewingOtherProfile && (
				<div className="col-span-full mb-4">
					<div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
						<div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-white">
							<div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center flex-shrink-0">
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									className="text-blue-400"
								>
									<title>User Profile</title>
									<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
									<circle cx="12" cy="7" r="4"></circle>
								</svg>
							</div>
							<span className="font-medium">
								You are viewing{" "}
								<span className="text-blue-400 font-semibold">
									{currentUser?.name || "someone's"}
								</span>{" "}
								profile
							</span>
						</div>
					</div>
				</div>
			)}

			<div className="card profile-card bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 border border-black dark:border-white rounded-xl sm:rounded-2xl overflow-hidden shadow transition backdrop-blur-sm relative">
				<div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-2">
					{!isViewingOtherProfile && (
						<button
							type="button"
							className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-600/50 hover:border-orange-400/50 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 text-sm backdrop-blur-sm"
							onClick={handleEdit}
						>
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="text-orange-400"
							>
								<title>Edit</title>
								<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
								<path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
							</svg>
							<span className="hidden sm:inline">Edit Profile</span>
							<span className="sm:hidden">Edit</span>
						</button>
					)}
					<div className="relative share-dropdown-container">
						{WHATSAPP_SHARE_CONFIG.enabled ? (
							<>
								<button
									type="button"
									className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-600/50 hover:border-blue-400/50 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 text-sm disabled:opacity-50 backdrop-blur-sm"
									onClick={handleShareProfile}
									disabled={shareLoading}
									title="Share Profile"
								>
									{shareLoading ? (
										<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
									) : (
										<>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												height="20"
												viewBox="0 -960 960 960"
												width="20"
												fill="#5084C1"
											>
												<title>Share</title>
												<path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm480-280q17 0 28.5-11.5T720-760q0-17-11.5-28.5T680-800q-17 0-28.5 11.5T640-760q0 17 11.5 28.5T680-720Zm0 520ZM200-480Zm480-280Z" />
											</svg>
											{isViewingOtherProfile && (
												<>
													<span className="hidden sm:inline">Share</span>
													<svg
														width="12"
														height="12"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														className="ml-1"
													>
														<title>Dropdown Arrow</title>
														<polyline points="6,9 12,15 18,9"></polyline>
													</svg>
												</>
											)}
										</>
									)}
								</button>
								{showShareOptions && (
									<div className="absolute top-full right-0 mt-2 bg-neutral-800 border border-neutral-600 rounded-lg shadow-lg z-50 min-w-[200px]">
										<button
											type="button"
											className="w-full px-4 py-3 text-left text-white hover:bg-neutral-700 transition-colors flex items-center gap-3 text-sm border-b border-neutral-600"
											onClick={async () => {
												setShareLoading(true);
												try {
													await handleWhatsAppShare();
												} catch (error) {
													console.error("WhatsApp share error:", error);
												} finally {
													setShareLoading(false);
												}
											}}
											disabled={shareLoading}
										>
											<div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
												<svg
													width="14"
													height="14"
													viewBox="0 0 24 24"
													fill="currentColor"
													className="text-white"
												>
													<title>WhatsApp</title>
													<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.69" />
												</svg>
											</div>
											<span>Share on WhatsApp</span>
										</button>
										<button
											type="button"
											className="w-full px-4 py-3 text-left text-white hover:bg-neutral-700 transition-colors flex items-center gap-3 text-sm"
											onClick={handleCopyLink}
											disabled={shareLoading}
										>
											<div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
												<svg
													width="14"
													height="14"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													className="text-white"
												>
													<title>Copy</title>
													<rect
														x="9"
														y="9"
														width="13"
														height="13"
														rx="2"
														ry="2"
													></rect>
													<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
												</svg>
											</div>
											<span>Copy Link</span>
										</button>
									</div>
								)}
							</>
						) : (
							<button
								type="button"
								className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-600/50 hover:border-blue-400/50 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 text-sm disabled:opacity-50 backdrop-blur-sm"
								onClick={handleCopyLink}
								disabled={shareLoading}
								title="Share Profile Link"
							>
								{shareLoading ? (
									<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
								) : (
									<>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											height="20"
											viewBox="0 -960 960 960"
											width="20"
											fill="#5084C1"
										>
											<title>Share</title>
											<path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm480-280q17 0 28.5-11.5T720-760q0-17-11.5-28.5T680-800q-17 0-28.5 11.5T640-760q0 17 11.5 28.5T680-720Zm0 520ZM200-480Zm480-280Z" />
										</svg>
										{isViewingOtherProfile && (
											<span className="hidden sm:inline">Share</span>
										)}
									</>
								)}
							</button>
						)}
					</div>
				</div>

				<div className="p-4 sm:p-5 md:p-8 space-y-4 sm:space-y-6 text-black dark:text-white">
					<div className="flex flex-col gap-4 sm:gap-6">
						<div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 pt-8 sm:pt-0">
							<div className="relative flex-shrink-0">
								<div className="relative group">
									<Image
										src={currentUser?.image || "/testing/160x160.svg"}
										alt="Profile"
										width={120}
										height={120}
										className="w-24 h-24 sm:w-28 sm:h-28 md:w-30 md:h-30 rounded-full border-4 border-orange-400 object-cover shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
										priority
									/>
									<div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-400/10 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
								</div>
							</div>

							<div className="flex flex-col items-center sm:items-start flex-1 min-w-0 text-center sm:text-left">
								<h1 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-2 text-white">
									{currentUser?.name}
								</h1>
								<span
									className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border backdrop-blur-sm
										${
											getRoleName(currentUser) === "ADMIN"
												? "bg-red-500/10 border-red-400/30 text-red-300 hover:bg-red-500/20 hover:border-red-400/50"
												: getRoleName(currentUser) === "MEMBER"
													? "bg-emerald-500/10 border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400/50"
													: "bg-slate-500/10 border-slate-400/30 text-slate-300 hover:bg-slate-500/20 hover:border-slate-400/50"
										}`}
									title={`Role: ${getRoleName(currentUser)}`}
								>
									<div
										className={`w-2 h-2 rounded-full ${
											getRoleName(currentUser) === "ADMIN"
												? "bg-red-400"
												: getRoleName(currentUser) === "MEMBER"
													? "bg-emerald-400"
													: "bg-slate-400"
										}`}
									></div>
									<span className="font-semibold text-xs uppercase tracking-wider">
										{getRoleName(currentUser) === "ADMIN"
											? "Admin"
											: getRoleName(currentUser) === "MEMBER"
												? "Member"
												: getRoleName(currentUser)}
									</span>
								</span>
							</div>
						</div>

						{!isViewingOtherProfile && getRoleName(currentUser) === "USER" && (
							<div className="flex justify-center">
								<Button
									onClick={() => router.push("/auth/join-flc")}
									className="w-full px-6 py-4 rounded-2xl text-sm font-bold bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 hover:from-purple-600 hover:via-indigo-700 hover:to-blue-700 text-white border border-purple-400/50 shadow-[0_0_30px_rgba(139,92,246,0.5)] backdrop-blur-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400"
								>
									Register Now
								</Button>
							</div>
						)}
					</div>

					<div className="space-y-3 sm:space-y-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
							<ProfileDetail
								label="USN"
								value={`${currentUser?.usn || ""}`}
								isViewingOther={!!isViewingOtherProfile}
								userName={currentUser?.name || "This user"}
							/>
							<ProfileDetail
								label="Year of Graduation"
								value={`${currentUser?.year || ""}`}
								isViewingOther={!!isViewingOtherProfile}
								userName={currentUser?.name || "This user"}
							/>
						</div>

						<ProfileDetail
							label="Branch"
							value={`${(currentUser as unknown as { Branch: { name: string } })?.Branch?.name || currentUser?.branch || ""}`}
							isViewingOther={!!isViewingOtherProfile}
							userName={currentUser?.name || "This user"}
						/>

						<div className="interactive bg-gradient-to-tr from-neutral-800 to-neutral-900 border border-neutral-700 rounded-lg sm:rounded-xl px-3 sm:px-4 py-4 sm:py-6 shadow-sm hover:border-orange-400 hover:shadow-md transition-all duration-200">
							<div className="text-xs text-gray-400 uppercase font-semibold mb-2 sm:mb-3 tracking-wide">
								Bio
							</div>
							<div className="text-sm sm:text-base font-medium break-words leading-relaxed min-h-[60px] sm:min-h-[80px]">
								{currentUser?.bio?.trim() ? (
									<p className="whitespace-pre-wrap text-white">
										{currentUser.bio}
									</p>
								) : (
									<p className="text-gray-500 italic">
										{isViewingOtherProfile
											? `${currentUser?.name || "This user"} hasn't shared their bio`
											: "No bio shared"}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 border border-black dark:border-white rounded-xl sm:rounded-2xl overflow-hidden shadow transition backdrop-blur-sm">
				<div className="p-4 sm:p-5 md:p-8 space-y-4 sm:space-y-6 text-black dark:text-white">
					<div className="grid grid-cols-2 gap-3 sm:gap-4">
						<StatItem
							label="Activity Points"
							value={`${(currentUser as unknown as { totalActivityPoints: number })?.totalActivityPoints || currentUser?.activityPoints || "0"}`}
						/>
						<StatItem
							label="Attendance"
							value={`${currentUser?.attendance || "0"}%`}
						/>
					</div>

					<div>
						{!isViewingOtherProfile && (
							<div className="interactive bg-gradient-to-tr from-neutral-800 to-neutral-900 border border-neutral-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg hover:border-orange-400/50 transition-all duration-200">
								<h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-300 text-center">
									🔗 Add Social Link
								</h4>
								<div className="space-y-3">
									<div className="flex flex-col gap-3">
										<div className="relative w-full">
											<select
												className="appearance-none px-3 sm:px-4 py-2 pr-8 rounded-lg sm:rounded-full bg-neutral-900 text-white border border-orange-400 focus:border-yellow-400 focus:outline-none transition-colors w-full focus:ring-2 focus:ring-orange-400/50 cursor-pointer text-sm sm:text-base"
												value={socialName}
												onChange={(e) => setSocialName(e.target.value)}
												disabled={addingSocialLink}
											>
												<option value="">Select Platform</option>
												<option value="instagram">Instagram</option>
												<option value="linkedin">LinkedIn</option>
												<option value="github">GitHub</option>
												<option value="portfolio">Portfolio</option>
												<option value="leetcode">LeetCode</option>
											</select>
											<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
												<svg
													width="14"
													height="14"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													className="text-orange-400 sm:w-4 sm:h-4"
												>
													<title>Dropdown Arrow</title>
													<polyline points="6,9 12,15 18,9"></polyline>
												</svg>
											</div>
										</div>
										<input
											type="url"
											className="px-3 sm:px-4 py-2 rounded-lg sm:rounded-full bg-neutral-900 text-white border border-orange-400 focus:border-yellow-400 focus:outline-none flex-1 transition-colors focus:ring-2 focus:ring-orange-400/50 text-sm sm:text-base"
											placeholder="https://example.com/yourprofile"
											value={socialUrl}
											onChange={(e) => setSocialUrl(e.target.value)}
											disabled={addingSocialLink}
										/>
									</div>
									<div className="flex justify-center">
										<button
											type="button"
											className="px-4 sm:px-6 py-2 rounded-lg sm:rounded-full bg-gradient-to-tr from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-lg min-w-[100px] sm:min-w-[120px] text-sm sm:text-base whitespace-nowrap"
											onClick={async () => {
												if (!socialName || !socialUrl || !session?.user?.id)
													return;

												if (
													!socialUrl.startsWith("http://") &&
													!socialUrl.startsWith("https://")
												) {
													toast.error(
														"Please enter a valid URL starting with http:// or https://",
													);
													return;
												}

												const schema = z.object({
													linkName: z.string().min(1),
													url: z.string().url(),
												});

												const payload = {
													linkName: socialName,
													url: socialUrl,
												};

												const result = schema.safeParse(payload);
												if (!result.success) {
													toast.error(
														"Invalid link data. Please check your inputs.",
													);
													return;
												}

												setAddingSocialLink(true);
												try {
													const res = await fetch(
														`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/addUserLink`,
														{
															method: "POST",
															headers: {
																"Content-Type": "application/json",
																Authorization: `Bearer ${session?.user?.accessToken}`,
															},
															body: JSON.stringify(payload),
														},
													);
													if (!res.ok) {
														const errorData = await res.json();
														throw new Error(
															errorData.message || "Failed to add link",
														);
													}
													await update();
													setSocialName("");
													setSocialUrl("");
													toast.success("Social link added successfully!");
												} catch (err) {
													toast.error(
														err instanceof Error
															? err.message
															: "Failed to add social link. Please try again.",
													);
												} finally {
													setAddingSocialLink(false);
												}
											}}
											disabled={!socialName || !socialUrl || addingSocialLink}
											title="Add Social Link"
										>
											{addingSocialLink ? (
												<>
													<div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
													<span>Adding...</span>
												</>
											) : (
												<>
													<span className="text-lg">+</span>
													<span>Add Link</span>
												</>
											)}
										</button>
									</div>
								</div>
							</div>
						)}

						<div className="mt-4 sm:mt-6">
							<h5 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-black dark:text-gray-100 flex items-center gap-2">
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									className="sm:w-5 sm:h-5"
								>
									<title>Social Links</title>
									<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
									<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
								</svg>
								<span className="hidden sm:inline">
									{isViewingOtherProfile ? "Social Links" : "Your Social Links"}
								</span>
								<span className="sm:hidden">Links</span>
							</h5>

							{getUserLinks(currentUser).length > 0 ? (
								<div className="grid grid-cols-1 gap-2 sm:gap-3">
									{getUserLinks(currentUser).map(
										(link: { linkName: string; url: string }, idx: number) => {
											const icons: Record<string, React.JSX.Element> = {
												instagram: (
													<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center shadow-lg">
														<FaInstagram className="text-white text-sm sm:text-lg" />
													</div>
												),
												linkedin: (
													<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
														<FaLinkedin className="text-white text-sm sm:text-lg" />
													</div>
												),
												github: (
													<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr from-gray-800 to-gray-900 flex items-center justify-center shadow-lg">
														<FaGithub className="text-white text-sm sm:text-lg" />
													</div>
												),
												portfolio: (
													<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr from-orange-500 to-yellow-500 flex items-center justify-center shadow-lg">
														<FaGlobe className="text-white text-sm sm:text-lg" />
													</div>
												),
												leetcode: (
													<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
														<SiLeetcode className="text-white text-sm sm:text-lg" />
													</div>
												),
											};

											const platformNames: Record<string, string> = {
												instagram: "Instagram",
												linkedin: "LinkedIn",
												github: "GitHub",
												portfolio: "Portfolio",
												leetcode: "LeetCode",
											};

											return (
												<div
													key={`${link.linkName}-${link.url}`}
													className="flex items-center bg-gradient-to-r from-neutral-800/80 to-neutral-900/80 backdrop-blur-sm border border-neutral-700/50 hover:border-orange-400/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
												>
													<a
														href={link.url}
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 transition-all duration-200"
														title={`Visit ${platformNames[link.linkName] || link.linkName} profile`}
													>
														{icons[link.linkName] || (
															<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr from-gray-600 to-gray-700 flex items-center justify-center shadow-lg flex-shrink-0">
																<FaGlobe className="text-white text-sm sm:text-lg" />
															</div>
														)}
														<div className="flex flex-col min-w-0 flex-1">
															<span className="text-xs sm:text-sm font-semibold text-white capitalize group-hover:text-orange-400 transition-colors truncate">
																{platformNames[link.linkName] || link.linkName}
															</span>
															<span className="text-xs text-gray-400 truncate max-w-[100px] sm:max-w-[120px]">
																{
																	link.url
																		.replace(/^https?:\/\//, "")
																		.split("/")[0]
																}
															</span>
														</div>
														<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 hidden sm:block">
															<svg
																width="14"
																height="14"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth="2"
																className="text-orange-400 sm:w-4 sm:h-4"
															>
																<title>External Link</title>
																<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
																<polyline points="15,3 21,3 21,9"></polyline>
																<line x1="10" y1="14" x2="21" y2="3"></line>
															</svg>
														</div>
													</a>
													{!isViewingOtherProfile && (
														<div className="flex items-center ml-1 sm:ml-2">
															<button
																type="button"
																onClick={() => handleRemoveSocial(idx)}
																className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl transition-all duration-200 hover:bg-red-500/20 disabled:opacity-50 group-hover:scale-110 border border-transparent hover:border-red-500/30"
																title="Remove link"
																disabled={removingLinkIndex === idx}
															>
																{removingLinkIndex === idx ? (
																	<div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-red-400 border-t-transparent"></div>
																) : (
																	<MdDelete className="text-red-400 hover:text-red-300 text-base sm:text-lg transition-colors" />
																)}
															</button>
														</div>
													)}
												</div>
											);
										},
									)}
								</div>
							) : (
								<div className="bg-gradient-to-tr from-neutral-800/50 to-neutral-900/50 border border-neutral-700/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
									<div className="text-3xl sm:text-4xl mb-3 opacity-50">🔗</div>
									<p className="text-sm sm:text-base text-gray-400 mb-1">
										{isViewingOtherProfile
											? `${currentUser?.name || "This user"} hasn't shared their social handles yet`
											: "You haven't added any social links yet"}
									</p>
									<p className="text-xs text-gray-500">
										{isViewingOtherProfile
											? "Check back later to see their social profiles"
											: "Add your social media profiles above to connect with others"}
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="col-span-full text-black dark:text-white bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 border border-black dark:border-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-8 text-center shadow backdrop-blur-sm">
				<h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold bg-gradient-to-tr from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2 sm:mb-3">
					My Events
				</h2>
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
			</div>

			<EditProfileDialog
				open={editMode}
				onClose={handleCancel}
				form={form}
				onChange={handleChange}
				onSave={handleSave}
				loading={loading}
				branches={branches}
			/>
		</section>
	);
}
