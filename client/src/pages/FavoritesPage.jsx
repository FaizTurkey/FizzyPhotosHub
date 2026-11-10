import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Loading from '../components/common/Loading';
import PhotoGrid from '../components/photos/PhotoGrid';
import { PhotoLightbox } from '../components/photos/PhotoLightbox';
import { api } from '../config/api';
import toast from 'react-hot-toast';

const FavoritesPage = () => {
  const { searchQuery } = useOutletContext();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activePhoto, setActivePhoto] = useState(null);

  const fetchFavorites = async () => {
    try {
      const url = searchQuery ? `/api/media?favorite=true&q={encodeURIComponent(searchQuery)}` : "/api/media?favorite=true"
      const res = await api.get(url);
      setPhotos(res.data.media || []);
    } catch  {
      toast.error("Failed to load favorites");
      
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, [searchQuery]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !==id) : [...prev , id]));
  }

  const toggleFavorites = async (id) => {
    try {
      await api.patch(`/api/media/${id}/favorite`)
      setPhotos((prev) => prev.filter((p) => p._id !== id));
      if(activePhoto && activePhoto._id === id){
        setActivePhoto(null);
      }
      toast.success("Removed from favorites");
    } catch {
      toast.error("Failed to update favorite")
      
    }
    
  }
  const handleTrash = async (id) => {
    try {
      await api.patch(`/api/media/${id}/trash`,{restore:false})
      setPhotos((prev) => prev.filter((p) => p._id !== id));
      if(activePhoto && activePhoto._id === id){
        setActivePhoto(null);
      }
      toast.success("Moved items to Trash");
    } catch {
      toast.error("Failed to move to Trash");
      
    }
    
  }

  return (
    <div className='max-w-7xl mx-auto space-y-6'>
      <div className='flex items-center justify-between pb-2 border-b border-slate-200/60'>
        <div>
          <h2 className='text-2xl font-medium text-slate-900 tracking-tight flex items-center gap-2'>Favorites {photos.length > 0 && <span className='text-sm font-medium text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full'>{photos.length}</span>}</h2>
          <p className='text-xs text-slate-500 mt-0.5'>Your starred photos and videos for quick access</p>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : photos.length === 0 ? (
        <div className='empty-state-card'>
          <h3 className='text-lg font-medium text-slate-800'>No Favorites Yet</h3>
          <p className='text-xs text-slate-500 mt-1 max-w-xs mx-auto'>Click the star icon on any photo or video in your collection to add it to your favorites.</p>
        </div>
      ) : (
       <PhotoGrid
       photos={photos}
       selectedIds={selectedIds}
       onToggleSelect={toggleSelect}
       onSelectPhoto={() => setActivePhoto(photos)}
       onToggleFavorite={toggleFavorites}
       />
      )}

      <PhotoLightbox
      photos={photos}
      currentPhoto={activePhoto}
      onClose={() => setActivePhoto(null)}
      onToggleFavorite={toggleFavorites}
      onTrashPhoto={handleTrash}
      />
    </div>
  )
}

export default FavoritesPage