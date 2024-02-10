// Import mongoose
const mongoose = require("mongoose");

// Create Schema
const adminSchema = new mongoose.Schema({
    broadcastId: String,
    email: String,
    password: String
});

// Export schema
module.exports = adminSchema;