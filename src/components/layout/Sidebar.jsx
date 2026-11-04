import { FolderHeartIcon, HardDriveIcon, ImageIcon, PlusIcon, StarIcon, Trash2Icon, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { DUMMY_STATS } from '../../assets/assets';

const Sidebar = ({ onCreateAlbumClick, onUploadClick, isMobileOpen = false, onCloseMobile }) => {


    const [stats, setStats] = useState(null);

    const fetchStats = async () => {
        setStats(DUMMY_STATS)
    }

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 15000);
        return () => clearInterval(interval);
    }, [])

    const storageUsed = stats?.totalBytes ? (stats.totalBytes / (1024 * 1024)).toFixed(1) : "0.0";

    const storagePercent = stats?.totalBytes ? Math.min(100, Math.max(3, Math.round((stats.totalBytes / (100 * 1024 * 1024)) * 100))) : 2;



    const navLinks = [
        { to: "/", label: "Photos & Videos", icon: ImageIcon },
        { to: "/favorites", label: "Favorites", icon: StarIcon },
        { to: "/albums", label: "Albums", icon: FolderHeartIcon },
        { to: "/trash", label: "Trash", icon: Trash2Icon },
    ]


    const handleUploadClick = () => {
        onCloseMobile?.();
        onUploadClick?.();
    }

    const handleCreateAlbumClick = () => {
        onCloseMobile?.();
        onCreateAlbumClick?.();
    }


    return (
        <>
            {/* Mobile Backdrop  */}
            {isMobileOpen && <div className='sidebar-backdrop ' onClick={onCloseMobile} />}

            <aside className={`sidebar-container ${isMobileOpen ? "sidebar-mobile-open" : "sidebar-mobile-closed"}`}>
                {/* Header  */}
                <div className='sidebar-mobile-header'>
                    <div className='flex items-center gap-2.5'>
                        <img src="/logo.png" alt="Logo" className='size-7' />
                        <span className='font-heading font-semibold text-slate-800 tracking-tight text-base'>MY PHOTOS</span>
                    </div>
                    <button className='sidebar-close-btn' onClick={onCloseMobile}>
                        <XIcon className='size-5' />
                    </button>

                </div>

                {/* Main Navigation  */}

                <div className='space-y-6'>
                    <div className='space-y-2'>
                        <button onClick={handleUploadClick} className='sidebar-action-btn'>
                            <PlusIcon className='size-4' />
                            <span>Upload Photos</span>
                        </button>
                        <button onClick={handleCreateAlbumClick} className='sidebar-action-btn'>
                            <FolderHeartIcon className='size-4' />
                            <span>Create Album</span>
                        </button>
                    </div>
                    <nav className='space-y-1'>
                        {navLinks.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink key={item.to} to={item.to} end={item.to === "/"}
                                    onClick={() => onCloseMobile?.()} className={({ isActive }) => `sidebar-nav-item ${isActive ? "sidebar-nav-item-active" : "sidebar-nav-item-inactive"}`}>
                                    <Icon className='size-5 shrink-0' />
                                    <span>{item.label}</span>
                                </NavLink>
                            )
                        })}

                    </nav>
                </div>

                {/* Storage Widget  */}

                <div className='sidebar-storage-card'>
                    <div className='flex items-center justify-between text-xs text-slate-600'>
                        <span className='flex items-center gap-1.5 text-slate-700'>
                            <HardDriveIcon className='size-4 text-red-500'/>
                            Storage
                        </span>
                        <span className='font-medium text-slate-900'>
                            {storageUsed} MB
                        </span>
                    </div>
                    <div className='w-full h-2 bg-slate-100 rounded-full overflow-hidden'>
                        <div className='sidebar-storage-bar' style={{width:`${storagePercent}%`}}/>
                    </div>
                    <div className='flex justify-between items-center text-[11px] text-slate-400'>
                        <span>{stats?.mediaCount ?? stats?.photoCount ?? 0} media saved</span>
                        {stats?.videoCount ? <span>{stats.videoCount} Videos</span> : null }
                    </div>
                </div>
            </aside>

        </>
    )
}

export default Sidebar