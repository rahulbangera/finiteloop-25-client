"use client";

import { useEffect } from "react";
import gsap from "gsap";

export default function SnowballThrow() {
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			const { clientX, clientY } = e;

			// Container for this specific snowball interaction
			const throwContainer = document.createElement("div");
			throwContainer.style.position = "fixed";
			throwContainer.style.top = "0";
			throwContainer.style.left = "0";
			throwContainer.style.width = "100%";
			throwContainer.style.height = "100%";
			throwContainer.style.pointerEvents = "none";
			throwContainer.style.zIndex = "99999";

			document.body.appendChild(throwContainer);

			const snowball = document.createElement("div");
			snowball.style.width = "40px";
			snowball.style.height = "40px";
			snowball.style.borderRadius = "50%";
			snowball.style.background =
				"radial-gradient(circle at 30% 30%, #ffffff, #e6e6e6, #b0c4de)";
			snowball.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
			snowball.style.position = "absolute";
			snowball.style.transform = "translate(-50%, -50%)";

			const startX = window.innerWidth / 2 + (Math.random() * 400 - 200);
			const startY = window.innerHeight + 50;

			snowball.style.left = `${startX}px`;
			snowball.style.top = `${startY}px`;

			throwContainer.appendChild(snowball);

			const duration = 0.2 + Math.random() * 0.1;
			const tl = gsap.timeline({
				onComplete: () => {
					createSplash(clientX, clientY, throwContainer);
					snowball.remove();
				},
			});

			tl.to(snowball, {
				x: clientX - startX,
				y: clientY - startY,
				duration: duration,
				ease: "power2.out",
			});

			tl.to(
				snowball,
				{
					scale: 0.5,
					duration: duration,
					ease: "power1.in",
				},
				"<",
			);

			tl.to(
				snowball,
				{
					rotation: Math.random() * 360,
					duration: duration,
					ease: "none",
				},
				"<",
			);
		};

		const createSplash = (x: number, y: number, parent: HTMLElement) => {
			const particleCount = 12;
			for (let i = 0; i < particleCount; i++) {
				const particle = document.createElement("div");
				const size = 5 + Math.random() * 10;
				particle.style.width = `${size}px`;
				particle.style.height = `${size}px`;
				particle.style.borderRadius = "50%";
				particle.style.background = "white";
				particle.style.position = "absolute";
				particle.style.left = `${x}px`;
				particle.style.top = `${y}px`;
				particle.style.opacity = "0.8";
				particle.style.boxShadow = "0 0 5px rgba(255,255,255,0.8)";

				parent.appendChild(particle);

				const angle = Math.random() * Math.PI * 2;
				const velocity = 30 + Math.random() * 50;
				const targetX = Math.cos(angle) * velocity;
				const targetY = Math.sin(angle) * velocity;

				gsap.to(particle, {
					x: targetX,
					y: targetY,
					opacity: 0,
					scale: 0,
					duration: 0.4 + Math.random() * 0.3,
					ease: "power2.out",
					onComplete: () => {
						particle.remove();
					},
				});
			}

			setTimeout(() => {
				if (parent && parent.parentNode) {
					parent.parentNode.removeChild(parent);
				}
			}, 1000);
		};

		window.addEventListener("click", handleClick);

		return () => {
			window.removeEventListener("click", handleClick);
		};
	}, []);

	return null;
}
