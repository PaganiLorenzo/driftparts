const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const DataBase = require("../models/db");
const db = new DataBase();


router.get("/", (req, res) => {
    const error = req.session.error || null;
    req.session.error = null;
    res.render("register", {
        title: "register",
        error: error
    });
});


router.post("/", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await db.findUserByEmail(req.body.email);
        if (!user)
            await db.addNewUser(
                req.body,
                hashedPassword
            );
        else
            req.session.error = 'email already in use';
        return res.redirect("/register");
    } catch (error) {
        console.log("Error while registering: ", error);
        req.session.error = 'unknown error'
        res.redirect("/register");
    }
});

module.exports = router;