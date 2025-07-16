import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import JoinFLCForm from "@/components/auth/JoinFLCForm";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/auth/login");
	}

	return <JoinFLCForm />;
}
