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

const readBroadcastIdRequest = async (email) => {
    return (
        (await axios(`/users/id`,
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
    readBroadcastIdRequest,
    readUserEmailRequest
}