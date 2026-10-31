import React from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
    return (
        <div>
            <p>NavBar</p>
            <p>SideBar</p>

            <main className='app-main-content'>
                <Outlet/>
            </main>
        </div>

    )
}

export default AppLayout