import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar';
import CreateAlbumModel from '../albums/CreateAlbumModel';
import UploadModal from '../photos/UploadModal';


const AppLayout = () => {

    const [searchQuery,setSearchQuery] = useState("");
    const [isUploadOpen,setIsUploadOpen] = useState(false);
    const [isMobileSidebarOpen,setIsMobileSidebarOpen] = useState(false);

    const [createAlbumState,setCreateAlbumState] = useState({isOpen:false , photoIds:[]});

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(()=>{
        setIsMobileSidebarOpen(false);
    },[location.pathname])

    const handleUploadSuccess = () => {
        window.dispatchEvent(new CustomEvent("media-uploaded"));
    }

    const handleAlbumCreated = (album) => {
        setCreateAlbumState({isOpen : false,photoIds:[]});
        navigate(`/albums/${album._id}`);
    }

    const openCreateAlbum = (photoIds = []) => {
        setCreateAlbumState({isOpen:true,photoIds})
    }


    return (
        <div className='h-screen flex flex-col bg-white overflow-hidden'>
           <Navbar
           searchQuery={searchQuery}
           onSearchChange={setSearchQuery}
           onUploadClick={() => setIsUploadOpen(true)}
           onToggleSidebar={() => setIsMobileSidebarOpen((prev)=> !prev)}
           />
            

            <div className='flex-1 flex overflow-hidden min-h-0 relative '>
                <Sidebar 
                onCreateAlbumClick={() => openCreateAlbum()}
                onUploadClick={() => setIsUploadOpen(true)}
                isMobileOpen={isMobileSidebarOpen}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
                />


            <main className='app-main-content'>
                <Outlet/>
            </main>
            </div>

        <CreateAlbumModel
        isOpen={createAlbumState.isOpen}
        onClose={() => setCreateAlbumState({isOpen : false , photoIds : []})}
        onAlbumCreated={handleAlbumCreated}
        initialPhotoIds={createAlbumState.photoIds}
        />

        <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        />
            
        </div>

    )
}

export default AppLayout