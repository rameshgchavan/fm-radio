import { Route, Routes } from 'react-router-dom';

// Page
import PageNotFound from "../../pages/PageNotFound";

import privateRoutes from './privateRoutes';
import publicRoutes from '../publicRoutes';

// This function called by src/App.js
// This function returns pages routes
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