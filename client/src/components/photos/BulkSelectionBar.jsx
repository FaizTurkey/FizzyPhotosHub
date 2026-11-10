import { CheckSquareIcon, FolderPlusIcon, StarIcon, Trash2Icon, XIcon } from 'lucide-react';
import React from 'react'

const BulkSelectionBar = ({ count, onClear, onFavorite, onAddToAlbum, onTrash }) => {

    if (count === 0) return null;

    return (
        <div className='bulk-bar-container'>
            <div className='flex items-center gap-2 border-r border-slate-200 pr-3'>
                <button
                    onClick={onClear}
                    className='p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition cursor-pointer' title='Clear Selection'>
                    <XIcon className='size-3.5' />
                </button>
                <span className='text-sm font-medium text-red-600 flex items-center gap-1.5'>
                    <CheckSquareIcon className='size-3.5' />
                    {count} Selected
                </span>
            </div>

            <div className='flex items-center gap-1 sm:gap-2'>
                <button
                    onClick={onFavorite}
                    className='bulk-bar-btn'>
                    <StarIcon className='size-3.5 text-slate-500' />
                    <span className='hidden sm:inline'>Favorites</span>
                </button>

                <button
                    onClick={onAddToAlbum}
                    className='bulk-bar-btn'>
                    <FolderPlusIcon className='size-3.5 text-slate-600' />
                    <span className='hidden sm:inline'>Add to Album</span>
                </button>

                <button
                    onClick={onTrash}
                    className='bulk-bar-btn'>
                    <Trash2Icon className='size-3.5' />
                    <span className='hidden sm:inline'>Move to Trash</span>
                </button>



            </div>

        </div>
    )
}

export default BulkSelectionBar