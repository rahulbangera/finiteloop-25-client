"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

const resetPasswordZ = z
	.object({
		newPassword: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type ResetPasswordFormData = z.infer<typeof resetPasswordZ>;

export default function ResetPasswordForm({
	token,
	className,
}: {
	token: string;
	className?: string;
}) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordZ),
		mode: "onChange",
	});

	const onSubmit = async (values: ResetPasswordFormData) => {
		setIsSubmitting(true);
		setMessage("");

		const res = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/reset-password`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					token,
					newPassword: values.newPassword,
					confirmNewPassword: values.confirmPassword,
				}),
			},
		);

		const data = await res.json();

		if (res.ok) {
			setMessage("Password reset successful. Redirecting to login...");
			setTimeout(() => router.push("/auth/login"), 2000);
		} else {
			setMessage(data.message || "Something went wrong");
			setTimeout(() => router.push("/auth/login"), 3000);
		}

		setIsSubmitting(false);
	};

	return (
		<div className="flex items-center justify-center py-32 px-4">
			<div className="w-full max-w-sm md:max-w-md mx-auto mt-10 md:mt-20">
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
								Enter your new password
							</p>
						</div>

						<form
							onSubmit={handleSubmit(onSubmit)}
							className={cn(className, "w-full space-y-5")}
						>
							<div className="text-left">
								<label className="text-slate-700 dark:text-white/80 text-sm sm:text-base">
									New Password
									<input
										type="password"
										placeholder="Enter new password"
										className="mt-1 w-full h-12 sm:h-14 px-4 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
										{...register("newPassword")}
									/>
								</label>
								{errors.newPassword && (
									<p className="text-red-500 text-sm mt-1">
										{errors.newPassword.message}
									</p>
								)}
							</div>

							<div className="text-left">
								<label className="text-slate-700 dark:text-white/80 text-sm sm:text-base">
									Confirm Password
									<input
										type="password"
										placeholder="Re-enter password"
										className="mt-1 w-full h-12 sm:h-14 px-4 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
										{...register("confirmPassword")}
									/>
								</label>
								{errors.confirmPassword && (
									<p className="text-red-500 text-sm mt-1">
										{errors.confirmPassword.message}
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
								{isSubmitting ? "Submitting..." : "Submit"}
							</button>

							{message && (
								<p className="text-black dark:text-white font-semibold text-sm text-center">
									{message}
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
