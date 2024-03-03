// Import mongoose
const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
    broadcastId: String,
    email: String,
    password: String,
    isLogged: Boolean
});

// Export schema
module.exports = userSchema;