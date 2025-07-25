"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

export default function Toaster() {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		const checkDark = () =>
			setIsDark(document.documentElement.classList.contains("dark"));
		checkDark(); // first check on loading the page smh
		const observer = new MutationObserver(checkDark);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});

		return () => observer.disconnect();
	}, []);

	return (
		<ToastContainer
			position="bottom-right"
			theme={isDark ? "dark" : "light"}
			autoClose={3000}
			hideProgressBar={false}
			newestOnTop
			closeOnClick
			pauseOnFocusLoss
			draggable
			pauseOnHover
		/>
	);
}
