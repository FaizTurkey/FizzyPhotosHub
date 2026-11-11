import React, { useState, useEffect } from "react";
import { X, ChevronLeftIcon, ChevronRightIcon, StarIcon, InfoIcon, Download, Trash2, FolderPlus, Calendar, HardDrive, Maximize2, Film, SparkleIcon } from "lucide-react";
import {Video} from '@imagekit/react'

const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

export const PhotoLightbox = ({ photos, currentPhoto, onClose, onToggleFavorite, onTrashPhoto, onAddToAlbum }) => {
    const [showInfo, setShowInfo] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);

    useEffect(() => {
        if (currentPhoto) {
            const idx = photos.findIndex((p) => p._id === currentPhoto._id);
            setCurrentIndex(idx >= 0 ? idx : 0);
        }
    }, [currentPhoto, photos]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") handlePrev();
            if (e.key === "ArrowRight") handleNext();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex, photos]);

    if (!currentPhoto || currentIndex < 0 || !photos[currentIndex]) {
        return null;
    }

    const activePhoto = photos[currentIndex];

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
    };

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = activePhoto.url;
        link.download = `${activePhoto.title || "photo"}.${activePhoto.format || "jpg"}`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formattedSize = activePhoto.size ? `${(activePhoto.size / (1024 * 1024)).toFixed(2)} MB` : "Unknown";

    const formattedDate = new Date(activePhoto.createdAt).toLocaleDateString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });

    return (
        <div className="lightbox-backdrop">
            {/* Top Toolbar */}
            <div className="lightbox-toolbar">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition cursor-pointer text-white" title="Close (Esc)">
                        <X className="size-5" />
                    </button>
                    <div className="min-w-0">
                        <h3 className="text-sm font-semibold truncate max-w-35 sm:max-w-50
                         md:max-w-sm">{activePhoto.title}</h3>
                        <p className="text-[11px] text-white/70">
                            {currentIndex + 1} of {photos.length}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => onToggleFavorite(activePhoto._id)} className={`lightbox-btn ${activePhoto.isFavorite ? "bg-amber-400 text-slate-900" : ""}`} title="Favorite">
                        <StarIcon className={`size-5 ${activePhoto.isFavorite ? "fill-slate-900" : ""}`} />
                    </button>

                    {onAddToAlbum && (
                        <button onClick={() => onAddToAlbum(activePhoto)} className="lightbox-btn" title="Add to Album">
                            <FolderPlus className="size-5" />
                        </button>
                    )}

                    <button onClick={handleDownload} className="lightbox-btn" title="Download">
                        <Download className="size-5" />
                    </button>

                    <button onClick={() => setShowInfo(!showInfo)} className={`lightbox-btn ${showInfo ? "bg-white/30" : ""}`} title="Photo details">
                        <InfoIcon className="size-5" />
                    </button>

                    <button
                        onClick={() => {
                            onTrashPhoto(activePhoto._id);
                            if (photos.length > 1) {
                                handleNext();
                            } else {
                                onClose();
                            }
                        }}
                        className="lightbox-btn hover:bg-rose-500/80!"
                        title="Move to trash"
                    >
                        <Trash2 className="size-5" />
                    </button>
                </div>
            </div>

            {/* Central Viewing Stage */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                {/* Previous button */}
                {photos.length > 1 && (
                    <button onClick={handlePrev} className="lightbox-nav-btn left-4" title="Previous photo">
                        <ChevronLeftIcon className="size-6" />
                    </button>
                )}

                {/* Media Display */}
                <div className="size-full p-4 flex items-center justify-center">
                    {activePhoto.mediaType === "video" || activePhoto.format === "mp4" || activePhoto.format === "mov" || activePhoto.format === "webm" || activePhoto.url?.endsWith(".mp4") ? (
                        <div key={activePhoto._id} className="w-full max-w-4xl max-h-[82vh] flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl bg-black">

                            <Video urlEndpoint={urlEndpoint} src={activePhoto.url} poster={activePhoto.thumbnailUrl || undefined} controls={true} autoPlay={true} playsInline={true} className="max-w-full max-h-[80vh] rounded-xl outline-none" />
                        </div>
                    ) : (
                        <img key={activePhoto._id} src={activePhoto.url} alt={activePhoto.title} className="max-w-full max-h-full object-contain rounded-lg transition-all duration-200" />
                    )}
                </div>

                {/* Next button */}
                {photos.length > 1 && (
                    <button onClick={handleNext} className="lightbox-nav-btn right-4" title="Next">
                        <ChevronRightIcon className="size-6" />
                    </button>
                )}

                {/* Details Drawer */}
                {showInfo && (
                    <aside className="lightbox-drawer">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <h4 className="text-slate-800">Media Details</h4>
                            <button onClick={() => setShowInfo(false)} className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer">
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="space-y-5 pt-4 text-sm">
                            <div className="flex gap-2">
                                <span className="text-sm text-slate-500">Title :</span>
                                <p className="text-slate-800 mt-0.5">{activePhoto.title}</p>
                            </div>

                            <div className="flex items-start gap-3">
                                <Film className="size-4 text-orange-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-xs text-slate-500">Media Type</span>
                                    <p className="text-slate-700 text-xs mt-0.5 capitalize">{activePhoto.mediaType || (activePhoto.url?.endsWith(".mp4") ? "Video" : "Photo")}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="size-4 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-xs text-slate-500">Date & Time</span>
                                    <p className="text-slate-700 text-xs mt-0.5">{formattedDate}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <HardDrive className="size-4 text-orange-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-xs text-slate-500">File Size & Format</span>
                                    <p className="text-slate-700 text-xs mt-0.5 capitalize">
                                        {formattedSize} - <span>{activePhoto.mediaType}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Maximize2 className="size-4 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-xs text-slate-500">Dimensions</span>
                                    <p className="text-slate-700 text-xs mt-0.5">
                                        {activePhoto.width || 1920} x {activePhoto.height || 1080} px
                                    </p>
                                </div>
                            </div>

                            {activePhoto.objects && activePhoto.objects.length > 0 && (
                                <div className="flex items-start gap-3">
                                    <SparkleIcon className="size-4 text-orange-600 shrink-0" />
                                    <div>
                                        <p className="text-xs text-slate-500">Image Objects</p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {activePhoto.objects.map((obj, i) => (
                                                <span key={i} className="px-2 py-0.5 border border-orange-100 bg-orange-50 text-orange-700 rounded text-xs">
                                                    {obj}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
};
