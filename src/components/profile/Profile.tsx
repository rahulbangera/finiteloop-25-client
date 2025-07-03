"use client";
import { useSession } from "next-auth/react";

export default function Profile() {
	const { data: session } = useSession();

	return (
		<div className="flex flex-col items-center justify-center min-h-screen text-6xl font-bold">
			Hello {session?.user?.name || "Guest"}!
		</div>
	);
}
