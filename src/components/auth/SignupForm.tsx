"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { z } from "zod";
import { signUpZ } from "@/lib/validation";
import "react-toastify/dist/ReactToastify.css";

type SignUpFormData = z.infer<typeof signUpZ>;

const graduationYears = [
	{ value: "2026", label: "2026 (4th B.Tech, 2nd MCA)" },
	{ value: "2027", label: "2027 (3rd B.Tech, 1st MCA)" },
	{ value: "2028", label: "2028 (2nd B.Tech)" },
	{ value: "2029", label: "2029 (1st B.Tech)" },
];

export default function SignUpForm() {
	const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpFormData>({
		resolver: zodResolver(signUpZ),
		mode: "onChange",
	});

	useEffect(() => {
		const fetchBranches = async () => {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/api/branch`,
				);
				const json = await res.json();
				setBranches(json.data);
			} catch (err) {
				console.error("Failed to fetch branches:", err);
				setBranches([]);
			}
		};
		fetchBranches();
	}, []);

	const onSubmit = async (data: SignUpFormData) => {
		setIsSubmitting(true);
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/signup`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				},
			);

			if (!res.ok) {
				const errorData = await res.json();
				console.error("Signup failed", errorData);
				toast.error(`Signup failed: ${errorData.message || "Unknown error"}`);
				return;
			}

			// const verifyRes = await fetch(
			// 	`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/send-verify-email`,
			// 	{
			// 		method: "POST",
			// 		headers: { "Content-Type": "application/json" },
			// 		body: JSON.stringify({ email: data.email }),
			// 	},
			// );

			const response = await res.json();

			console.log("Signup response:", response);
			if (res.ok && !response.emailSent) {
				console.error("Verification email error");
				toast.warn("Account created but verification email failed.");
			} else {
				toast.success(
					"Signup successful! Please check your email to verify your account.",
				);
			}
		} catch (error) {
			console.error("Signup error:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setIsSubmitting(false);
		}
	};

	const sharedInputClasses =
		"w-full h-11 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm px-3";

	const errorText = (field: keyof SignUpFormData) => (
		<div className="text-red-500 text-xs min-h-[1rem]">
			{errors[field]?.message}
		</div>
	);

	return (
		<div className="flex items-center justify-center py-20 z-40 relative px-4 min-h-[calc(100vh-80px-150px)]">
			<div className="w-full max-w-4xl mx-auto mt-12">
				<div className="border border-slate-200 dark:border-white/30 rounded-2xl p-6 lg:p-8 bg-white/20 dark:bg-black/30 backdrop-blur-sm shadow-lg">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="relative w-full h-full min-h-[450px]">
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
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
							<div className="text-center mb-4">
								<h2 className="text-slate-800 dark:text-white text-2xl font-medium">
									Signup
								</h2>
							</div>
							<div className="flex flex-col sm:flex-row gap-4">
								<div className="w-full">
									<label className="text-slate-600 dark:text-white/80 text-sm">
										1. Name
										<input
											{...register("name")}
											className={sharedInputClasses}
											placeholder="Enter your name"
										/>
									</label>
									{errorText("name")}
								</div>
								<div className="w-full">
									<label className="text-slate-600 dark:text-white/80 text-sm">
										2. Email
										<input
											{...register("email")}
											type="email"
											className={sharedInputClasses}
											placeholder="Enter your email"
										/>
									</label>
									{errorText("email")}
								</div>
							</div>
							<div className="flex flex-col sm:flex-row gap-4">
								<div className="w-full">
									<label className="text-slate-600 dark:text-white/80 text-sm">
										3. USN
										<input
											{...register("usn")}
											className={sharedInputClasses}
											placeholder="Enter your USN"
										/>
									</label>
									{errorText("usn")}
								</div>
								<div className="w-full">
									<label className="text-slate-600 dark:text-white/80 text-sm">
										4. Phone
										<input
											{...register("phone")}
											className={sharedInputClasses}
											placeholder="Enter your phone number"
										/>
									</label>
									{errorText("phone")}
								</div>
							</div>
							<div className="flex flex-col sm:flex-row gap-4">
								<div className="w-full">
									<label className="text-slate-600 dark:text-white/80 text-sm">
										5. Branch
										<select
											{...register("branchId")}
											className={sharedInputClasses}
										>
											<option value="">Select branch...</option>
											{branches.map((branch) => (
												<option key={branch.id} value={branch.id}>
													{branch.name}
												</option>
											))}
										</select>
									</label>
									{errorText("branchId")}
								</div>
								<div className="w-full">
									<label className="text-slate-600 dark:text-white/80 text-sm">
										6. Year of Graduation
										<select
											{...register("year")}
											className={sharedInputClasses}
										>
											<option value="">Choose Year</option>
											{graduationYears.map((year) => (
												<option key={year.value} value={year.value}>
													{year.label}
												</option>
											))}
										</select>
									</label>
									{errorText("year")}
								</div>
							</div>
							<div className="flex flex-col sm:flex-row gap-4">
								<div className="w-full">
									<label className="text-slate-600 dark:text-white/80 text-sm">
										7. Password
										<input
											{...register("password")}
											type="password"
											className={sharedInputClasses}
											placeholder="••••"
										/>
									</label>
									{errorText("password")}
								</div>
								<div className="w-full">
									<label className="text-slate-600 dark:text-white/80 text-sm">
										8. Confirm Password
										<input
											{...register("confirmPassword")}
											type="password"
											className={sharedInputClasses}
											placeholder="••••"
										/>
									</label>
									{errorText("confirmPassword")}
								</div>
							</div>
							<button
								type="submit"
								disabled={isSubmitting}
								className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2.5 rounded-lg h-11 text-sm transition-opacity ${
									isSubmitting ? "opacity-50 cursor-not-allowed" : ""
								}`}
							>
								{isSubmitting ? "Submitting..." : "Submit"}
							</button>
							<div className="text-center">
								<span className="text-slate-500 dark:text-white/60 text-xs">
									Already have an account?{" "}
								</span>
								<Link
									href="/auth/login"
									className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 text-xs font-medium underline"
								>
									Login
								</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
