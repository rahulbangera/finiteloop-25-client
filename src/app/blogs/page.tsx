"use client";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Drawer } from "vaul";

// Example blogs prop (replace with actual data fetching)
const blogs: ({
	User: {
		name: string;
		id: number;
		email: string;
	};
} & {
	id: string;
	slug: string | null;
	image: string | null;
	createdAt: Date;
	updatedAt: Date;
	userId: number;
	title: string;
	description: string;
	content: string;
	readTime: number;
	words: number;
	blogState: string;
	reviewState: string;
	feedback: string | null;
})[] = [];

type Blog = (typeof blogs)[number];

export default function BlogsPage() {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
	const [drawerDirection, setDrawerDirection] = useState<"right" | "bottom">(
		"right",
	);

	useEffect(() => {
		const checkMobile = () => {
			const mobile = window.matchMedia("(max-width: 767px)").matches;
			setDrawerDirection(mobile ? "bottom" : "right");
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	return (
		<main className="min-h-screen mb-16 p-4 md:p-6">
			<h1 className="lilith-font text-6xl md:text-7xl lg:text-8xl font-extrabold text-flc-yellow mb-2 mt-32 md:mt-20 text-center lilita-font">
				BLOGS
			</h1>
			<p className="text-base sm:text-lg text-purple-900 dark:text-purple-100 mb-8 md:mb-12 text-center">
				Welcome to the blogs page. Explore our latest articles!
			</p>
			<div className="flex justify-center items-center mb-6">
				<div className="min-h-screen w-full grid justify-center items-start grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-2 md:mt-5 md:px-0">
					{blogs.map((blog) => (
						<button
							type="button"
							key={blog.id}
							onClick={() => {
								setSelectedBlog(blog);
								setDrawerOpen(true);
							}}
							aria-label={`Read blog: ${blog.title}`}
							className="group text-left h-96 w-[90%] rounded-xl md:rounded-2xl bg-white dark:bg-gradient-to-br dark:from-purple-700 dark:to-indigo-900 shadow-lg hover:scale-[1.03] transition-all cursor-pointer flex flex-col overflow-hidden border border-purple-100 dark:border-indigo-800 focus:outline-none"
						>
							{blog.image && (
								<Image
									src={blog.image}
									alt={blog.title}
									width={400}
									height={100}
									className="h-auto w-full object-cover rounded-t-xl md:rounded-t-2xl"
									style={{ width: "100%" }}
									priority
								/>
							)}

							<div className="p-3 md:p-4 flex flex-col flex-1">
								<h2 className="text-base sm:text-lg font-bold text-purple-900 dark:text-purple-100 mb-1 lilita-font">
									{blog.title}
								</h2>
								<p className="text-purple-800 dark:text-purple-200 mb-2 flex-1 comic-font text-xs sm:text-sm">
									{`${blog.description.slice(0, 70)}...`}
								</p>
								<div className="flex items-center justify-between mt-auto">
									<span className="text-xs text-purple-500 dark:text-purple-200">
										{blog.User.name}
									</span>
									<span className="text-xs text-purple-400 dark:text-purple-300">
										{new Date(blog.createdAt).toLocaleDateString()}
									</span>
								</div>
							</div>
						</button>
					))}
				</div>
			</div>

			{/* Drawer for blog details */}
			<Drawer.Root
				open={drawerOpen && !!selectedBlog}
				onOpenChange={setDrawerOpen}
				direction={drawerDirection}
				modal
			>
				<Drawer.Portal>
					<Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
					<Drawer.Content
						className={`
							fixed
							${
								drawerDirection === "right"
									? "top-0 right-0 h-full w-full sm:w-[420px] md:w-[550px] max-w-full rounded-l-2xl md:rounded-l-3xl border-l border-purple-200 dark:border-indigo-800"
									: "bottom-0 left-0 w-full h-[80vh] rounded-t-2xl md:rounded-t-3xl border-t border-purple-200 dark:border-indigo-800"
							}
							bg-[radial-gradient(at_top_right,_#FBCFF4,_#E4CCF8,_#C4E2F7,_#FEF9FF)] dark:bg-[radial-gradient(at_top_right,_#7F439D,_#33107C,_#060329)]
							shadow-2xl z-50 flex flex-col transition-transform overflow-hidden
						`}
						style={{ maxHeight: "100vh" }}
					>
						<Drawer.Title asChild>
							<VisuallyHidden>{selectedBlog?.title}</VisuallyHidden>
						</Drawer.Title>
						<div
							className={`flex flex-col gap-4 md:gap-6 px-3 md:px-4 pb-6 md:pb-8 overflow-y-auto flex-1 ${
								drawerDirection === "bottom" ? "pt-2" : "pt-6 md:pt-8"
							}`}
						>
							<h2 className="lilita-font text-2xl sm:text-3xl md:text-4xl font-bold text-purple-900 dark:text-purple-100 break-words text-center">
								{selectedBlog?.title}
							</h2>
							{selectedBlog?.image && (
								<div className="flex justify-center">
									<Image
										src={selectedBlog.image}
										alt={selectedBlog.title}
										width={600}
										height={208}
										className="rounded-xl h-32 sm:h-40 md:h-52 object-cover w-5/6 sm:w-3/4 md:w-2/3 border border-purple-100 dark:border-indigo-800 shadow"
										style={{ width: "100%", height: "auto" }}
									/>
								</div>
							)}
							<p className="comic-font text-purple-900 dark:text-purple-100 text-sm sm:text-md md:text-lg whitespace-pre-line break-words leading-relaxed">
								{selectedBlog?.content}
							</p>
							<div className="flex justify-between items-center text-purple-700 dark:text-purple-200 text-xs sm:text-sm mt-2">
								<span>By {selectedBlog?.User.name}</span>
								<span>
									{selectedBlog &&
										new Date(selectedBlog.createdAt).toLocaleDateString()}
								</span>
							</div>
							<button
								type="button"
								className="mt-4 md:mt-6 px-4 py-2 rounded-xl bg-purple-200 dark:bg-indigo-700 text-purple-900 dark:text-purple-100 font-semibold hover:bg-purple-300 dark:hover:bg-indigo-600 transition"
								onClick={() => setDrawerOpen(false)}
							>
								Close
							</button>
						</div>
					</Drawer.Content>
				</Drawer.Portal>
			</Drawer.Root>
		</main>
	);
}
