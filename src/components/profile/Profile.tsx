"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import PaymentButton from "../razorpay/paymentButton";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { FaInstagram, FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { MdDelete } from "react-icons/md";

function ProfileDetail({ label, value }: { label: string; value: string }) {
	return (
		<div className="interactive bg-gradient-to-tr from-neutral-800 to-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 shadow-sm hover:border-orange-400 transition">
			<div className="text-xs text-gray-400 uppercase font-semibold mb-1 tracking-wide">
				{label}
			</div>
			<div className="text-base font-medium text-white break-words">
				{value}
			</div>
		</div>
	);
}

function StatItem({ label, value }: { label: string; value: string | number }) {
	return (
		<div className="interactive text-center bg-gradient-to-tr from-neutral-800 to-neutral-900 border border-neutral-700 rounded-2xl p-5 shadow transition hover:scale-105 hover:border-orange-500">
			<div className="text-xs text-gray-400 uppercase font-semibold mb-1 tracking-wide">
				{label}
			</div>
			<div className="text-2xl font-extrabold bg-gradient-to-tr from-orange-500 to-yellow-400 bg-clip-text text-transparent drop-shadow">
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
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
			<div className="bg-gradient-to-tr from-neutral-900 to-neutral-800 border border-neutral-700 rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
				<button
					type="button"
					className="absolute top-3 right-3 text-gray-400 hover:text-orange-400 text-2xl transition"
					onClick={onClose}
					aria-label="Close"
				>
					×
				</button>
				<h2 className="text-2xl font-extrabold mb-6 text-white text-center bg-gradient-to-tr from-orange-400 to-yellow-400 bg-clip-text">
					Edit Profile
				</h2>
				<div className="space-y-5">
					<div>
						<label className="text-xs text-gray-400 uppercase font-semibold mb-2 tracking-wide block">
							Name
							<input
								type="text"
								name="name"
								value={form.name}
								onChange={onChange}
								className="w-full px-4 py-2 rounded-xl bg-gradient-to-tr from-neutral-800 to-neutral-900 text-white border-2 border-orange-400 focus:border-yellow-400 focus:outline-none shadow-inner transition"
								placeholder="Name"
								autoComplete="off"
							/>
						</label>
					</div>
					<div>
						<label className="text-xs text-gray-400 uppercase font-semibold mb-2 tracking-wide block">
							USN
							<input
								type="text"
								name="usn"
								value={form.usn}
								onChange={onChange}
								className="w-full px-4 py-2 rounded-xl bg-gradient-to-tr from-neutral-800 to-neutral-900 text-white border-2 border-orange-400 focus:border-yellow-400 focus:outline-none shadow-inner transition"
								placeholder="USN"
								autoComplete="off"
							/>
						</label>
					</div>
					<div>
						<label className="text-xs text-gray-400 uppercase font-semibold mb-2 tracking-wide block">
							Branch
							<select
								name="branch"
								value={form.branch}
								onChange={onChange}
								className="w-full px-4 py-2 rounded-xl bg-gradient-to-tr from-neutral-800 to-neutral-900 text-white border-2 border-orange-400 focus:border-yellow-400 focus:outline-none shadow-inner transition"
							>
								<option value="">Select Branch</option>
								{branches.map((b) => (
									<option key={b.id} value={b.id}>
										{b.name}
									</option>
								))}
							</select>
						</label>
					</div>
					<div>
						<label className="text-xs text-gray-400 uppercase font-semibold mb-2 tracking-wide block">
							Year of Graduation
							<input
								type="text"
								name="year"
								value={form.year}
								onChange={onChange}
								className="w-full px-4 py-2 rounded-xl bg-gradient-to-tr from-neutral-800 to-neutral-900 text-white border-2 border-orange-400 focus:border-yellow-400 focus:outline-none shadow-inner transition"
								placeholder="Year"
								autoComplete="off"
							/>
						</label>
					</div>
					<div>
						<label className="text-xs text-gray-400 uppercase font-semibold mb-2 tracking-wide block">
							Bio
							<textarea
								name="bio"
								value={form.bio}
								onChange={onChange}
								className="w-full px-4 py-2 rounded-xl bg-gradient-to-tr from-neutral-800 to-neutral-900 text-white border-2 border-orange-400 focus:border-yellow-400 focus:outline-none shadow-inner transition resize-none"
								placeholder="Bio"
								rows={3}
							/>
						</label>
					</div>
				</div>
				<div className="flex gap-3 mt-8 justify-center">
					<button
						type="button"
						className="interactive px-6 py-2 rounded-full bg-gradient-to-tr from-green-500 to-lime-400 text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition disabled:opacity-60"
						onClick={onSave}
						disabled={loading}
					>
						{loading ? "Saving..." : "Save"}
					</button>
					<button
						type="button"
						className="interactive px-6 py-2 rounded-full bg-gradient-to-tr from-gray-500 to-gray-700 text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition disabled:opacity-60"
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

export default function Profile() {
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

	const [socialName, setSocialName] = useState<string>("");
	const [socialUrl, setSocialUrl] = useState<string>("");

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

		document.querySelectorAll(".interactive").forEach((el) => {
			el.addEventListener("click", rippleHandler);
			el.addEventListener("touchstart", rippleHandler);
		});

		return () => {
			document.querySelectorAll(".interactive").forEach((el) => {
				el.removeEventListener("click", rippleHandler);
				el.removeEventListener("touchstart", rippleHandler);
			});
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
			setForm({
				name: session.user.name || "",
				usn: session.user.usn || "",
				year: session.user.year || "",
				bio: session.user.bio || "",
				branch: session.user.branch || "",
			});
		}
	}, [session]);

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
		setLoading(true);
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/update-user`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						userId: session?.user.id,
						name: form.name,
						usn: form.usn,
						year: form.year,
						bio: form.bio,
						branch: form.branch,
					}),
				},
			);
			if (!res.ok) throw new Error("Failed to update");
			await update();
			toast.success("Profile updated");
			setEditMode(false);
		} catch (err) {
			console.error(err);
			toast.error("Update failed");
		}
		setLoading(false);
	};

	const handleRemoveSocial = async (idx: number) => {
		if (!session?.user?.id || !Array.isArray(session.user.userLinks)) return;
		const link = session.user.userLinks[idx];

		const schema = z.object({
			userId: z.number().min(1),
			linkName: z.string().min(1),
		});

		const payload = {
			userId: session.user.id,
			linkName: link.linkName,
		};

		const result = schema.safeParse(payload);
		if (!result.success) {
			toast.error("Invalid data for removing social link");
			return;
		}

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/removeUserLink`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				},
			);
			if (!res.ok) throw new Error("Failed to remove link");
			await update();
			toast.success("Social link removed");
		} catch (err) {
			console.error(err);
			toast.error("Failed to remove social link");
		}
	};

	return (
		<section className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 px-2 sm:px-4 py-6 sm:py-10 max-w-full sm:max-w-4xl lg:max-w-6xl mx-auto mt-20">
			{/* Profile Card */}
			<div className="card profile-card bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 border border-black dark:border-white rounded-2xl overflow-hidden shadow transition backdrop-blur-sm">
				<div className="p-5 sm:p-8 space-y-6 text-black dark:text-white">
					<div className="flex flex-col sm:flex-row sm:items-start gap-6">
						<div className="relative flex-shrink-0 mx-auto sm:mx-0">
							{/* biome-ignore lint/performance/noImgElement: <testing> */}
							<img
								src={session?.user.image || "https://placehold.co/160x160"}
								alt="Profile"
								className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-orange-400 object-cover shadow transition-transform hover:scale-105"
							/>
						</div>

						<div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center">
							<div className="flex flex-col text-center sm:text-left">
								<h1 className="text-2xl sm:text-3xl font-extrabold mb-1 break-words">
									{session?.user.name}
								</h1>
								<span
									className={`interactive inline-block w-fit mt-2 px-4 py-1 rounded-full text-sm font-semibold transition
										${
											session?.user.role === "ADMIN"
												? "bg-gradient-to-tr from-red-500 to-pink-400 border border-red-500 text-white hover:bg-red-600 dark:bg-gradient-to-tr dark:from-red-700 dark:to-pink-600"
												: session?.user.role === "MEMBER"
													? "bg-gradient-to-tr from-green-400 to-lime-400 border border-green-400 text-white hover:bg-green-500 dark:bg-gradient-to-tr dark:from-green-700 dark:to-lime-600"
													: "bg-gradient-to-tr from-blue-400 to-cyan-400 border border-blue-400 text-white hover:bg-blue-500 dark:bg-gradient-to-tr dark:from-blue-700 dark:to-cyan-600"
										}`}
									title={`Role: ${session?.user.role}`}
								>
									{session?.user.role === "ADMIN"
										? "🛡️ ADMIN"
										: session?.user.role === "MEMBER"
											? "❤️ MEMBER"
											: `• ${session?.user.role}`}
								</span>
							</div>

							<div className="mt-4 sm:mt-0 flex gap-2">
								{session?.user.role === "USER" && (
									<PaymentButton
										title="Pay Membership"
										paymentType="MEMBERSHIP"
										description="Club Membership"
										onSuccess={async (paymentId) => {
											await update();
											toast.success("Payment successful");
											console.log("Payment ID:", paymentId);
										}}
										onFailure={() => {
											toast.error("Payment failed");
										}}
										type="submit"
									/>
								)}
								<button
									type="button"
									className="interactive px-4 py-2 rounded bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 transition"
									onClick={handleEdit}
								>
									Edit
								</button>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<ProfileDetail label="USN" value={`${session?.user.usn}`} />
						<ProfileDetail label="Branch" value={`${session?.user.branch}`} />
						<ProfileDetail
							label="Year of Graduation"
							value={`${session?.user.year}`}
						/>
						<ProfileDetail label="Bio" value={`${session?.user.bio}`} />
					</div>
				</div>
			</div>

			{/* Stats Card */}
			<div className="bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 border border-black dark:border-white rounded-2xl overflow-hidden shadow transition backdrop-blur-sm">
				<div className="p-5 sm:p-8 space-y-6 text-black dark:text-white">
					<div className="grid grid-cols-2 gap-4">
						<StatItem
							label="Activity Points"
							value={`${session?.user.activityPoints}`}
						/>
						<StatItem
							label="Attendance"
							value={`${session?.user.attendance}%`}
						/>
					</div>
					<div>
						<div className="interactive bg-gradient-to-tr from-neutral-800 to-neutral-900 border text-center border-neutral-700 rounded-3xl p-6 shadow mb-2">
							<h4 className="text-lg font-bold mb-4 text-gray-300">
								Add Social Link
							</h4>
							<div className="flex flex-col sm:flex-row gap-3 items-center">
								<div className="w-full flex flex-col sm:flex-row gap-3 items-center justify-center">
									<div className="flex flex-col sm:flex-row gap-3 w-full">
										<select
											className="px-4 py-2 rounded-full bg-neutral-900 text-white border border-orange-400 focus:border-yellow-400 focus:outline-none transition w-full sm:w-40"
											value={socialName}
											onChange={(e) => setSocialName(e.target.value)}
										>
											<option value="">Select Platform</option>
											<option value="instagram">Instagram</option>
											<option value="linkedin">LinkedIn</option>
											<option value="github">GitHub</option>
											<option value="portfolio">Portfolio</option>
											<option value="leetcode">LeetCode</option>
										</select>
										<input
											type="url"
											className="px-4 py-2 rounded-full bg-neutral-900 text-white border border-orange-400 focus:border-yellow-400 focus:outline-none flex-1 transition w-full"
											placeholder="Enter URL"
											value={socialUrl}
											onChange={(e) => setSocialUrl(e.target.value)}
										/>
										<button
											type="button"
											className="interactive px-4 py-2 rounded-full bg-green-500 text-white font-bold shadow hover:bg-green-600 transition flex items-center justify-center"
											onClick={async () => {
												if (!socialName || !socialUrl || !session?.user?.id)
													return;

												const schema = z.object({
													linkName: z.string().min(1),
													url: z.string().url(),
													userId: z.number().min(1),
												});

												const payload = {
													linkName: socialName,
													url: socialUrl,
													userId: session.user.id,
												};

												const result = schema.safeParse(payload);
												if (!result.success) {
													toast.error("Invalid link data");
													return;
												}

												try {
													const res = await fetch(
														`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/addUserLink`,
														{
															method: "POST",
															headers: { "Content-Type": "application/json" },
															body: JSON.stringify(payload),
														},
													);
													if (!res.ok) throw new Error("Failed to add link");
													await update();
													setSocialName("");
													setSocialUrl("");
													toast.success("Social link added");
												} catch (err) {
													console.error(err);
													toast.error("Failed to add social link");
												}
											}}
											disabled={!socialName || !socialUrl}
											title="Add Social Link"
										>
											<span className="text-xl">+</span>
										</button>
									</div>
								</div>
							</div>

							{Array.isArray(session?.user.userLinks) &&
								session.user.userLinks.length > 0 && (
									<div className="mt-6">
										<h5 className="text-base font-semibold mb-3 text-gray-300">
											Your Social Links:
										</h5>
										<ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
											{session.user.userLinks.map((link, idx) => {
												const icons: Record<string, React.JSX.Element> = {
													instagram: (
														<span className="flex w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-400 items-center justify-center mr-2">
															<FaInstagram className="text-white text-xl" />
														</span>
													),
													linkedin: (
														<span className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center mr-2">
															<FaLinkedin className="text-white text-xl" />
														</span>
													),
													github: (
														<span className=" w-7 h-7 rounded-full bg-neutral-900 flex items-center justify-center mr-2">
															<FaGithub className="text-white text-xl" />
														</span>
													),
													portfolio: (
														<span className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-400 to-yellow-400 flex items-center justify-center mr-2">
															<FaGlobe className="text-white text-xl" />
														</span>
													),
													leetcode: (
														<span className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center mr-2">
															<SiLeetcode className="text-white text-xl" />
														</span>
													),
												};
												return (
													<li
														key={`${link.linkName}-${link.url}`}
														className="flex items-center justify-center border-2 border-flc-yellow rounded-lg p-2"
													>
														<a
															href={link.url}
															target="_blank"
															rel="noopener noreferrer"
															className="block"
															title={link.linkName}
														>
															{icons[link.linkName] || (
																<span className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center mr-2">
																	<FaGlobe className="text-white text-xl" />
																</span>
															)}
														</a>
														<button
															type="button"
															onClick={() => handleRemoveSocial(idx)}
															className="ml-2 text-xl px-2 py-1 transition"
															title="Remove"
														>
															<MdDelete className="text-red-400 hover:text-red-600" />
														</button>
													</li>
												);
											})}
										</ul>
									</div>
								)}
						</div>
					</div>
				</div>
			</div>

			<div className="col-span-full text-black dark:text-white bg-gradient-to-tr from-white/20 via-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-800/20 border border-black dark:border-white rounded-2xl p-5 sm:p-8 text-center shadow backdrop-blur-sm">
				<h2 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-tr from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2 sm:mb-3">
					My Events
				</h2>
				<p className="text-base sm:text-lg font-medium mb-1 sm:mb-2">
					You're missing out!
				</p>
				<p className="text-gray-500 dark:text-gray-300 mb-2 sm:mb-4">
					Register for events to get started and make the most of your
					experience!
				</p>
				<Link href="/events" className="inline-block mt-2 sm:mt-4">
					<button
						type="button"
						className="interactive mt-2 sm:mt-4 px-6 sm:px-8 py-2 sm:py-3 font-semibold bg-gradient-to-tr from-orange-500 to-yellow-400 rounded-full shadow transition hover:scale-105 hover:shadow-lg text-white text-base sm:text-lg"
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
