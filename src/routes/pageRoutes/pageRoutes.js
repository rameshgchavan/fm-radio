import { Route } from 'react-router-dom';

// Pages 
import BroadcastPage from "../../pages/BroadcastPage"

// Initilalized and exported following page routes
// Users: pageRoutes/privateRoutes.js
const adminRoutes =
    <Route>
        <Route path="broadcast" element={<BroadcastPage />} />
    </Route>

export { adminRoutes } 