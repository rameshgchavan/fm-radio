import axios from "axios";

// Save a user
const createUserRequest = async (userDetails) => {
    return (
        (await axios(`/users/signup`,
            {
                method: "post",
                data: userDetails
            }
        ))?.data
    );
};

export {
    createUserRequest
}