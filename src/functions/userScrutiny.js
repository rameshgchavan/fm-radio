// Import UsersModel schema
const UsersModel = require("../models/usersModel")();

// Fuction to verify authenticattion
// Callers: apiRoutes/userRoutes.js
const userScrutiny = async (reqBody) => {
    // Destruct request body
    const { email, password } = reqBody;
    // Find email in database
    const isEmail = await UsersModel.findOne({ email });
    // If not email exsist
    if (!isEmail) {
        return {
            code: 404,
            message: `${email} not found`
        }
    }
    // If not password not matched
    if (isEmail.password != password) {
        return {
            code: 403,
            message: "Forbidden password"
        }
    }

    //Successful scrutiny
    return {
        code: 200,
        message: "Ok."
    }
}

module.exports = userScrutiny;