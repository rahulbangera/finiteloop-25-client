"use client";

import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PasswordProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Password = React.forwardRef<HTMLInputElement, PasswordProps>(
	({ className, ...props }, ref) => {
		const [showPassword, setShowPassword] = React.useState(false);

		return (
			<div className="relative">
				<Input
					type={showPassword ? "text" : "password"}
					className={cn(className)}
					ref={ref}
					{...props}
				/>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
					onClick={() => setShowPassword((prev) => !prev)}
				>
					{showPassword ? (
						<EyeOff className="h-4 w-4 text-white/60" />
					) : (
						<Eye className="h-4 w-4 text-white/60" />
					)}
				</Button>
			</div>
		);
	},
);
Password.displayName = "Password";

export { Password };
