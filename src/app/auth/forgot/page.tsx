import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import ForgotForm from "@/components/auth/ForgotForm";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
	const session = await getServerSession(authOptions);

	if (session) {
		redirect("/profile");
	}

	return <ForgotForm />;
}
