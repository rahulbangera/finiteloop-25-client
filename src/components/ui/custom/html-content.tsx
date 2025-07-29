"use client";

import { cn } from "@/lib/utils";

interface HTMLContentProps {
	content: string;
	className?: string;
}

export function HTMLContent({ content, className }: HTMLContentProps) {
	return (
		<div
			className={cn(
				"prose prose-xl dark:prose-invert max-w-none",
				"prose-headings:text-slate-900 dark:prose-headings:text-white",
				"prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:my-1 prose-p:text-lg",
				"prose-a:text-blue-600 dark:prose-a:text-blue-400",
				"prose-strong:text-slate-900 dark:prose-strong:text-white",
				"prose-ul:text-slate-700 dark:prose-ul:text-slate-300 prose-ul:my-2 prose-ul:text-lg",
				"prose-ol:text-slate-700 dark:prose-ol:text-slate-300 prose-ol:my-2 prose-ol:text-lg",
				"prose-li:my-0 prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-li:text-lg",
				"prose-blockquote:my-2 prose-blockquote:border-l-slate-300 dark:prose-blockquote:border-l-slate-600 prose-blockquote:text-base",
				"[&_ul]:!list-disc [&_ul]:!pl-5",
				"[&_ol]:!list-decimal [&_ol]:!pl-5",
				"[&_li]:!list-item",
				"[&_li>p]:!inline [&_li>p]:!m-0",
				"text-lg leading-relaxed",
				className,
			)}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: safe HTML from rich text editor
			dangerouslySetInnerHTML={{ __html: content }}
		/>
	);
}
