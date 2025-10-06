import { Outlet } from 'react-router-dom';
import { StarryBackground } from './StarryBackground';

export function AppLayout() {
    return (
        <div className="w-full min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
            <StarryBackground />
            
            <div className="relative z-10 w-full min-h-screen">
                <Outlet />
            </div>
        </div>
    );
}