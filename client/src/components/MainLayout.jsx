import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

export default function mainLayout() {
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    )
}