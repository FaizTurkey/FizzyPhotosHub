import { Film, XIcon } from 'lucide-react';
import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast';
import Loading from '../common/Loading';
import { api } from '../../config/api';

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {


    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);




    if (!isOpen) return null;

    const handleFiles = (files) => {
        if (!files) return;
        const validFiles = Array.from(files).filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"));
        if (validFiles.length === 0) {
            toast.error("Please select valid image or video files.");
            return;
        }

        const newSelected = [...selectedFiles, ...validFiles]
        setSelectedFiles(newSelected);

        const newPreviews = validFiles.map((file) => ({
            url: URL.createObjectURL(file),
            isVideo: file.type.startsWith("video/"),
            name: file.name,
        }))
        setPreviews((prev) => [...prev, ...newPreviews]);
    }

    const removeFile = (index) => {
        if (previews[index]) {
            URL.revokeObjectURL(previews[index].url);
        }
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    }


    const handleUpload = async () => {
       if(selectedFiles.length === 0) return;
       setUploading(true);

       const formData = new FormData();
       selectedFiles.forEach((file) => {
        formData.append("media",file);
       })

       try {
        const res = await api.post("/api/media/upload",formData , {
            headers:{"Content-Type" : "multipart/form-data"}
        });
        toast.success(res.data.message || "Uploaded successfully");
        onUploadSuccess(res.data.media || []);
        handleClose();
        
       } catch (error) {
        toast.error(error.response?.data?.message || "Upload failed. Try Again.");
       }finally{
        setUploading(false);
       }

    }

    const handleClose = () => {
        previews.forEach((p) => URL.revokeObjectURL(p.url));
        setSelectedFiles([]);
        setPreviews([]);
        setUploading(false);
        onClose();
    }



    return (
        <div className='modal-backdrop'>
            <div className='modal-box-lg'>
                {/* Header  */}
                <div className='modal-header'>
                    <div>
                        <h2 className='text-lg font-medium text-slate-800'>Upload to My Library</h2>
                        <p className='text-xs text-slate-500'>Upload and organize your photos & videos</p>
                    </div>
                    <button onClick={handleClose}
                        disabled={uploading} className='p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition cursor-pointer'
                    >
                        <XIcon className='size-5' />
                    </button>

                </div>

                {/* Content  */}
                <div className='p-6 overflow-y-auto space-y-4'>
                    {/* Drag and Drop Box  */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            handleFiles(e.dataTransfer.files);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`upload-dropzone ${isDragging ? "upload-dropzone-active" : "upload-dropzone-idle"}`}
                    >
                        <h3 className='font-medium text-slate-800 text-sm capitalize'>Drag and drop <span className='text-red-600'>photos & videos</span> here, or Browse</h3>
                        <p className='text-xs text-slate-400 mt-1'>Supports PNG, JPG , WEBP , GIF , MP4 , MOV , WEBM (up to 100MB each)</p>
                        <input type="file" className='hidden' ref={fileInputRef} multiple accept='image/*,video/*' onChange={(e) => handleFiles(e.target.files)} />
                    </div>

                    {/* Preview Grid  */}
                    {previews.length > 0 && (
                        <div>
                            <div className='flex items-center justify-between mb-2'>
                                <span className='text-xs text-slate-600 font-medium'>Selected ({previews.length})</span>
                                <button
                                    onClick={() => {
                                        previews.forEach((p) => URL.revokeObjectURL(p.url))
                                        setSelectedFiles([]);
                                        setPreviews([]);
                                    }}
                                    className='text-xs text-rose-500 hover:underline cursor-pointer'>
                                    Clear All
                                </button>
                            </div>
                            <div className='grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1'>
                                {previews.map((preview, idx) => (
                                    <div key={idx} className='relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100'>
                                        {preview.isVideo ? (
                                            <div className='size-full relative bg-slate-900 flex items-center justify-center'>
                                                <video src={preview.url} className='size-full object-cover' muted playsInline />
                                                <div className='absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 backdrop-blur-xs rounded text-[10px] text-white flex items-center gap-1'>
                                                    <Film className='size-3 text-orange-400' />
                                                    <span>Video</span>
                                                </div>

                                            </div>
                                        ) : (
                                            <img src={preview.url} alt="upload-preview"
                                                className='size-full object-cover' />
                                        )}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                            className='absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer'>
                                            <XIcon className='size-3' />
                                        </button>

                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer   */}
                <div className='modal-footer'>
                    <div className='flex items-center gap-2'>
                        <button onClick={handleClose} disabled={uploading} className='btn-secondary'>
                            Cancel
                        </button>

                        <button onClick={handleUpload} disabled={uploading || selectedFiles.length === 0} className='btn-primary'>
                            {uploading ? (
                                <>
                                    <Loading inline size="xs" />
                                    <span>Uploading....</span>
                                </>
                            ) : (
                                <span>
                                    Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : "  "}
                                </span>
                            )}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default UploadModal