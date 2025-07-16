"use client";
import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { useSearchParams } from "next/navigation";

function ResetPasswordPageContent() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	return (
		<div className="flex h-screen items-center justify-center">
			{token ? (
				<ResetPasswordForm token={token} />
			) : (
				<div className="text-center text-xl text-white">Invalid Token</div>
			)}
		</div>
	);
}

export default function ResetPasswordPage() {
	return (
		<Suspense
			fallback={
				<div className="text-center text-xl text-white">Loading...</div>
			}
		>
			<ResetPasswordPageContent />
		</Suspense>
	);
}
