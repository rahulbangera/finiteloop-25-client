import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Profile from "@/components/profile/Profile";

export default async function ProfilePage() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/auth/login");
	}

	return <Profile />;
}
