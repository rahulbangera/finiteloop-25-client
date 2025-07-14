import { z } from "zod";

export const loginZ = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpZ = z
	.object({
		name: z.string().min(2, "Name must be at least 2 characters"),
		email: z.string().email("Please enter a valid email address"),
		usn: z.string().min(1, "USN is required"),
		phone: z.string().length(10, "Phone number must be 10 digits"),
		branchId: z.string().min(1, "Please select a branch"),
		year: z.string().min(1, "Please select graduation year"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z
			.string()
			.min(8, "Password must be at least 6 characters"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export const sendPasswordResetZ = z.object({
	email: z.string().email("Please enter a valid email address"),
});
