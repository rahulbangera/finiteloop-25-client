"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { registerZ } from "@/lib/validation";
import "react-toastify/dist/ReactToastify.css";
import type { z } from "zod";
import PaymentButton from "../razorpay/paymentButton";
import { Button } from "../ui/button";

export default function JoinFLCForm() {
	const _router = useRouter();
	const [isPaymentLoading, setIsPaymentLoading] = useState(false);
	const [statusLoading, setStatusLoading] = useState(true);
	const { data: session, update } = useSession();
	const [joined, setJoined] = useState<{
		paymentStatus: boolean;
		joined: boolean;
	}>({
		paymentStatus: false,
		joined: false,
	});

	const [registrationOpen, setRegistrationOpen] = useState<boolean | null>(
		null,
	);

	useEffect(() => {
		const checkRegistrationStatus = async () => {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/register/status`,
				);
				const data = await res.json();
				setRegistrationOpen(data.status);
			} catch {
				setRegistrationOpen(false);
			}
		};
		checkRegistrationStatus();
	}, []);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof registerZ>>({
		resolver: zodResolver(registerZ),
		mode: "onChange",
	});

	const checkJoinStatus = async () => {
		if (!session) return;
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/register/join-status`,
				{
					headers: {
						Authorization: `Bearer ${session.user.accessToken}`,
					},
					method: "POST",
				},
			);
			if (!res.ok) {
				throw new Error("Failed to check join status");
			}
			const data = await res.json();
			if (
				data.joinStatus.paymentStatus === true &&
				data.joinStatus.registered === true
			) {
				setJoined({ paymentStatus: true, joined: true });
			} else if (
				data.joinStatus.paymentStatus === false &&
				data.joinStatus.registered === true
			) {
				setJoined({ paymentStatus: false, joined: true });
			} else {
				setJoined({ paymentStatus: false, joined: false });
			}
		} catch (error) {
			console.error("Error checking join status:", error);
			return false;
		} finally {
			setStatusLoading(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <no need of exhaustive dependencies>
	useEffect(() => {
		checkJoinStatus();
	}, [session]);

	const onSubmit = async (data: z.infer<typeof registerZ>) => {
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/register/join-flc`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${session?.user?.accessToken}`,
					},
					body: JSON.stringify({ ...data }),
				},
			);

			if (res.ok) {
				toast.success("Save Successful", { autoClose: 1500 });
				setJoined({ paymentStatus: false, joined: true });
				await update();
			} else {
				const response = await res.json();
				const errorMsg = response?.message || "Registration failed.";
				toast.error(errorMsg);
			}
		} catch (err) {
			console.error("Registration error:", err);
			toast.error("Something went wrong. Please try again.");
		}
	};

	return (
		<div className="flex items-center justify-center py-20 px-4 z-40 relative min-h-[calc(100vh-80px-150px)]">
			<div className="w-full max-w-md md:max-w-4xl mx-auto mt-10">
				<div className="border border-slate-200 dark:border-white/30 rounded-2xl p-5 md:p-8 bg-white/20 dark:bg-black/30 backdrop-blur-sm shadow-lg">
					<div className="flex flex-col md:flex-row md:gap-8">
						<div className="relative flex justify-center items-center mb-6 md:mb-0 md:w-1/2">
							<div className="relative w-40 h-40 md:w-full md:h-full md:min-h-[300px]">
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
						</div>
						<div className="flex flex-col justify-center md:w-1/2 w-full">
							{registrationOpen === null || statusLoading ? (
								<div className="flex flex-col items-center justify-center h-full">
									<p className="text-2xl text-slate-800 dark:text-white mb-2 text-center">
										Checking registration status...
									</p>
								</div>
							) : session?.user?.role !== "USER" ? (
								<div className="flex flex-col items-center justify-center h-full">
									<p className="text-4xl text-slate-800 dark:text-white mb-2 text-center">
										You have already registered.
									</p>
									<p className="text-xl text-slate-600 dark:text-white/80 text-center mt-5">
										You are logged in as{" "}
										<span className="font-bold">
											{session?.user?.name} {session?.user?.email}
										</span>
									</p>
								</div>
							) : registrationOpen === true ? (
								isPaymentLoading ? (
									<div className="flex flex-col items-center justify-center h-full">
										<p className="text-2xl text-slate-800 dark:text-white mb-2 text-center">
											Processing payment...
										</p>
									</div>
								) : !joined.joined ? (
									<form
										className="space-y-5"
										onSubmit={(e) => e.preventDefault()}
									>
										<div className="text-center mb-4 md:mb-6">
											<h2 className="text-slate-800 dark:text-white text-xl md:text-2xl font-medium">
												Register
											</h2>
										</div>
										<div>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
												<div>
													<label className="block text-slate-600 dark:text-white/80 text-sm mb-0.5">
														Name
														<input
															type="text"
															value={session?.user?.name || ""}
															readOnly
															className="w-full bg-gray-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white h-10 rounded-lg px-3 text-sm"
														/>
													</label>
												</div>
												<div>
													<label className="block text-slate-600 dark:text-white/80 text-sm mb-0.5">
														USN
														<input
															type="text"
															value={session?.user?.usn || ""}
															readOnly
															className="w-full bg-gray-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white h-10 rounded-lg px-3 text-sm"
														/>
													</label>
												</div>
												<div>
													<label className="block text-slate-600 dark:text-white/80 text-sm mb-0.5">
														Phone
														<input
															type="text"
															value={session?.user?.phone || ""}
															readOnly
															className="w-full bg-gray-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white h-10 rounded-lg px-3 text-sm"
														/>
													</label>
												</div>
												<div>
													<label className="block text-slate-600 dark:text-white/80 text-sm mb-0.5">
														Email
														<input
															type="email"
															value={session?.user?.email || ""}
															readOnly
															className="w-full bg-gray-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white h-10 rounded-lg px-3 text-sm"
														/>
													</label>
												</div>
												<div>
													<label className="block text-slate-600 dark:text-white/80 text-sm mb-0.5">
														Branch
														<input
															type="text"
															value={session?.user?.branch || ""}
															readOnly
															className="w-full bg-gray-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white h-10 rounded-lg px-3 text-sm"
														/>
													</label>
												</div>
												<div>
													<label className="block text-slate-600 dark:text-white/80 text-sm mb-0.5">
														Year of Graduation
														<input
															type="text"
															value={session?.user?.year || ""}
															readOnly
															className="w-full bg-gray-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white h-10 rounded-lg px-3 text-sm"
														/>
													</label>
												</div>
											</div>
											<label className="block text-slate-600 dark:text-white/80 text-sm mb-0.5">
												Why do you want to join FLC?
												<textarea
													{...register("reasonToJoin")}
													className="w-full bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-16 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm px-3 py-1.5"
													placeholder="Your reason..."
												/>
											</label>
											<div className="text-red-500 text-sm min-h-[1rem]">
												{errors.reasonToJoin?.message}
											</div>
										</div>
										<div>
											<label className="block text-slate-600 dark:text-white/80 text-sm mb-0.5">
												What are your expectations from FLC?
												<textarea
													{...register("expectations")}
													className="w-full bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-16 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm px-3 py-1.5"
													placeholder="Expectations from the club"
												/>
											</label>
											<div className="text-red-500 text-sm min-h-[1rem]">
												{errors.expectations?.message}
											</div>
										</div>
										<div>
											<label className="block text-slate-600 dark:text-white/80 text-sm mb-0.5">
												How would you contribute to FLC?
												<textarea
													{...register("contribution")}
													className="w-full bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-16 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm px-3 py-1.5"
													placeholder="Your contributions..."
												/>
											</label>
											<div className="text-red-500 text-sm min-h-[1rem]">
												{errors.contribution?.message}
											</div>
										</div>
										<div>
											<label className="block text-slate-600 dark:text-white/80 text-sm mb-0.5">
												GitHub Profile Link
												<input
													type="url"
													{...register("githubLink")}
													className="w-full bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-10 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm px-3"
													placeholder="https://github.com/username"
												/>
											</label>
											<div className="text-red-500 text-sm min-h-[1rem]">
												{errors.githubLink?.message}
											</div>
										</div>
										{/* <button
										type="submit"
										disabled={isSubmitting}
										className="w-full mt-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2 rounded-lg h-10 text-sm disabled:opacity-50"
									>
										{isSubmitting ? "Submitting..." : "Register"}
									</button> */}
										<div className="flex justify-between items-center mt-4">
											<Button onClick={handleSubmit(onSubmit)}>
												Register Now
											</Button>
										</div>
									</form>
								) : !joined.paymentStatus ? (
									<div className="flex flex-col items-center justify-center h-full">
										<p className="text-2xl text-slate-800 dark:text-white mb-2 text-center">
											Please make the payment to complete your registration.
										</p>
										<PaymentButton
											title="Pay Membership"
											className="cursor-pointer"
											paymentType="MEMBERSHIP"
											description="Club Membership"
											onStart={async () => {
												setIsPaymentLoading(true);
											}}
											onSuccess={async (_paymentId) => {
												setIsPaymentLoading(false);
												toast.success("Payment successful");
												await update();
											}}
											onFailure={(error) => {
												setIsPaymentLoading(false);
												toast.error(error || "Payment failed");
											}}
											type="submit"
										>
											{isSubmitting ? "Processing..." : "Pay Membership"}
										</PaymentButton>
									</div>
								) : (
									<div className="flex flex-col items-center justify-center h-full">
										<p className="text-2xl text-slate-800 dark:text-white mb-2 text-center">
											If you have paid the registration fee but the status is
											not updated, please contact us.
										</p>
										<Button onClick={() => update()}>Refresh Status</Button>
									</div>
								)
							) : (
								<div className="flex flex-col items-center justify-center h-full">
									<p className="text-2xl text-slate-800 dark:text-white mb-2 text-center">
										{session?.user?.role === "USER"
											? "Registration is closed."
											: "You are a FLC member!"}
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
