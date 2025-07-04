"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import * as Form from "@radix-ui/react-form";
import { cn } from "@/lib/utils";
import { sendPasswordResetZ } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import * as Dialog from "@radix-ui/react-dialog";

interface Props {
	className?: string;
}

const Forgot = ({ className }: Props) => {
	const router = useRouter();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [userEmail, setUserEmail] = useState("");

	const formSchema = sendPasswordResetZ;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = (_values: z.infer<typeof formSchema>) => {
		console.log("Sending reset password email...");
		setUserEmail(_values.email);

		setTimeout(() => {
			setIsDialogOpen(true);
		}, 2000);
	};

	return (
		<>
			<div className="flex items-center justify-center py-32 z-40 relative px-4 min-h-[calc(100vh-80px-250px)] md:min-h-[calc(100vh-80px-150px)]">
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

							<div className="w-full">
								<div className="text-center mb-8">
									<h2 className="text-slate-800 dark:text-white text-2xl sm:text-3xl font-medium">
										Reset Password
									</h2>
									<p className="text-slate-600 dark:text-white/60 mt-2 text-sm sm:text-base">
										Enter your email to receive a reset link
									</p>
								</div>
								<Form.Root
									onSubmit={form.handleSubmit(onSubmit)}
									className={cn(className, "space-y-6")}
								>
									<Form.Field name="email">
										<div>
											<Form.Label className="text-slate-700 dark:text-white/80 text-sm sm:text-base">
												Email
											</Form.Label>
											<Form.Control asChild>
												<Input
													className="bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-12 sm:h-14 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
													placeholder="Enter your email"
													{...form.register("email")}
												/>
											</Form.Control>
											{form.formState.errors.email && (
												<Form.Message className="text-red-500">
													{form.formState.errors.email.message as string}
												</Form.Message>
											)}
										</div>
									</Form.Field>
									<button
										className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 sm:py-4 rounded-xl h-12 sm:h-14"
										type="submit"
									>
										Send Reset Link
									</button>
									<div className="text-center">
										<Link
											href="/auth/login"
											className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 text-xs sm:text-sm font-medium underline"
										>
											Back to Login
										</Link>
									</div>
								</Form.Root>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
				<Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 p-8 shadow-xl focus:outline-none">
					<div>
						<Dialog.Title className="text-2xl text-slate-100 mb-2">
							Reset Email Sent!
						</Dialog.Title>
						<Dialog.Description className="text-slate-300 text-sm sm:text-base py-2">
							We've sent a password reset link to{" "}
							<span className="text-orange-400 font-medium">{userEmail}</span>.
							Please check your inbox and follow the instructions to reset your
							password.
						</Dialog.Description>
					</div>
					<div className="mt-4">
						<button
							type="button"
							className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl"
							onClick={() => {
								setIsDialogOpen(false);
								router.push("/auth/login");
							}}
						>
							Return to Login
						</button>
					</div>
				</Dialog.Content>
			</Dialog.Root>
		</>
	);
};

export default Forgot;
