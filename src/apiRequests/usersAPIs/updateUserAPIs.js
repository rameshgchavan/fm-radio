import axios from "axios";

// Update a user
const updateUserRequest = async (scrutinizedUser, findVal, updateData) => {
    return (
        (await axios(`/users/update`,
            { 
                method: "put",
                headers: { authorization: `bearer ${scrutinizedUser.token}` },
                data: {findVal, updateData } // here object is key Name or Status 
            }
        ))?.data
    );
};

// Reset password
const updateUserPasswordRequest = async (userCredentails) => {
    return (
        (await axios(`/users/resetpass`,
            {
                method: "put",
                data: userCredentails
            }
        ))?.data
    );
};

export {
    updateUserRequest,
    updateUserPasswordRequest
}