"use client";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { toast } from "react-toastify";

function VerifyEmailContent() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const [status, setStatus] = useState<
		"verifying" | "form" | "success" | "error"
	>(token ? "verifying" : "form");

	useEffect(() => {
		if (!token) return;

		const verifyToken = async () => {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/verify-email`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ token }),
					},
				);

				if (!res.ok) {
					const error = await res.json();
					console.error("Token verification failed:", error);
					toast.error(error.message || "Token verification failed.");
					setStatus("form");
				} else {
					toast.success("Email verified successfully!");
					setStatus("success");
				}
			} catch (err) {
				console.error(err);
				toast.error("Something went wrong during verification.");
				setStatus("form");
			}
		};

		verifyToken();
	}, [token]);

	return (
		<div className="flex items-center justify-center py-32 px-4 min-h-[calc(100vh-80px-150px)]">
			<div className="w-full max-w-md border border-slate-300 dark:border-white/30 bg-white/20 dark:bg-black/30 rounded-xl p-8 backdrop-blur-md shadow-lg">
				<div className="text-center mb-6">
					<h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
						Email Verification
					</h2>
					<p className="text-slate-600 dark:text-white/60 text-sm mt-1">
						{status === "form"
							? "Enter your email to receive a verification link."
							: status === "verifying"
								? "Verifying your email..."
								: status === "success"
									? "Your email has been successfully verified."
									: ""}
					</p>
				</div>

				{status === "form" && <VerifyEmailForm />}

				{status === "verifying" && (
					<div className="text-center text-xl text-slate-500 dark:text-white/70">
						Verifying your email...
					</div>
				)}

				{status === "success" && (
					<div className="text-center text-xl text-green-600 dark:text-green-400">
						Your email has been verified. You may now log in.
					</div>
				)}
			</div>
		</div>
	);
}

export default function VerifyEmailPage() {
	return (
		<Suspense
			fallback={
				<div className="text-center mt-20 text-xl">Loading Verification...</div>
			}
		>
			<VerifyEmailContent />
		</Suspense>
	);
}
