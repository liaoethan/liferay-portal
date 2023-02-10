import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { AppCreationFlow } from './pages/AppCreationFlow/AppCreationFlow';

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/publisher-dashboard' element={<DashboardPage />} />
                <Route path='/publisher-dashboard/create-new-app' element={<AppCreationFlow />} />
            </Routes>
        </BrowserRouter>
    );
}