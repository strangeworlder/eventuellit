"use client";

import React, { useCallback, useRef, useState } from "react";
import { FieldError } from "./FieldError";
import { FieldLabel } from "./FieldLabel";
import { Icon } from "./Icon";
import { cn } from "./utils";

export interface MediaItem {
	id: number;
	key: string;
	filename: string;
	width: number;
	height: number;
	context: string;
	/** Public URL to the optimized JPG (e.g. /images/slug-480.jpg) */
	thumbnailUrl: string;
	/** Full-size public URL */
	publicUrl: string;
}

export interface ImageFieldValue {
	url: string;
	mediaId: number;
}

export interface ImageFieldProps {
	/** Finnish label displayed above the field */
	label?: string;
	/** Validation error message */
	error?: string;
	/** Current image URL for preview */
	value?: string;
	/** Called when user selects or uploads an image */
	onChange: (result: ImageFieldValue) => void;
	/** Existing media items from the API */
	mediaItems?: MediaItem[];
	/** Whether media list is loading */
	mediaLoading?: boolean;
	/** Called when user selects a file — app handles the actual upload */
	onUpload?: (file: File) => Promise<ImageFieldValue>;
	/** Whether an upload is in progress */
	uploading?: boolean;
	/** Accepted file types */
	accept?: string;
	className?: string;
}

type Tab = "library" | "upload";

/**
 * Form field for selecting or uploading an image.
 * Provides two modes: picking from existing media library, or uploading a new file.
 * Designed to be API-agnostic — the consuming app injects upload logic via `onUpload`.
 *
 * @summary image picker/uploader form field with media library grid and drag-and-drop
 */
export function ImageField({
	label,
	error,
	value,
	onChange,
	mediaItems = [],
	mediaLoading = false,
	onUpload,
	uploading = false,
	accept = "image/*",
	className,
}: ImageFieldProps) {
	const [activeTab, setActiveTab] = useState<Tab>(
		mediaItems.length > 0 ? "library" : "upload",
	);
	const [isDragOver, setIsDragOver] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = useCallback(
		async (file: File) => {
			if (!onUpload) return;
			setUploadError(null);
			try {
				const result = await onUpload(file);
				onChange(result);
			} catch (err: any) {
				setUploadError(err?.message ?? "Lataus epäonnistui");
			}
		},
		[onUpload, onChange],
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) handleFileSelect(file);
			// Reset input so same file can be re-selected
			e.target.value = "";
		},
		[handleFileSelect],
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragOver(false);
			const file = e.dataTransfer.files[0];
			if (file) handleFileSelect(file);
		},
		[handleFileSelect],
	);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	}, []);

	const displayError = error || uploadError;

	return (
		<div className={cn("flex flex-col gap-2 mt-2 w-full", className)}>
			{label && <FieldLabel>{label}</FieldLabel>}

			{/* Preview */}
			{value && (
				<div className="relative overflow-hidden rounded-sm border-2 border-[var(--theme-border-medium)] bg-[var(--theme-bg)]">
					<img
						src={value}
						alt=""
						className="w-full h-40 object-cover"
						loading="lazy"
					/>
				</div>
			)}

			{/* Tab bar */}
			<div className="flex gap-1 border-b-2 border-[var(--theme-border-medium)]">
				<TabButton
					active={activeTab === "library"}
					onClick={() => setActiveTab("library")}
					disabled={mediaLoading && mediaItems.length === 0}
				>
					<Icon name="file-text" size={14} className="mr-1" />
					Mediakirjasto
				</TabButton>
				<TabButton
					active={activeTab === "upload"}
					onClick={() => setActiveTab("upload")}
				>
					<Icon name="upload" size={14} className="mr-1" />
					Lataa uusi
				</TabButton>
			</div>

			{/* Library tab */}
			{activeTab === "library" && (
				<div className="min-h-[120px]">
					{mediaLoading ? (
						<div className="flex items-center justify-center h-[120px] text-text-muted text-sm">
							<Icon name="loader2" size={16} className="mr-2 animate-spin" />
							Ladataan...
						</div>
					) : mediaItems.length === 0 ? (
						<div className="flex items-center justify-center h-[120px] text-text-muted text-sm">
							Ei kuvia mediakirjastossa
						</div>
					) : (
						<div className="grid grid-cols-3 tablet:grid-cols-4 gap-2 max-h-[280px] overflow-y-auto p-1">
							{mediaItems.map((item) => (
								<button
									key={item.id}
									type="button"
									onClick={() =>
										onChange({ url: item.publicUrl, mediaId: item.id })
									}
									className={cn(
										"relative overflow-hidden rounded-sm border-2 transition-all cursor-pointer group aspect-video",
										"bg-[var(--theme-bg)] hover:border-[var(--theme-primary)]",
										value === item.publicUrl
											? "border-[var(--theme-primary)] ring-2 ring-[var(--theme-primary)]/30"
											: "border-[var(--theme-border-medium)]",
									)}
								>
									<img
										src={item.thumbnailUrl}
										alt={item.filename}
										className="w-full h-full object-cover transition-transform group-hover:scale-105"
										loading="lazy"
									/>
									<div className="absolute inset-x-0 bottom-0 bg-black/60 px-1 py-0.5 text-white text-[10px] truncate opacity-0 group-hover:opacity-100 transition-opacity">
										{item.filename}
									</div>
								</button>
							))}
						</div>
					)}
				</div>
			)}

			{/* Upload tab */}
			{activeTab === "upload" && (
				<div
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onClick={() => fileInputRef.current?.click()}
					className={cn(
						"flex flex-col items-center justify-center gap-2 min-h-[120px] rounded-sm border-2 border-dashed cursor-pointer transition-all",
						isDragOver
							? "border-[var(--theme-primary)] bg-[var(--theme-surface-tint)]"
							: "border-[var(--theme-border-medium)] bg-[var(--theme-bg)] hover:border-[var(--theme-primary)]/60",
						uploading && "pointer-events-none opacity-60",
					)}
					role="button"
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							fileInputRef.current?.click();
						}
					}}
				>
					{uploading ? (
						<>
							<Icon
								name="loader2"
								size={24}
								className="text-[var(--theme-primary)] animate-spin"
							/>
							<span className="text-sm text-text-muted font-bold">
								Optimoidaan ja ladataan...
							</span>
						</>
					) : (
						<>
							<Icon
								name="upload"
								size={24}
								className="text-text-muted"
							/>
							<span className="text-sm text-text-muted font-bold">
								{isDragOver ? "Pudota tiedosto" : "Raahaa kuva tähän tai klikkaa"}
							</span>
							<span className="text-xs text-text-muted">
								PNG, JPG tai WebP — enintään 15 Mt
							</span>
						</>
					)}
					<input
						ref={fileInputRef}
						type="file"
						accept={accept}
						onChange={handleInputChange}
						className="hidden"
						tabIndex={-1}
					/>
				</div>
			)}

			{displayError && <FieldError>{displayError}</FieldError>}
		</div>
	);
}

function TabButton({
	active,
	onClick,
	disabled,
	children,
}: {
	active: boolean;
	onClick: () => void;
	disabled?: boolean;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={cn(
				"flex items-center px-3 py-2 text-sm font-bold transition-colors -mb-[2px] border-b-2",
				active
					? "text-[var(--theme-primary)] border-[var(--theme-primary)]"
					: "text-text-muted border-transparent hover:text-[var(--theme-text)] hover:border-[var(--theme-border-medium)]",
				disabled && "opacity-50 cursor-not-allowed",
			)}
		>
			{children}
		</button>
	);
}

ImageField.displayName = "ImageField";
