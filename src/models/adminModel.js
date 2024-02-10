// Import mongoose
const adminSchema = require("../shemas/adminSchema");
const mongoDBConnection = require("../dbConnection/mongoDbConnection");

const adminModel = () => {
    const connection = mongoDBConnection.useDb("fm-radio", { useCache: true });

    return (
        connection.model("admins", adminSchema)
        || connection.models["admins"]
    )
}

// Export function
module.exports = adminModel