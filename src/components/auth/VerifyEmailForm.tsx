"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

const verifyEmailZ = z.object({
	email: z.string().email("Enter a valid email"),
});

type FormData = z.infer<typeof verifyEmailZ>;

export default function VerifyEmailForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(verifyEmailZ),
		mode: "onChange",
	});

	const [isLoading, setIsLoading] = useState(false);

	const onSubmit = async (data: FormData) => {
		setIsLoading(true);
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/send-verify-email`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email: data.email }),
				},
			);

			if (!res.ok) {
				const err = await res.json();
				console.error("Verification email error:", err);
				toast.warn("Verification email failed.");
			} else {
				toast.success("Please check your email to verify your account.");
			}
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<div>
				<label className="text-slate-700 dark:text-white/80 text-sm">
					Email
					<input
						type="email"
						{...register("email")}
						className="w-full h-11 px-3 text-sm rounded-lg border dark:bg-slate-800/60 border-slate-300 dark:border-slate-600 placeholder:text-slate-400 dark:placeholder:text-white/40"
						placeholder="Enter your email"
					/>
				</label>
				{errors.email && (
					<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
				)}
			</div>

			<button
				type="submit"
				disabled={isLoading}
				className="w-full h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg"
			>
				{isLoading ? "Sending..." : "Send Verification Email"}
			</button>
		</form>
	);
}
