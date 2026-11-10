import { Loader2Icon } from 'lucide-react';
import React from 'react'

const Loading = ({ className = "", size = "md", fullScreen = false, inline = false }) => {


    const sizeMap = {
        xs: "size-4",
        sm: "size-6",
        md: "size-8"
    };


    const sizeClass = sizeMap[size] || sizeMap.md;

    if (inline) {
        return <Loader2Icon className={`${sizeClass} animate-spin ${className || "text-current"}`} />
    }

    if (fullScreen) {
        return (
            <div className={`min-h-screen flex items-center justify-center bg-slate-50 ${className}`}>
                <Loader2Icon className={`${sizeClass} animate-spin text-red-600`} />
            </div>
        )

    }



    return (
        <div className={` flex items-center justify-center ${className || "py-24"}`}>
                <Loader2Icon className={`${sizeClass} animate-spin text-red-600`} />
            </div>
    )
}

export default Loading