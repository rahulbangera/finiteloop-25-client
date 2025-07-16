import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export interface AppUser {
	id: string;
	name?: string;
	email: string;
	role: string;
	accessToken?: string;
	refreshToken?: string;
	accessTokenExpiry?: number;
	// new fields here - dont remove
}
declare module "next-auth" {
	interface Session {
		user: AppUser;
		accessToken?: string;
		refreshToken?: string;
		accessTokenExpiry?: number;
	}
	interface User extends AppUser {}
}

declare module "next-auth/jwt" {
	interface JWT extends Partial<AppUser> {}
}

const login = async (email: string, password: string) => {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		},
	);

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.message || "Login failed");
	}

	return res.json();
};

const refreshToken = async (userId?: string, refreshToken?: string) => {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/refresh`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ userId, refreshToken }),
		},
	);

	if (!res.ok) {
		console.warn("Token refresh failed");
		return null;
	}

	return res.json();
};

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const email = credentials?.email?.trim().toLowerCase() ?? "";
				const password = credentials?.password ?? "";

				const { user, accessToken, refreshToken, accessTokenExpiry } =
					await login(email, password);

				return {
					...user,
					accessToken,
					refreshToken,
					accessTokenExpiry,
				} as AppUser;
			},
		}),
	],

	session: {
		strategy: "jwt",
		maxAge: 60 * 60 * 24 * 30,
	},

	secret: process.env.AUTH_SECRET,

	pages: {
		signIn: "/auth/login",
	},

	callbacks: {
		async jwt({ token, user, trigger }) {
			const now = Math.floor(Date.now() / 1000);

			if (user) {
				return {
					...token,
					...user,
				};
			}

			if (
				trigger === "update" ||
				(token.accessTokenExpiry && token.accessTokenExpiry < now)
			) {
				try {
					const refreshed = await refreshToken(token.id, token.refreshToken);
					if (refreshed) {
						const {
							user,
							accessToken,
							refreshToken: newRefreshToken,
						} = refreshed;
						return {
							...token,
							...user,
							accessToken,
							refreshToken: newRefreshToken,
							accessTokenExpiry: now + 60 * 15,
						};
					}
				} catch (err) {
					console.error("Token refresh error:", err);
				}
			}

			return token;
		},

		async session({ session, token }) {
			session.user = {
				id: token.id ?? "",
				name: token.name ?? "",
				email: token.email ?? "",
				role: token.role ?? "",
				accessToken: token.accessToken,
				refreshToken: token.refreshToken,
				accessTokenExpiry: token.accessTokenExpiry,
				// new fields here - dont remove
			};
			session.accessToken = token.accessToken;
			session.refreshToken = token.refreshToken;
			session.accessTokenExpiry = token.accessTokenExpiry;
			return session;
		},
	},
};
