// Import express
const express = require("express");

// Import Users Schema Model
const adminModel = require("../models/adminModel");

// Create Router object
const adminRoutes = express.Router();

// (APIs) downwards
// HTTP request post method to get
adminRoutes.route("/id").get(async (req, res) => {
    const email = req.headers.email;

    const AdminModel = adminModel();

    await AdminModel.findOne({ email })
        .select("broadcastId")
        .then(broadcastData => res.send(broadcastData))
        .catch(err => res.send(err));
});

adminRoutes.route("/update").post(async (req, res) => {
    const broadcastData = req.body.broadcastData;
    const email = req.body.email;
    console.log("updateAdminRequest received:", broadcastData);

    const AdminModel = adminModel();

    await AdminModel.findOneAndUpdate({ email }, broadcastData)
        .then(() => res.send("Updated"))
        .catch(err => res.send(err));
});

// Export Router
module.exports = adminRoutes;