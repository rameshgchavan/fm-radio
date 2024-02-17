import { Route, Routes } from 'react-router-dom';

// Page
import PageNotFound from "../../pages/PageNotFound";

import privateRoutes from './privateRoutes';
import publicRoutes from '../publicRoutes';

// This function returns pages routes
// Users: src/App.js
const pageRoutes = (scrutinizedUser) => {
    return (
        <Routes >
            {/* Public Routes */}
            {publicRoutes}

            {/* Private Routes */}
            {
                scrutinizedUser.token &&
                privateRoutes()
            }

            {/* Unknown Route */}
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    )
};

export default pageRoutes;