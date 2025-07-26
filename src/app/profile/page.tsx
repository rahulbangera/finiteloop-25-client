import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Profile from "@/components/profile/Profile";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/auth/login");
	}

	return <Profile />;
}
