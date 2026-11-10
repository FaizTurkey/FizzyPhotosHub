import React, { useEffect, useState } from 'react'
import { MopIcon, PlayIcon, RotateCcwClock, Trash2Icon } from 'lucide-react';
import Loading from '../components/common/Loading';
import { api } from '../config/api';
import toast from 'react-hot-toast';

const TrashPage = () => {

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrash = async () => {
    try {
      const res = await api.get("/api/media/trash");
      setPhotos(res.data.media || []);

    } catch {
      toast.error("Failed to load trash");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleEmptyTrash = async () => {
    if (photos.length === 0) return;
    if (!window.confirm(`Permanently delete all ${photos.length} items in trash? This cannnot be undone`)) {
      return;
    }

    try {
      const res = await api.delete("/api/media/trash/empty");
      toast.success(res.data.message || "Trash Emptied");
      setPhotos([]);
    } catch {
      toast.error("Failed to empty trash");
    }

  }

  const handleRestore = async (id) => {
    try {
      await api.patch(`/api/media/${id}/trash`, { restore: true });
      setPhotos((prev) => prev.filter((p) => p._id !== id));
      toast.success("Restored to Library");
    } catch {
      toast.error("Failed to restore item");
    }

  }

  const handleDeletePermanent = async (id) => {
    if (!window.confirm("Permanently delete this item? This cannot be undone")) return;
    try {
      await api.delete(`/api/media/${id}`);
      setPhotos((prev) => prev.filter((p) => p._id !== id));
      toast.success("Permanently deleted");
    } catch {
      toast.error("Failed to delete item");
    }

  }

  return (
    <div className='max-w-7xl mx-auto space-y-6'>
      <div className='flex items-center justify-between pb-2 border-b border-slate-200/60'>
        <div>
          <h2 className='text-2xl font-medium text-slate-900 tracking-tight flex items-center gap-2'>
            <Trash2Icon className='size-6 text-red-500' />
            Trash
            {photos.length > 0 && <span className='text-sm font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full'>{photos.length}</span>}
          </h2>
          <p className='text-xs text-slate-500 mt-0.5'>Items in trash can be restored or permanently removed</p>
        </div>

        {photos.length > 0 && (
          <button onClick={handleEmptyTrash} className='flex items-center px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium rounded-full transition cursor-pointer'>
            <MopIcon className='size-4 mr-2' />
            <span>Clear Trash</span>
          </button>
        )}
      </div>

      {loading ? (
        <Loading />
      ) : photos.length === 0 ? (
        <div className='empty-state-card'>
          <h3 className='text-lg font-medium text-slate-800'>Trash is empty</h3>
          <p className='text-xs text-slate-500 mt-1 max-w-xs mx-auto'>Deleted photos and videos will be safely stored here before permanent removel.</p>

        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
          {photos.map((photo) => {
            const isVideo = photo.mediaType === "video" || photo.format === "mp4" || photo.format === "mov" || photo.format === "webm" || photo.url?.endsWith(".mp4");


            return (
              <div key={photo._id} className='group relative rounded-2xl overflow-hidden bg-white border border-slate-200 flex flex-col'>
                <div className='aspect-square relative overflow-hidden bg-slate-100'>
                  <img src={photo.thumbnailUrl || photo.url} alt={photo.title} className='size-full object-cover' />
                  {isVideo && (
                    <div className='absolute bottom-2 right-2 flex items-center gap-1 px-1.5 bg-black/70 backdrop-blur-xs text-white rounded text-[10px] font-medium pointer-events-none'>
                      <PlayIcon className='size-2.5 fill-white' />
                      <span>Video</span>
                    </div>
                  )}
                </div>

                <div className='p-2.5 flex items-center justify-between bg-white border-t border-slate-100'>
                  <span className='text-xs font-medium text-slate-700 truncate pr-2'>{photo.title}</span>

                  <div className='flex items-center gap-1 shrink-0'>
                    <button
                      onClick={() => handleRestore(photo._id)}
                      className='p-1.5 hover:bg-orange-50 text-orange-600 rounded-lg transition cursor-pointer' title='Restore to library'>
                      <RotateCcwClock className='size-3.5' />
                    </button>

                    <button
                      onClick={() => handleDeletePermanent(photo._id)}
                      className='p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition cursor-pointer' title='Delete permanently'>
                      <Trash2Icon className='size-3.5' />
                    </button>

                  </div>

                </div>

              </div>
            )
          })}

        </div>
      )}

    </div>
  )
}

export default TrashPage