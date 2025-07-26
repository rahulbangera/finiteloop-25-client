"use client";
import type React from "react";
import { useEffect, useRef, useCallback } from "react";

interface ParticlesProps {
	className?: string;
	quantity?: number;
	vx?: number;
	vy?: number;
	color?: string;
}

function hexToRgb(hex: string): number[] {
	hex = hex.replace("#", "");
	if (hex.length === 3) {
		hex = hex
			.split("")
			.map((c) => c + c)
			.join("");
	}
	const bigint = parseInt(hex, 16);
	return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

interface Circle {
	x: number;
	y: number;
	size: number;
	alpha: number;
	targetAlpha: number;
	dx: number;
	dy: number;
	color: number[];
	twinkleFactor: number;
}

const Particles: React.FC<ParticlesProps> = ({
	className = "",
	quantity = 100,
	vx = 0,
	vy = 0,
	color = "#ffffff",
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const context = useRef<CanvasRenderingContext2D | null>(null);
	const circles = useRef<Circle[]>([]);
	const canvasSize = useRef({ w: 0, h: 0 });
	const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
	const rgbColor = hexToRgb(color);

	const resizeCanvas = useCallback(() => {
		if (!containerRef.current || !canvasRef.current || !context.current) return;
		circles.current.length = 0;
		canvasSize.current.w = containerRef.current.offsetWidth;
		canvasSize.current.h = containerRef.current.offsetHeight;
		canvasRef.current.width = canvasSize.current.w * dpr;
		canvasRef.current.height = canvasSize.current.h * dpr;
		canvasRef.current.style.width = `${canvasSize.current.w}px`;
		canvasRef.current.style.height = `${canvasSize.current.h}px`;
		context.current.scale(dpr, dpr);
	}, [dpr]);

	const circleParams = useCallback((): Circle => {
		const x = Math.random() * canvasSize.current.w;
		const y = Math.random() * canvasSize.current.h;
		const pSize = Math.random() * 2 + 1.5;
		const alpha = 0;
		const targetAlpha = parseFloat((Math.random() * 0.6 + 0.2).toFixed(2));
		const dx = (Math.random() - 0.5) * 0.5;
		const dy = (Math.random() - 0.5) * 0.5;
		return {
			x,
			y,
			size: pSize,
			alpha,
			targetAlpha,
			dx,
			dy,
			color: rgbColor,
			twinkleFactor: Math.random() * 0.005 + 0.002,
		};
	}, [rgbColor]);

	const drawCircle = useCallback(
		(circle: Circle, update = false) => {
			if (!context.current) return;
			const { x, y, size, alpha, color } = circle;
			context.current.save();
			context.current.beginPath();
			context.current.arc(x, y, size, 0, 2 * Math.PI);
			context.current.shadowColor = `rgba(${color.join(",")}, ${Math.max(alpha, 0.5)})`;
			context.current.shadowBlur = size * 8;
			context.current.fillStyle = `rgba(${color.join(",")}, ${alpha})`;
			context.current.fill();
			context.current.restore();
			context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
			if (!update) circles.current.push(circle);
		},
		[dpr],
	);

	const clearCanvas = useCallback(() => {
		context.current?.clearRect(
			0,
			0,
			canvasSize.current.w,
			canvasSize.current.h,
		);
	}, []);

	const animate = useCallback(() => {
		clearCanvas();
		circles.current.forEach((circle, i) => {
			circle.alpha += Math.sin(Date.now() * circle.twinkleFactor) * 0.01;
			circle.alpha = Math.max(0, Math.min(circle.alpha, circle.targetAlpha));
			circle.x += circle.dx + vx;
			circle.y += circle.dy + vy;
			drawCircle(circle, true);
			if (
				circle.x < -circle.size ||
				circle.x > canvasSize.current.w + circle.size ||
				circle.y < -circle.size ||
				circle.y > canvasSize.current.h + circle.size
			) {
				circles.current.splice(i, 1);
				drawCircle(circleParams());
			}
		});
		requestAnimationFrame(animate);
	}, [clearCanvas, drawCircle, circleParams, vx, vy]);

	const initCanvas = useCallback(() => {
		resizeCanvas();
		for (let i = 0; i < quantity; i++) drawCircle(circleParams());
	}, [resizeCanvas, drawCircle, circleParams, quantity]);

	useEffect(() => {
		if (canvasRef.current) {
			context.current = canvasRef.current.getContext("2d");
		}
		initCanvas();
		animate();
		window.addEventListener("resize", initCanvas);
		return () => window.removeEventListener("resize", initCanvas);
	}, [initCanvas, animate]);

	return (
		<div className={className} ref={containerRef} aria-hidden="true">
			<canvas ref={canvasRef} className="size-full" />
		</div>
	);
};

export default Particles;
