import axios from "axios";

// Get a user
const readUserRequest = async (crediantials) => {
    return (
        (await axios(`/users/login`,
            {
                method: "post",
                data: crediantials
            }
        ))?.data
    );
};

// Get socket id
const readBroadcastRequest = async (email) => {
    return (
        (await axios(`/users/broadcastid`,
            {
                method: "get",
                headers: { email }
            }
        ))?.data
    );
};

// Check user's Email ID
const readUserEmailRequest = async (Email) => {
    return (
        (await axios(`/users/isemail`,
            {
                method: "post",
                data: Email
            }
        ))?.data
    );
};

export {
    readUserRequest,
    readBroadcastRequest,
    readUserEmailRequest
}