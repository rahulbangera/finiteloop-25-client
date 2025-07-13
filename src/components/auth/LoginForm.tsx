"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const LoginForm = () => {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		const res = await signIn("credentials", {
			redirect: false,
			email,
			password,
		});

		if (res?.ok) {
			router.push("/profile");
		} else {
			setError("Invalid email or password");
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
							<form onSubmit={handleSubmit} className="space-y-5">
								<div className="text-center mb-4 md:mb-6">
									<h2 className="text-slate-800 dark:text-white text-xl md:text-2xl font-medium">
										Login
									</h2>
								</div>

								<div>
									<label className="block text-slate-600 dark:text-white/80 text-sm mb-1">
										Email
										<input
											type="email"
											className="w-full bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-11 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm px-3"
											placeholder="Enter your email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
									</label>
								</div>

								<div>
									<label className="block text-slate-600 dark:text-white/80 text-sm mb-1">
										Password
										<input
											type="password"
											className="w-full bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-11 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm px-3"
											placeholder="Enter your password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
										/>
									</label>
								</div>
								<div className="min-h-8">
									{error && <p className="text-red-500 text-lg">{error}</p>}
								</div>

								<div className="text-left">
									<Link
										href="/auth/forgot"
										className="text-slate-500 hover:text-slate-700 dark:text-white/60 dark:hover:text-white/80 text-xs underline"
									>
										Forgot password
									</Link>
								</div>

								<button
									type="submit"
									className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2.5 rounded-lg h-11 text-sm"
								>
									Login
								</button>

								<div className="text-center">
									<span className="text-slate-500 dark:text-white/60 text-xs">
										{"Don't have an account? "}
									</span>
									<Link
										href="/auth/signup"
										className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 text-xs font-medium underline"
									>
										Signup
									</Link>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
