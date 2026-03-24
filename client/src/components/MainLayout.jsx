import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

export default function mainLayout() {
    return (
        <>
            <NavBar />
            <div style={{ paddingTop: '70px' }}>
                <Outlet />
            </div>
        </>
    )
}