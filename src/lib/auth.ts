import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			name?: string;
			email: string;
			role: string;
		};
	}
	interface User {
		id: string;
		name?: string;
		email: string;
		role: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		[key: string]: unknown;
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const email = credentials?.email?.trim().toLowerCase();
				const password = credentials?.password;

				const res = await fetch(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email, password }),
					},
				);

				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.message || "Login failed");
				}

				return data.user;
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

	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				Object.assign(token, user);
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				Object.assign(session.user, token);
			}
			return session;
		},
	},
};
