"use client";
import Link from "next/link";
import { useEffect } from "react";

const mockProfile = {
	name: "Nandan R Pai",
	usn: "nnm22am033",
	branch: "Artificial Intelligence and Machine Learning",
	graduation: "2026 - AIML",
	bio: "Blah Blah Blah",
	activityPoints: 0,
	attendance: "0%",
};

function ProfileDetail({ label, value }: { label: string; value: string }) {
	return (
		<div className="interactive bg-[#262626] border border-[#333] rounded-xl px-4 py-3 hover:border-[#555] transition">
			<div className="text-xs text-gray-400 uppercase font-semibold mb-1">
				{label}
			</div>
			<div className="text-base font-medium text-white">{value}</div>
		</div>
	);
}

function StatItem({ label, value }: { label: string; value: string | number }) {
	return (
		<div className="interactive text-center bg-[#262626] border border-[#333] rounded-2xl p-5 transition hover:scale-105 hover:border-orange-500">
			<div className="text-xs text-gray-400 uppercase font-semibold mb-1">
				{label}
			</div>
			<div className="text-2xl font-bold bg-gradient-to-tr from-orange-500 to-yellow-400 bg-clip-text text-transparent">
				{value}
			</div>
		</div>
	);
}
import { useSession } from "next-auth/react";
import PaymentButton from "../razorpay/paymentButton";

export default function Profile() {
	useEffect(() => {
		// biome-ignore lint/suspicious/noExplicitAny: testing
		const rippleHandler = (e: any) => {
			const button = e.currentTarget;
			const rect = button.getBoundingClientRect();
			const size = Math.max(button.offsetWidth, button.offsetHeight);
			const x = (e.clientX || e.touches[0]?.clientX) - rect.left - size / 2;
			const y = (e.clientY || e.touches[0]?.clientY) - rect.top - size / 2;

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

	return (
		<section className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 py-10 max-w-6xl mx-auto mt-20">
			<PaymentButton
				className="flex cursor-pointer"
				paymentType="MEMBERSHIP"
				description="Club Membership"
				onSuccess={async (paymentId) => {
					// toast.success("Payment successful");
					alert("Payment successful");
					console.log("Payment ID:", paymentId);
				}}
				onFailure={() => {
					alert("Payment failed");
					// toast.error("Payment failed")
				}}
				type="submit"
			/>
			{/* Profile Card */}
			<div className="card profile-card bg-white/35 dark:bg-white/20 border border-black dark:border-white rounded-3xl overflow-hidden transition">
				<div className="p-6 space-y-6 text-black dark:text-white">
					<div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
						<div className="relative">
							{/** biome-ignore lint/performance/noImgElement: testing */}
							<img
								src="https://placehold.co/100x100"
								alt="Profile"
								className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-black dark:border-white object-cover transition-transform hover:scale-110"
							/>
						</div>
						<div className="text-center sm:text-left">
							<h1 className="text-2xl sm:text-3xl font-bold">
								{mockProfile.name}
							</h1>
							<div className="interactive inline-block mt-2 px-4 py-1 bg-[#1a4d3a] border border-green-500 text-green-400 rounded-full text-sm font-medium hover:bg-green-500 hover:text-black">
								● Member
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<ProfileDetail label="USN" value={mockProfile.usn} />
						<ProfileDetail label="Branch" value={mockProfile.branch} />
						<ProfileDetail
							label="Year of Graduation & Branch"
							value={mockProfile.graduation}
						/>
						<ProfileDetail label="Bio" value={mockProfile.bio} />
					</div>
				</div>
			</div>

			{/* Stats Card */}
			<div className="card stats-card bg-white/35 dark:bg-white/20 border border-black dark:border-white rounded-3xl overflow-hidden transition">
				<div className="p-6 space-y-6 text-black dark:text-white">
					<div className="grid grid-cols-2 gap-4">
						<StatItem
							label="Activity Points"
							value={mockProfile.activityPoints}
						/>
						<StatItem label="Attendance" value={mockProfile.attendance} />
					</div>
					<div>
						<h3 className="text-xl font-semibold text-center bg-gradient-to-tr from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-4">
							Certificates
						</h3>
						<div className="interactive text-center p-6 bg-[#262626] border-2 border-dashed border-[#444] rounded-2xl transition hover:scale-[1.02]">
							<div className="text-4xl mb-2">🚀</div>
							<p className="text-gray-300 font-medium">
								Jump into upcoming events
							</p>
							<p className="text-sm text-gray-400">
								Your path to earning certificates starts there!
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Events Section */}
			<div className="card events-section col-span-full text-black dark:text-white bg-white/35 dark:bg-white/20 border border-black dark:border-white rounded-3xl p-6 text-center">
				<h2 className="text-3xl font-bold bg-gradient-to-tr from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
					My Events
				</h2>
				<p>You're missing out!</p>
				<p>
					Register for events to get started and make the most of your
					experience!
				</p>
				<Link href="/events" className="inline-block mt-4">
					<button
						type="button"
						className="interactive mt-4 px-6 py-3 font-semibold bg-gradient-to-tr from-orange-500 to-yellow-400 rounded-full transition hover:scale-105"
					>
						Browse Events
					</button>
				</Link>
			</div>
		</section>
	);
}
