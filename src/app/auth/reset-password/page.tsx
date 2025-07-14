"use client";
import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
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
