const mongoose = require("mongoose");
const dotEnv = require("dotenv");

// Environment setting
dotEnv.config();
const connectionString = `${process.env.MONGODB_URL}`;

// Create connection
const mongoDbConnection = mongoose.createConnection(
    connectionString
);

mongoDbConnection.on("connected", () => {
    console.log("Database connection established successfully.");
});

mongoDbConnection.on("error", (err) => {
    console.log(`Database connection failed, error: ${err}`);
});

module.exports = mongoDbConnection;