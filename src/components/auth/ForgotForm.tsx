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
import { Button } from "@/components/ui/button";
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

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		console.log("Sending reset password email...");
		setUserEmail(values.email);

		setTimeout(() => {
			setIsDialogOpen(true);
		}, 2000);
	};

	return (
		<>
			<div className="flex items-center justify-center py-32 z-40 relative px-4 min-h-[calc(100vh-80px-250px)] md:min-h-[calc(100vh-80px-150px)]">
				<div className="w-full max-w-md">
					<div className="border-2 border-white/30 rounded-3xl p-8 backdrop-blur-sm bg-black/30">
						<div className="flex flex-col items-center">
							<div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-6">
								<Image
									src="/auth.webp"
									alt="Astronaut"
									fill
									className="object-contain"
									priority
								/>
							</div>

							<div className="w-full">
								<div className="text-center mb-8">
									<h2 className="text-white text-2xl sm:text-3xl font-medium">
										Reset Password
									</h2>
									<p className="text-white/60 mt-2 text-sm sm:text-base">
										Enter your email to receive a reset link
									</p>
								</div>
								<Form.Root
									onSubmit={form.handleSubmit(onSubmit)}
									className={cn(className, "space-y-6")}
								>
									<Form.Field name="email">
										<div>
											<Form.Label className="text-white/80 text-sm sm:text-base">
												Email
											</Form.Label>
											<Form.Control asChild>
												<Input
													className="bg-slate-800/60 border-slate-600 text-white placeholder:text-white/40 h-12 sm:h-14 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
													placeholder="Enter your email"
													{...form.register("email")}
												/>
											</Form.Control>
											<Form.Message className="text-red-400" />
										</div>
									</Form.Field>
									<Button
										className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 sm:py-4 rounded-xl h-12 sm:h-14"
										type="submit"
									>
										Send Reset Link
									</Button>
									<div className="text-center">
										<Link
											href="/auth/login"
											className="text-orange-400 hover:text-orange-300 text-xs sm:text-sm font-medium underline"
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
				<Dialog.Content className="bg-slate-900 border-slate-800 text-white">
					<div>
						<Dialog.Title className="text-2xl text-white">
							Reset Email Sent!
						</Dialog.Title>
						<Dialog.Description className="text-white/70 text-sm sm:text-base py-2">
							We've sent a password reset link to{" "}
							<span className="text-orange-400 font-medium">{userEmail}</span>.
							Please check your inbox and follow the instructions to reset your
							password.
						</Dialog.Description>
					</div>
					<div className="mt-4">
						<Button
							className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
							onClick={() => {
								setIsDialogOpen(false);
								router.push("/auth/login");
							}}
						>
							Return to Login
						</Button>
					</div>
				</Dialog.Content>
			</Dialog.Root>
		</>
	);
};

export default Forgot;
