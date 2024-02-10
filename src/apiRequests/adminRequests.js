import axios from "axios";

// Get a admin
const readAdminRequest = async (email) => {
    return (
        (await axios(`/admin/id`,
            {
                method: "get",
                headers: { email }
            }
        ))?.data
    );
};

// Set a admin
const updateAdminRequest = async (email, broadcastData) => {
    return (
        (await axios(`/admin/update`,
            {
                method: "post",
                data: { email, broadcastData }
            }
        ))?.data
    );
};

export {
    readAdminRequest,
    updateAdminRequest
}