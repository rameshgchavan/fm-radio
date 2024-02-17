const mongoose = require("mongoose");
const dotEnv = require("dotenv");

// Environment setting
dotEnv.config();
const connectionString = `${process.env.MONGODB_URL}`;

// Creating connetion with db
const mongoDbConnection = mongoose.createConnection(
    connectionString
);

// Log on database "connected" event
mongoDbConnection.on("connected", () => {
    console.log("Database connection established successfully.");
});

// Log on database "error" event
mongoDbConnection.on("error", (err) => {
    console.log(`Database connection failed, error: ${err}`);
});

// Export db connection
module.exports = mongoDbConnection;