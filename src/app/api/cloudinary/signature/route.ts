import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { userId } = body;

		if (!userId) {
			return NextResponse.json(
				{ success: false, message: "User ID is required" },
				{ status: 400 },
			);
		}

		const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
		const apiKey = process.env.CLOUDINARY_API_KEY;
		const apiSecret = process.env.CLOUDINARY_API_SECRET;

		if (!cloudName || !apiKey || !apiSecret) {
			return NextResponse.json(
				{ success: false, message: "Cloudinary configuration missing" },
				{ status: 500 },
			);
		}

		const timestamp = Math.round(Date.now() / 1000);
		const publicId = `profile_${userId}_${timestamp}`;

		const params = {
			timestamp: timestamp,
			public_id: publicId,
			folder: "profile_pictures",
			transformation: "w_400,h_400,c_fill,q_auto",
			overwrite: true,
		};

		const signature = cloudinary.utils.api_sign_request(params, apiSecret);

		return NextResponse.json({
			success: true,
			signature,
			timestamp,
			publicId,
			cloudName,
			apiKey,
			folder: "profile_pictures",
		});
	} catch (error) {
		console.error("Error generating Cloudinary signature:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to generate upload signature",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
