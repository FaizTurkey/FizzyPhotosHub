import { CheckIcon, PlayIcon, StarIcon, XIcon } from 'lucide-react';
import React, { useState } from 'react'

const PhotoCard = ({photo , isSelected , onToggleSelect , onToggleFavorite , onClick, onRemoveFromAlbum}) => {

    const [imgLoaded,setImgLoaded] = useState(false);
    const isVideo = photo.mediaType === "video" || photo.format === "mp4" || photo.format === "mov" || photo.format === "webm" || photo.url?.endsWith(".mp4");




  return (
    <div
    onClick={onClick}
    className='group photo-card-container photo-card-hover'>
        {/* Aspect Ratio Container  */}
        <div className='aspect-4/3 w-full relative overflow-hidden bg-slate-100'>
        {!imgLoaded && <div className='absolute inset-0 bg-slate-200/80 animate-pulse flex items-center justify-center text-xs text-slate-400'>Loading....</div>}

        <img src={photo.thumbnailUrl || photo.url} alt={photo.title} loading='lazy' onLoad={() => setImgLoaded(true)} className={`photo-card-img ${imgLoaded ? "opacity-100" : "opacity-0"}`} />

        {/* Video Badge (Bottom Right)  */}

        {isVideo && (
            <div className='photo-card-video-badge'>
                <PlayIcon className='size-2.5 fill-white'/>
                <span>Video</span>
            </div>
        )}

        <div className='photo-card-overlay'/>

        <button
        onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(e);
        }}
        className={`photo-card-select-btn ${isSelected ? "photo-card-select-active" : "photo-card-select-inactive"}`}
        >
            <CheckIcon className={`size-3.5 ${isSelected ? "stroke-3" : ""}`}/>
        </button>


        <div className='absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10'>
                {onRemoveFromAlbum && (
                    <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromAlbum(e);
                    }}
                    className='photo-card-action-btn hover:text-red-600!' title='Remove from album'
                    >
                        <XIcon className='size-3.5'/>
                    </button>
                )}

                <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(e);
                }}
                className={photo.isFavorite ? "photo-card-favorite-active" : "photo-card-favorite-inactive"} title={photo.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                    <StarIcon className={`size-3.5 ${photo.isFavorite ? "fill-amber-400 stroke-amber-50" : ""}`}/>
                </button>
        </div>

                <div className='photo-card-title'>
                    {photo.title}
                </div>


        </div>
    </div>
  )
}

export default PhotoCard