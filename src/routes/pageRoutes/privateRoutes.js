import { Outlet, Route } from "react-router-dom";

import { adminRoutes } from "./pageRoutes";

// This function called by pageRoutes/index.js
// This function returns private page routes
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