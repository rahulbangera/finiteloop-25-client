"use client";

import LoginForm from "@/components/auth/login-form";
import { Toaster } from "sonner";

export default function LoginPage() {
	return (
		<>
			<LoginForm />
			<Toaster
				position="top-center"
				toastOptions={{
					style: {
						background: "#1e293b",
						color: "#ffffff",
						border: "1px solid #475569",
					},
				}}
			/>
		</>
	);
}
