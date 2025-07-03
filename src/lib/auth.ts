import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (
					credentials?.email === "admin@example.com" &&
					credentials?.password === "password"
				) {
					return { id: "1", name: "Admin", email: "admin@example.com" };
				}
				return null;
			},
		}),
	],
	pages: {
		signIn: "/auth/login",
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.AUTH_SECRET,
};
