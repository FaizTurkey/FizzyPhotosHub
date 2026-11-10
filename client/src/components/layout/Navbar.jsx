import { LogOutIcon, MenuIcon, Search, SparkleIcon, UploadCloudIcon, XIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({searchQuery,onSearchChange,onUploadClick,onToggleSidebar}) => {

    const {user,logout} = useAuth();


    const [dropdownOpen,setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const navigate = useNavigate();

    useEffect(()=>{
            const handleClickOutside = (e) => {
                if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
                    setDropdownOpen(false)
                }
                
            }
            document.addEventListener("mousedown", handleClickOutside);
                return () => document.removeEventListener("mousedown", handleClickOutside);
    },[])
 
    return (
    <header className='navbar-header'>
        {/* Left brand & mobile hamburger  */}
        <div className='navbar-brand'>
            <button className='navbar-menu-btn' title='Toggle menu' aria-label="Toggle navigation menu">
                <MenuIcon className='size-5'/>
            </button>
            <img src="logo.png" alt="Logo" className='size-8' />
            <h1 className='navbar-brand-text'>FIZZYPHOTOSHUB</h1>

        </div>

        {/* Center Serach Bar  */}
        <div className='flex-1 max-w-2xl relative'>
            <div className='navbar-search-wrapper'>
                <Search className='size-4 text-slate-500 shrink-0 mr-2 sm:mr-3'/>
                <input type="text" placeholder='Search photos, videos.....'  className='navbar-search-input'  value={searchQuery} onChange={(e) => onSearchChange(e.target.value)}/>
                {
                    searchQuery ? (
                        <button onClick={() => onSearchChange("")} className='hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition p-0.5'>
                            <XIcon className='size-3.5 sm:size-4 text-slate-800'/>
                        </button>
                    ) : (
                        <div className='navbar-ai-badge'>
                            AI-Powered Search <SparkleIcon className='size-3.5 animate-spin text-slate-600 shrink-0'/>
                        </div>
                    )
                }

            </div>

        </div>

        {/* Right Action Icons: Upload & Profile  */}
        <div className='flex items-center gap-2 sm:gap-3 shrink-0'>
            <button onClick={onUploadClick} className='navbar-upload-btn' title='Upload Photos & videos' >
                <UploadCloudIcon className='size-3.5'/>
                <span className='hidden sm:inline'>Upload</span>
            </button>

            {/* user Profile Menu  */}
            <div className='relative' ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className='navbar-avatar-btn'>
                    {user?.name?.charAt(0) || "U"}
                </button>

                {
                    dropdownOpen && (
                        <div className='navbar-dropdown'>
                            <div className='px-4 py-2 border-b border-slate-100'>
                                <p className='font-medium text-slate-800 text-sm truncate'>{user?.name}</p>
                                <p className='text-xs text-slate-500 truncate'>{user?.email}</p>
                            </div>

                            <div className='p-1'>
                                <button
                                onClick={() => {
                                    setDropdownOpen(false)
                                    logout();
                                }}
                                className='navbar-logout-btn'>
                                  <LogOutIcon className='size-3.5'/>
                                  Sign Out
                                </button>

                            </div>

                        </div>
                    )
                }

            </div>
                
        </div>

    </header>
  )
}

export default Navbar