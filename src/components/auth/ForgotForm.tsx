"use client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const sendPasswordResetZ = z.object({
	email: z.string().email("Please enter a valid email address"),
});

export default function Forgot() {
	const [successMessage, setSuccessMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [email, setEmail] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof sendPasswordResetZ>>({
		resolver: zodResolver(sendPasswordResetZ),
		mode: "onChange",
	});

	const onSubmit = async () => {
		setIsSubmitting(true);
		setSuccessMessage("");

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/send-password-reset-email`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			},
		);

		if (!response.ok) {
			const errorData = await response.json();
			setSuccessMessage(errorData.message || "Failed to send reset link");
			setIsSubmitting(false);
			return;
		} else {
			setSuccessMessage(`Reset link sent to ${email}`);
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex items-center justify-center py-32 px-4 min-h-[calc(100vh-80px-250px)] md:min-h-[calc(100vh-80px-150px)]">
			<div className="w-full max-w-sm mx-auto mt-10">
				<div className="border-2 border-white/30 rounded-3xl p-8 backdrop-blur-sm bg-white/20 dark:bg-black/30">
					<div className="flex flex-col items-center">
						<div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-6">
							<Image
								src="/auth-light.webp"
								alt="Astronaut"
								fill
								className="object-contain opacity-80 dark:hidden"
								priority
							/>
							<Image
								src="/auth-dark.webp"
								alt="Astronaut"
								fill
								className="object-contain opacity-80 hidden dark:block"
								priority
							/>
						</div>

						<div className="w-full text-center mb-6">
							<h2 className="text-slate-800 dark:text-white text-2xl sm:text-3xl font-medium">
								Reset Password
							</h2>
							<p className="text-slate-600 dark:text-white/60 mt-2 text-sm sm:text-base">
								Enter your email to receive a reset link
							</p>
						</div>

						<form
							onSubmit={handleSubmit(onSubmit)}
							className="w-full space-y-5"
						>
							<div className="text-left">
								<label className="text-slate-700 dark:text-white/80 text-sm sm:text-base">
									Email
									<input
										type="email"
										placeholder="Enter your email"
										className="mt-1 w-full h-12 sm:h-14 px-4 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
										{...register("email")}
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</label>
								{errors.email && (
									<p className="text-red-500 text-sm mt-1">
										{errors.email.message}
									</p>
								)}
							</div>

							<button
								type="submit"
								disabled={isSubmitting}
								className={cn(
									"w-full text-white font-medium py-3 sm:py-4 rounded-xl h-12 sm:h-14 transition",
									isSubmitting
										? "bg-orange-400 cursor-not-allowed"
										: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
								)}
							>
								{isSubmitting ? "Submitting..." : "Send Reset Link"}
							</button>

							{successMessage && (
								<p className="text-black dark:text-white font-semibold text-sm text-center">
									{successMessage}
								</p>
							)}

							<div className="text-center mt-2">
								<Link
									href="/auth/login"
									className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 text-xs sm:text-sm font-medium underline"
								>
									Back to Login
								</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
