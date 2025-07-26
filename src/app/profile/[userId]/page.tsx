import { notFound } from "next/navigation";
import Profile from "@/components/profile/Profile";

interface ProfilePageProps {
	params: Promise<{
		userId: string;
	}>;
}

export default async function UserProfilePage({ params }: ProfilePageProps) {
	const { userId } = await params;

	const userIdNumber = parseInt(userId, 10);
	if (Number.isNaN(userIdNumber)) {
		notFound();
	}

	return <Profile userId={userIdNumber} />;
}
