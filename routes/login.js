const express = require('express');
const router = express.Router();
const DataBase = require("../models/db");
const db = new DataBase();
const passport = require("passport");
const bcrypt = require("bcryptjs");

router.get("/", (req, res) => {
    const { alert } = req.query;
    let message = '';
    if (alert === "accessdenyed") {
        message = "you must be an admin to run this page.";
    } else if (alert === "error") {
        message = "wrong username or password";
    } else if (!message && alert) {
        message = "login to access the cart";
    }
    res.render("login", { message });
});

router.post("/", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.error("Error during authentication:", err);
            return next(err);
        }
        if (!user) {
            return res.redirect('/login?alert=error');
        }
        req.login(user, (err) => {
            if (err) {
                console.error("Error during login:", err);
                return next(err);
            }
            console.log("Login succesful:", user.Email);
            return res.redirect("/");
        });
    })(req, res, next);
});

module.exports = router;