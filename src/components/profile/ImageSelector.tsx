"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "../ui/button";

interface ImageSelectorProps {
	isOpen: boolean;
	onClose: () => void;
	onImageSelect: (imageSrc: string) => void;
	currentImage?: string | null;
}

export default function ImageSelector({
	isOpen,
	onClose,
	onImageSelect,
	currentImage,
}: ImageSelectorProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	const handleFileSelect = (file: File) => {
		if (file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target?.result as string;
				onImageSelect(result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleFileSelect(file);
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files?.[0];
		if (file) {
			handleFileSelect(file);
		}
	};

	const handleEditCurrent = () => {
		if (currentImage) {
			onImageSelect(currentImage);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-lg p-4">
			<div className="bg-gradient-to-br from-neutral-900/95 via-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-600/50 rounded-2xl shadow-2xl w-full max-w-md relative">
				<div className="flex items-center justify-between p-6 border-b border-neutral-700/50">
					<h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
						Profile Picture
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

				<div className="p-6 space-y-4">
					{currentImage && (
						<div className="text-center">
							<div className="mb-4">
								<Image
									src={currentImage}
									alt="Current profile"
									width={80}
									height={80}
									className="w-20 h-20 rounded-full border-2 border-orange-400 object-cover mx-auto"
								/>
							</div>
							<Button
								type="button"
								onClick={handleEditCurrent}
								className="w-full mb-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
							>
								Edit Current Image
							</Button>
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-neutral-600"></div>
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="px-2 bg-neutral-800 text-gray-400">or</span>
								</div>
							</div>
						</div>
					)}

					<button
						type="button"
						className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer w-full ${
							isDragging
								? "border-orange-400 bg-orange-400/10"
								: "border-neutral-600 hover:border-orange-400 hover:bg-orange-400/5"
						}`}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						onClick={() => fileInputRef.current?.click()}
					>
						<div className="flex flex-col items-center space-y-3">
							<div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full flex items-center justify-center">
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="white"
									strokeWidth="2"
								>
									<title>Upload</title>
									<path d="M14.5 3a1 1 0 0 1 .7.3l7 7a1 1 0 0 1 0 1.4l-7 7a1 1 0 0 1-1.4-1.4L19.6 11H3a1 1 0 1 1 0-2h16.6l-5.8-5.8A1 1 0 0 1 14.5 3z"></path>
								</svg>
							</div>
							<div>
								<p className="text-white font-medium">
									{currentImage ? "Upload New Image" : "Upload Profile Picture"}
								</p>
								<p className="text-sm text-gray-400 mt-1">
									Drag and drop or click to browse
								</p>
								<p className="text-xs text-gray-500 mt-1">
									PNG, JPG, GIF up to 10MB
								</p>
							</div>
						</div>
					</button>

					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleFileInputChange}
						className="hidden"
					/>

					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						className="w-full border border-neutral-600 bg-transparent text-gray-300 hover:bg-neutral-700/50 hover:border-neutral-500 transition-all duration-200"
					>
						Cancel
					</Button>
				</div>
			</div>
		</div>
	);
}
