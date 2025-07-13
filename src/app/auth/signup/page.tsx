"use client";
import Image from "next/image";
import Link from "next/link";
import type { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { z } from "zod";
import { cn } from "@/lib/utils";
import * as Form from "@radix-ui/react-form";
import { Input } from "@/components/ui/input";
import { Password } from "@/components/ui/custom/password";
import { signUpZ } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
	className?: string;
}

const mockBranches = [
	{ id: "1", name: "Computer Science Engineering" },
	{ id: "2", name: "Information Science Engineering" },
	{ id: "3", name: "Electronics and Communication" },
	{ id: "4", name: "Mechanical Engineering" },
	{ id: "5", name: "Civil Engineering" },
];

const graduationYears = [
	{ value: "2026", label: "2026 (4th B.Tech, 2nd MCA)" },
	{ value: "2027", label: "2027 (3rd B.Tech, 1st MCA)" },
	{ value: "2028", label: "2028 (2nd B.Tech)" },
	{ value: "2029", label: "2029 (1st B.Tech)" },
];

const SignUpForm: FunctionComponent<Props> = ({ className }) => {
	const router = useRouter();

	const formSchema = signUpZ;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			usn: "",
			phone: "",
			branchId: "",
			year: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = (_values: z.infer<typeof formSchema>) => {
		toast.loading("Signing up...");

		setTimeout(() => {
			toast.dismiss();
			toast.success("Verification email sent! Please check your inbox");
			setTimeout(() => router.push("/auth/verify-email"), 1000);
		}, 2000);
	};

	return (
		<div className="flex items-center justify-center py-20 z-40 relative px-4 min-h-[calc(100vh-80px-150px)]">
			<div className="hidden md:block w-full max-w-4xl mx-auto mt-16">
				<div className="border border-slate-200 dark:border-white/30 rounded-2xl p-6 lg:p-8 bg-white/20 dark:bg-black/30 backdrop-blur-sm shadow-lg">
					<div className="grid grid-cols-2 gap-8">
						<div className="relative flex items-center justify-center">
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
						</div>
						<div className="flex flex-col justify-center">
							<Form.Root
								onSubmit={form.handleSubmit(onSubmit)}
								className={cn(className, "space-y-5")}
							>
								<div className="text-center mb-6">
									<h2 className="text-slate-800 dark:text-white text-2xl font-medium">
										Signup
									</h2>
								</div>
								<div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-4">
									<Form.Field name="name" className="w-full">
										<Form.Label className="text-slate-600 dark:text-white/80 text-sm">
											1. Name
										</Form.Label>
										<Input
											className="bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-11 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"
											placeholder="Enter your name"
											{...form.register("name")}
										/>
										{form.formState.errors.name && (
											<div className="text-red-500 text-xs mt-1">
												{form.formState.errors.name.message as string}
											</div>
										)}
									</Form.Field>
									<Form.Field name="email" className="w-full">
										<Form.Label className="text-slate-600 dark:text-white/80 text-sm">
											2. Email
										</Form.Label>
										<Input
											className="bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-11 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"
											placeholder="Enter your email"
											{...form.register("email")}
										/>
										{form.formState.errors.email && (
											<div className="text-red-500 text-xs mt-1">
												{form.formState.errors.email.message as string}
											</div>
										)}
									</Form.Field>
								</div>
								<div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-4">
									<Form.Field name="usn" className="w-full">
										<Form.Label className="text-slate-600 dark:text-white/80 text-sm">
											3. USN
										</Form.Label>
										<Input
											className="bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-11 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"
											placeholder="Enter your USN"
											{...form.register("usn")}
										/>
										{form.formState.errors.usn && (
											<div className="text-red-500 text-xs mt-1">
												{form.formState.errors.usn.message as string}
											</div>
										)}
									</Form.Field>
									<Form.Field name="phone" className="w-full">
										<Form.Label className="text-slate-600 dark:text-white/80 text-sm">
											4. Phone
										</Form.Label>
										<Input
											className="bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-11 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"
											placeholder="Enter your phone number"
											{...form.register("phone")}
										/>
										{form.formState.errors.phone && (
											<div className="text-red-500 text-xs mt-1">
												{form.formState.errors.phone.message as string}
											</div>
										)}
									</Form.Field>
								</div>
								<div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-4">
									<Form.Field name="branchId" className="w-full">
										<Form.Label className="text-slate-600 dark:text-white/80 text-sm">
											5. Branch
										</Form.Label>
										<select
											className="w-full h-11 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm px-3"
											{...form.register("branchId")}
										>
											<option value="">Select branch...</option>
											{mockBranches.map((branch) => (
												<option key={branch.id} value={branch.id}>
													{branch.name}
												</option>
											))}
										</select>
										{form.formState.errors.branchId && (
											<div className="text-red-500 text-xs mt-1">
												{form.formState.errors.branchId.message as string}
											</div>
										)}
									</Form.Field>
									<Form.Field name="year" className="w-full">
										<Form.Label className="text-slate-600 dark:text-white/80 text-sm">
											6. Year of Graduation
										</Form.Label>
										<select
											className="w-full h-11 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm px-3"
											{...form.register("year")}
										>
											<option value="">Choose Year</option>
											{graduationYears.map((year) => (
												<option key={year.value} value={year.value}>
													{year.label}
												</option>
											))}
										</select>
										{form.formState.errors.year && (
											<div className="text-red-500 text-xs mt-1">
												{form.formState.errors.year.message as string}
											</div>
										)}
									</Form.Field>
								</div>
								<div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-4">
									<Form.Field name="password" className="w-full">
										<Form.Label className="text-slate-600 dark:text-white/80 text-sm">
											7. Password
										</Form.Label>
										<Password
											className="bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-11 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"
											placeholder="Enter your password"
											{...form.register("password")}
										/>
										{form.formState.errors.password && (
											<div className="text-red-500 text-xs mt-1">
												{form.formState.errors.password.message as string}
											</div>
										)}
									</Form.Field>
									<Form.Field name="confirmPassword" className="w-full">
										<Form.Label className="text-slate-600 dark:text-white/80 text-sm">
											8. Confirm Password
										</Form.Label>
										<Password
											className="bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-11 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"
											placeholder="Confirm your password"
											{...form.register("confirmPassword")}
										/>
										{form.formState.errors.confirmPassword && (
											<div className="text-red-500 text-xs mt-1">
												{
													form.formState.errors.confirmPassword
														.message as string
												}
											</div>
										)}
									</Form.Field>
								</div>
								<button
									className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2.5 rounded-lg h-11 text-sm"
									type="submit"
								>
									Submit
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
							</Form.Root>
						</div>
					</div>
				</div>
			</div>

			<div className="md:hidden w-full max-w-xs mx-auto mt-12">
				<div className="border border-slate-200 dark:border-white/30 rounded-2xl p-5 bg-white/20 dark:bg-black/30 backdrop-blur-sm shadow-lg">
					<div className="flex flex-col items-center space-y-4">
						<div className="relative w-40 h-40 mb-2">
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
							<Form.Root
								onSubmit={form.handleSubmit(onSubmit)}
								className={cn(className, "space-y-4")}
							>
								<div className="text-center mb-4">
									<h2 className="text-slate-800 dark:text-white text-xl font-medium">
										Signup
									</h2>
								</div>
								<div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-4">
									<Form.Field name="name" className="w-full">
										<Form.Label className="text-slate-600 dark:text-white/80 text-xs">
											1. Name
										</Form.Label>
										<Input
											className="bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-10 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"
											placeholder="Enter your name"
											{...form.register("name")}
										/>
										{form.formState.errors.name && (
											<div className="text-red-500 text-xs mt-1">
												{form.formState.errors.name.message as string}
											</div>
										)}
									</Form.Field>
									<Form.Field name="email" className="w-full">
										<Form.Label className="text-slate-600 dark:text-white/80 text-xs">
											2. Email
										</Form.Label>
										<Input
											className="bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-10 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"
											placeholder="Enter your email"
											{...form.register("email")}
										/>
										{form.formState.errors.email && (
											<div className="text-red-500 text-xs mt-1">
												{form.formState.errors.email.message as string}
											</div>
										)}
									</Form.Field>
								</div>
								<div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-4">
									<Form.Field name="usn" className="w-full">
										<Form.Label className="text-slate-600 dark:text-white/80 text-xs">
											3. USN
										</Form.Label>
										<Input
											className="bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-10 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"
											placeholder="Enter your USN"
											{...form.register("usn")}
										/>
										{form.formState.errors.usn && (
											<div className="text-red-500 text-xs mt-1">
												{form.formState.errors.usn.message as string}
											</div>
										)}
									</Form.Field>
									<Form.Field name="phone" className="w-full">
										<Form.Label className="text-slate-600 dark:text-white/80 text-xs">
											4. Phone
										</Form.Label>
										<Input
											className="bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-10 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"
											placeholder="Enter your phone number"
											{...form.register("phone")}
										/>
										{form.formState.errors.phone && (
											<div className="text-red-500 text-xs mt-1">
												{form.formState.errors.phone.message as string}
											</div>
										)}
									</Form.Field>
								</div>
								<div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-4">
									<Form.Field name="branchId" className="w-full">
										<Form.Label className="text-slate-600 dark:text-white/80 text-xs">
											5. Branch
										</Form.Label>
										<select
											className="w-full h-10 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm px-3"
											{...form.register("branchId")}
										>
											<option value="">Select branch...</option>
											{mockBranches.map((branch) => (
												<option key={branch.id} value={branch.id}>
													{branch.name}
												</option>
											))}
										</select>
										{form.formState.errors.branchId && (
											<div className="text-red-500 text-xs mt-1">
												{form.formState.errors.branchId.message as string}
											</div>
										)}
									</Form.Field>
									<Form.Field name="year" className="w-full">
										<Form.Label className="text-slate-600 dark:text-white/80 text-xs">
											6. Year of Graduation
										</Form.Label>
										<select
											className="w-full h-10 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm px-3"
											{...form.register("year")}
										>
											<option value="">Choose Year</option>
											{graduationYears.map((year) => (
												<option key={year.value} value={year.value}>
													{year.label}
												</option>
											))}
										</select>
										{form.formState.errors.year && (
											<div className="text-red-500 text-xs mt-1">
												{form.formState.errors.year.message as string}
											</div>
										)}
									</Form.Field>
								</div>
								<div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-4">
									<Form.Field name="password" className="w-full">
										<Form.Label className="text-slate-600 dark:text-white/80 text-xs">
											7. Password
										</Form.Label>
										<Password
											className="bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-10 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"
											placeholder="••••"
											{...form.register("password")}
										/>
										{form.formState.errors.password && (
											<div className="text-red-500 text-xs mt-1">
												{form.formState.errors.password.message as string}
											</div>
										)}
									</Form.Field>
									<Form.Field name="confirmPassword" className="w-full">
										<Form.Label className="text-slate-600 dark:text-white/80 text-xs">
											8. Confirm Password
										</Form.Label>
										<Password
											className="bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 h-10 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"
											placeholder="••••"
											{...form.register("confirmPassword")}
										/>
										{form.formState.errors.confirmPassword && (
											<div className="text-red-500 text-xs mt-1">
												{
													form.formState.errors.confirmPassword
														.message as string
												}
											</div>
										)}
									</Form.Field>
								</div>
								<button
									className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2 rounded-lg h-10 text-sm"
									type="submit"
								>
									Submit
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
							</Form.Root>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function SignUpPage() {
	return <SignUpForm />;
}
