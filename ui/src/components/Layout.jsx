import Header from './Header';
import { Outlet } from 'react-router-dom';
export default function Layout() {
    return <div className="h-full w-full flex flex-col bg-indigo-white">
        <Header />
        <Outlet />
    </div>
}