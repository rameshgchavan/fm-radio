import { Outlet, Route } from "react-router-dom";

import { adminRoutes } from "./pageRoutes";

// This function returns private page routes
// Users: pageRoutes/index.js
const privateRoutes = () => {
    return (
        // Returning private routes according to user type
        <Route path="/private" element={<Outlet />}>
            {
                 adminRoutes
            }
        </Route>
    )
}

export default privateRoutes;