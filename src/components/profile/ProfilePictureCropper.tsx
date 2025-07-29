"use client";
import { useState, useCallback } from "react";
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

	if (!isOpen || !imageSrc) return null;

	return (
		<div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-lg p-4">
			<div className="bg-gradient-to-br from-neutral-900/95 via-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-600/50 rounded-2xl shadow-2xl w-full max-w-2xl relative">
				<div className="flex items-center justify-between p-6 border-b border-neutral-700/50">
					<h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
						Crop Profile Picture
					</h2>
					<button
						type="button"
						className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-700/50 hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-all duration-200"
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
						>
							<title>Close</title>
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				</div>

				<div className="relative h-96 bg-black rounded-lg m-4">
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
							},
						}}
					/>
				</div>

				<div className="p-6 space-y-4">
					<div>
						<label
							htmlFor="zoom-slider"
							className="block text-sm font-medium text-gray-300 mb-2"
						>
							Zoom
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

					<div className="flex gap-3 justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="px-6 py-2 border border-neutral-600 bg-transparent text-gray-300 hover:bg-neutral-700/50 hover:border-neutral-500 transition-all duration-200"
						>
							Cancel
						</Button>
						<Button
							type="button"
							onClick={handleUpload}
							disabled={isProcessing}
							className="px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-medium hover:from-orange-600 hover:to-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
						>
							{isProcessing ? "Processing..." : "Upload"}
						</Button>
					</div>
				</div>
			</div>

			<style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #f97316, #eab308);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #f97316, #eab308);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      `}</style>
		</div>
	);
}
