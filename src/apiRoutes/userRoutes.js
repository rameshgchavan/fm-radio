// Import express
const express = require("express");
const dotEnv = require("dotenv");
const jwt = require("jsonwebtoken");

// Import userScrutiny function
const userScrutiny = require("../functions/userScrutiny");
// Import tokenVerification function
const tokenVerification = require("../functions/tokenVerificationModel");

// Import Users Schema Model
const UsersModel = require("../models/usersModel")();

// Environment setting
dotEnv.config();
const JWTKEY = process.env.JWTKEY

// Create Router object
const userRoutes = express.Router();

// (APIs) downwards
// Get route to send broadcastId
userRoutes.route("/id").get(async (req, res) => {
    const email = req.headers.email;

    await UsersModel.findOne({ email })
        .select("broadcastId")
        .then(broadcastData => res.send(broadcastData))
        .catch(err => res.send(err));
});

/// Put route to update user details
userRoutes.route("/update").put(tokenVerification, async (req, res) => {
    // Destruct request body
    const { findVal, updateData } = req.body;

    // Find by id and update object of document in collection
    await UsersModel.findOneAndUpdate(findVal, updateData)
        .then(res.send({
            code: 202,
            message: `Updated successfully.`
        }));
})

// Post route to check email exsists or not
userRoutes.route("/isemail").post(async (req, res) => {
    // Scrutinize Email
    const scrutiny = await userScrutiny(req.body);
    // If not email exsist
    if (scrutiny.code == 404) {
        res.send(scrutiny)
    }
    else {
        res.send({
            code: 200,
            message: "Ok"
        })
    }
})

// Post route for new user signup
userRoutes.route("/signup").post(async (req, res) => {
    // Scrutinize Email
    const scrutiny = await userScrutiny(req.body);

    if (scrutiny.code == 404) {
        // Save data (record) received in body to database and retun 201 response with message.
        await UsersModel(req.body).save()
            .then(res.send({
                code: 201,
                message: `Created successfully.`
            }));
    }
})

// Post route to scrutinize login user
userRoutes.route("/login").post(async (req, res) => {
    // Scrutinize Email and password
    const scrutiny = await userScrutiny(req.body);

    if (scrutiny.code == 200) {
        // Find autheticated user 
        const user = await UsersModel.findOne(req.body).select('-password');
        // Create token to secure routes and send it into response
        jwt.sign({}, JWTKEY, (err, token) => {
            if (err) { res.send(err) }
            else {
                res.send({ ...user._doc, ...{ token } }); // Merged objects using ... (spread operator)
            }
        });
    }
    else { res.send(scrutiny); }
});

// Put route to reset password
userRoutes.route("/resetpass").put(async (req, res) => {
    // Scrutinize Email
    const scrutiny = await userScrutiny(req.body);
    //Change password if old password matched or not matched
    if (scrutiny.code == 200 || scrutiny.code == 403) {
        // Find email and update the password regarding that email and retun 202 response with message.
        await UsersModel.findOneAndUpdate({ email: req.body.email }, { password: req.body.password })
            .then(res.send({
                code: 202,
                message: `Accepted successfully.`
            }));
    }
});

// Export User Routes
module.exports = userRoutes;