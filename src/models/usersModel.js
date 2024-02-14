// Import mongoose
const userSchema = require("../shemas/userSchema");
const mongoDBConnection = require("../dbConnection/mongoDbConnection");

const usersModel = () => {
    const connection = mongoDBConnection.useDb("fm-radio", { useCache: true });

    return (
        connection.model("users", userSchema) ||
        connection.models["users"]

    )
}

// Export function
module.exports = usersModel