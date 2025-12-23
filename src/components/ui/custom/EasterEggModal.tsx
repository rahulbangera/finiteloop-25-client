import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Coin3D from "./flcCoin";

interface EasterEggModalProps {
	isOpen: boolean;
	onClose: () => void;
	alreadyClaimed?: boolean;
	onToggleClaimed?: () => void;
	flcPoints?: number;
	errorMessage?: string;
}

const EasterEggModal: React.FC<EasterEggModalProps> = ({
	isOpen,
	onClose,
	alreadyClaimed = false,
	errorMessage = "",
	flcPoints = 5,
}) => {
	const [show, setShow] = useState(isOpen);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	useEffect(() => {
		if (isOpen) {
			setShow(true);
		} else {
			const timer = setTimeout(() => setShow(false), 300);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	if (!mounted) return null;

	const modalContent = (
		<div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
			{/** biome-ignore lint/a11y/noStaticElementInteractions: <its fine> */}
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: <its fine> */}
			<div
				className={`fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
				onClick={onClose}
			/>

			<div
				className={`relative w-full max-w-md transform overflow-hidden rounded-2xl bg-[radial-gradient(at_top_right,#33107C,#060329)] border border-[#7F439D]/30 p-6 text-left align-middle shadow-2xl transition-all duration-300 flex flex-col items-center ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
			>
				<div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-[#7F439D] via-[#FBCFF4] to-[#7F439D]" />

				<h3 className="lilita-font text-3xl font-bold leading-6 text-white mb-2 text-center mt-4 tracking-wide drop-shadow-lg">
					{alreadyClaimed
						? "Easter Egg Already Found!"
						: "🎉 Easter Egg Discovered!"}
				</h3>

				<div className="mt-4 flex flex-col items-center w-full">
					<p
						className={`comic-font text-xl text-gray-300 text-center ${errorMessage.trim() !== "" ? "" : "mb-2"}`}
					>
						{errorMessage.trim() !== ""
							? ""
							: alreadyClaimed
								? "You have already claimed the reward for this Easter Egg. Keep exploring for more!"
								: "Congratulations! You've found a hidden Easter Egg and earned FLC Points!"}
					</p>

					<div className="relative py-4">
						<Coin3D />
					</div>
					<div className="mt-4 text-center">
						{errorMessage.trim() !== "" ? (
							<p className="comic-font text-lg text-yellow-300 text-center">
								{errorMessage}
							</p>
						) : alreadyClaimed ? (
							<p className="comic-font text-2xl font-bold text-gray-400 mb-1">
								Reward Already Claimed
							</p>
						) : (
							<>
								<p className="comic-font text-2xl font-bold text-flc-yellow mb-1">
									+ {flcPoints} FLC Points
								</p>
								<p className="comic-font text-sm text-gray-400">
									Added to your profile
								</p>
							</>
						)}
					</div>
				</div>

				<div className="mt-8 w-full space-y-3">
					<button
						type="button"
						className="w-full inline-flex justify-center rounded-lg border border-transparent bg-white px-4 py-3 text-lg font-bold text-black hover:bg-gray-200 focus:outline-none focus:visible:ring-2 focus:visible:ring-blue-500 focus:visible:ring-offset-2 transition-colors cursor-pointer comic-font uppercase tracking-wider"
						onClick={onClose}
					>
						Awesome!
					</button>
				</div>
			</div>
		</div>
	);

	return show ? createPortal(modalContent, document.body) : null;
};

export default EasterEggModal;
