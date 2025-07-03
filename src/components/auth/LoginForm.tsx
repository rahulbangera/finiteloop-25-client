"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import type { z } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Password } from "@/components/ui/custom/password";
import * as Form from "@radix-ui/react-form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { loginZ } from "@/lib/validation";

interface Props {
	className?: string;
}

const LoginForm: FunctionComponent<Props> = ({ className }) => {
	const router = useRouter();

	const formSchema = loginZ;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: { email: string; password: string }) => {
		const res = await signIn("credentials", {
			redirect: false,
			email: data.email,
			password: data.password,
		});

		if (res?.ok) {
			router.push("/profile");
		} else {
			alert("Invalid email or password");
		}
	};

	return (
		<div className="flex items-center justify-center py-20 z-40 relative px-4 min-h-[calc(100vh-80px-150px)]">
			<div className="hidden md:block w-full max-w-3xl">
				<div className="border border-slate-200 dark:border-white/30 rounded-2xl p-6 lg:p-8 bg-white/80 dark:bg-black/30 backdrop-blur-sm shadow-lg">
					<div className="grid grid-cols-2 gap-8">
						<div className="relative flex items-center justify-center">
							<div className="relative w-full h-full min-h-[300px]">
								<Image
									src="/auth.webp"
									alt="Astronaut"
									fill
									className="object-contain"
									priority
								/>
							</div>
						</div>
						<div className="flex flex-col justify-center">
							<Form.Root
								onSubmit={form.handleSubmit(onSubmit)}
								className={cn(className, "space-y-5")}
							>
								<div className="text-center mb-6">
									<h2 className="text-slate-800 dark:text-white text-2xl font-medium">
										Login
									</h2>
								</div>
								<Form.Field name="email">
									<Form.Label className="text-slate-600 dark:text-white/80 text-sm">
										Email
									</Form.Label>
									<Form.Control asChild>
										<Input
											className="bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-11 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"
											placeholder="Enter your email"
											{...form.register("email")}
										/>
									</Form.Control>
									{form.formState.errors.email && (
										<Form.Message className="text-red-500">
											{form.formState.errors.email.message as string}
										</Form.Message>
									)}
								</Form.Field>
								<Form.Field name="password">
									<Form.Label className="text-slate-600 dark:text-white/80 text-sm">
										Password
									</Form.Label>
									<Form.Control asChild>
										<Password
											className="bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-11 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"
											placeholder="Enter your password"
											{...form.register("password")}
										/>
									</Form.Control>
									{form.formState.errors.password && (
										<Form.Message className="text-red-500">
											{form.formState.errors.password.message as string}
										</Form.Message>
									)}
								</Form.Field>
								<div className="text-left">
									<Link
										href="/auth/forgot"
										className="text-slate-500 hover:text-slate-700 dark:text-white/60 dark:hover:text-white/80 text-xs underline"
									>
										Forgot password
									</Link>
								</div>
								<Button
									className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2.5 rounded-lg h-11 text-sm"
									type="submit"
								>
									Login
								</Button>
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
							</Form.Root>
						</div>
					</div>
				</div>
			</div>

			<div className="md:hidden w-full max-w-xs">
				<div className="border border-slate-200 dark:border-white/30 rounded-2xl p-5 bg-white/80 dark:bg-black/30 backdrop-blur-sm shadow-lg">
					<div className="flex flex-col items-center space-y-4">
						<div className="relative w-40 h-40 mb-2">
							<Image
								src="/auth.webp"
								alt="Astronaut"
								fill
								className="object-contain"
								priority
							/>
						</div>
						<div className="w-full">
							<Form.Root
								onSubmit={form.handleSubmit(onSubmit)}
								className={cn(className, "space-y-4")}
							>
								<div className="text-center mb-4">
									<h2 className="text-slate-800 dark:text-white text-xl font-medium">
										Login
									</h2>
								</div>
								<Form.Field name="email">
									<Form.Label className="text-slate-600 dark:text-white/80 text-xs">
										Email
									</Form.Label>
									<Form.Control asChild>
										<Input
											className="bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-10 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"
											placeholder="Enter your email"
											{...form.register("email")}
										/>
									</Form.Control>
									{form.formState.errors.email && (
										<Form.Message className="text-red-500 text-xs">
											{form.formState.errors.email.message as string}
										</Form.Message>
									)}
								</Form.Field>
								<Form.Field name="password">
									<Form.Label className="text-slate-600 dark:text-white/80 text-xs">
										Password
									</Form.Label>
									<Form.Control asChild>
										<Password
											className="bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-10 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"
											placeholder="Enter your password"
											{...form.register("password")}
										/>
									</Form.Control>
									{form.formState.errors.password && (
										<Form.Message className="text-red-500 text-xs">
											{form.formState.errors.password.message as string}
										</Form.Message>
									)}
								</Form.Field>
								<div className="text-left">
									<Link
										href="/auth/forgot"
										className="text-slate-500 hover:text-slate-700 dark:text-white/60 dark:hover:text-white/80 text-xs underline"
									>
										Forgot password
									</Link>
								</div>
								<Button
									className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2 rounded-lg h-10 text-sm"
									type="submit"
								>
									Login
								</Button>
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
							</Form.Root>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
