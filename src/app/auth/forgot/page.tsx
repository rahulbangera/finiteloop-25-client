import ForgotForm from "@/components/auth/ForgotForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
	const session = await getServerSession(authOptions);

	if (session) {
		redirect("/profile");
	}

	return <ForgotForm />;
}
