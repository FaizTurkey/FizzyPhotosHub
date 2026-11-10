import React from 'react'
import {Toaster} from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import PhotosPage from './pages/PhotosPage'
import FavoritesPage from './pages/FavoritesPage'
import AlbumsPage from './pages/AlbumsPage' 
import AppLayout from './components/layout/AppLayout'
import AlbumDetailPage from './pages/AlbumDetailPage'
import TrashPage from './pages/TrashPage'
import InstallPopup from './components/InstallPopup'

const App = () => {
  return (
   <>
   <Toaster position="bottom-right"/>
   <InstallPopup/>

   <Routes>
     <Route path='/login' element={<AuthPage/>}/>
     
     <Route element={<AppLayout/>}>
        <Route path='/' element={<PhotosPage/>}/>
        <Route path='/favorites' element={<FavoritesPage/>}/>
        <Route path='/albums' element={<AlbumsPage/>}/>
        <Route path='/albums/:id' element={<AlbumDetailPage/>}/>
        <Route path='/trash' element={<TrashPage/>}/>
     </Route>

        <Route path='*' element={<Navigate to="/" replace/>}/>

    </Routes>
   </>
  )
}

export default App