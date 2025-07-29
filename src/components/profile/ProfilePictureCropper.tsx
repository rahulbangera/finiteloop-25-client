"use client";
import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Cropper from "react-easy-crop";
import { Button } from "../ui/button";

interface Area {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface CroppedAreaPixels {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface ProfilePictureCropperProps {
	isOpen: boolean;
	onClose: () => void;
	imageSrc: string | null;
	onUpload: (croppedImage: string) => void;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.setAttribute("crossOrigin", "anonymous");
		image.src = url;
	});

const getCroppedImg = async (
	imageSrc: string,
	pixelCrop: CroppedAreaPixels,
): Promise<string> => {
	const image = await createImage(imageSrc);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		throw new Error("No 2d context");
	}

	canvas.width = pixelCrop.width;
	canvas.height = pixelCrop.height;

	ctx.drawImage(
		image,
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height,
		0,
		0,
		pixelCrop.width,
		pixelCrop.height,
	);

	return new Promise((resolve) => {
		canvas.toBlob((blob) => {
			if (!blob) {
				throw new Error("Canvas is empty");
			}
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onload = () => resolve(reader.result as string);
		}, "image/jpeg");
	});
};

export default function ProfilePictureCropper({
	isOpen,
	onClose,
	imageSrc,
	onUpload,
}: ProfilePictureCropperProps) {
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] =
		useState<CroppedAreaPixels | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	useEffect(() => {
		if (isOpen) {
			const originalStyle = window.getComputedStyle(document.body).overflow;
			document.body.style.overflow = "hidden";
			document.body.style.position = "fixed";
			document.body.style.width = "100%";
			document.body.style.top = "0";

			return () => {
				document.body.style.overflow = originalStyle;
				document.body.style.position = "";
				document.body.style.width = "";
				document.body.style.top = "";
			};
		}
	}, [isOpen]);

	const onCropComplete = useCallback(
		(_croppedArea: Area, croppedAreaPixels: CroppedAreaPixels) => {
			setCroppedAreaPixels(croppedAreaPixels);
		},
		[],
	);

	const handleUpload = async () => {
		if (!imageSrc || !croppedAreaPixels) return;

		setIsProcessing(true);
		try {
			const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
			onUpload(croppedImage);
			onClose();
		} catch (error) {
			console.error("Error cropping image:", error);
		} finally {
			setIsProcessing(false);
		}
	};

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	const handleBackdropTouchMove = (e: React.TouchEvent) => {
		if (e.target === e.currentTarget) {
			e.preventDefault();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			onClose();
		}
	};

	if (!isOpen || !imageSrc) return null;

	const modalContent = (
		<div
			className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-lg p-2 sm:p-4 touch-none"
			style={{ zIndex: 99999, position: "fixed" }}
			onClick={handleBackdropClick}
			onTouchMove={handleBackdropTouchMove}
			onKeyDown={handleKeyDown}
			role="dialog"
			aria-modal="true"
			aria-labelledby="crop-modal-title"
			tabIndex={-1}
		>
			<div className="bg-gradient-to-br from-neutral-900/95 via-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-600/50 rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-2xl max-h-[95vh] flex flex-col overflow-hidden touch-auto">
				{/* Header */}
				<div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-700/50 flex-shrink-0">
					<h2
						id="crop-modal-title"
						className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
					>
						Crop Profile Picture
					</h2>
					<button
						type="button"
						className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-neutral-700/50 hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-all duration-200"
						onClick={onClose}
						aria-label="Close"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							className="w-4 h-4 sm:w-5 sm:h-5"
						>
							<title>Close</title>
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				</div>

				<div className="relative bg-black rounded-lg mx-2 sm:mx-4 mt-2 sm:mt-4 flex-1 min-h-0">
					<div className="relative w-full h-full min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
						<Cropper
							image={imageSrc}
							crop={crop}
							zoom={zoom}
							aspect={1}
							onCropChange={setCrop}
							onCropComplete={onCropComplete}
							onZoomChange={setZoom}
							cropShape="round"
							showGrid={false}
							style={{
								containerStyle: {
									borderRadius: "0.5rem",
									width: "100%",
									height: "100%",
								},
							}}
						/>
					</div>
				</div>

				<div className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-shrink-0">
					<div className="space-y-2">
						<label
							htmlFor="zoom-slider"
							className="flex items-center justify-between text-sm font-medium text-gray-300"
						>
							<span>Zoom</span>
							<span className="text-xs text-gray-400 bg-neutral-700/50 px-2 py-1 rounded">
								{Math.round(zoom * 100)}%
							</span>
						</label>
						<input
							id="zoom-slider"
							type="range"
							value={zoom}
							min={1}
							max={3}
							step={0.1}
							onChange={(e) => setZoom(Number(e.target.value))}
							className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
						/>
					</div>

					<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 border border-neutral-600 bg-transparent text-gray-300 hover:bg-neutral-700/50 hover:border-neutral-500 transition-all duration-200"
						>
							Cancel
						</Button>
						<Button
							type="button"
							onClick={handleUpload}
							disabled={isProcessing}
							className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-medium hover:from-orange-600 hover:to-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-orange-500/25"
						>
							{isProcessing ? (
								<>
									<svg
										className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<title>Loading</title>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Processing...
								</>
							) : (
								"Upload"
							)}
						</Button>
					</div>
				</div>
			</div>

			<style jsx>{`
        .slider {
          background: linear-gradient(to right, #374151 0%, #374151 100%);
        }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316, #eab308);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
          transition: all 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316, #eab308);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
          transition: all 0.2s ease;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2);
        }

        .slider:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
        }

        .slider::-webkit-slider-track {
          background: linear-gradient(to right, #4b5563, #6b7280);
          border-radius: 4px;
          height: 6px;
        }

        .slider::-moz-range-track {
          background: linear-gradient(to right, #4b5563, #6b7280);
          border-radius: 4px;
          height: 6px;
          border: none;
        }

        @media (max-width: 640px) {
          .slider::-webkit-slider-thumb {
            height: 20px;
            width: 20px;
          }
          
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
          }
        }
      `}</style>
		</div>
	);

	return typeof document !== "undefined"
		? createPortal(modalContent, document.body)
		: null;
}
