// Import mongoose
const userSchema = require("../shemas/userSchema");
const mongoDBConnection = require("../dbConnection/mongoDbConnection");

// User Model
const usersModel = () => {
    // Creating connetion with collection
    const connection = mongoDBConnection.useDb("fm-radio", { useCache: true });

    // Returning model by creating new or getting existing model
    return (
        connection.model("users", userSchema) ||
        connection.models["users"]

    )
}

// Export User Model
module.exports = usersModel