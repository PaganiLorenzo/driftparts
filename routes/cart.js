var express = require('express');
var router = express.Router();

const DataBase = require('../models/db');
const db = new DataBase();

/* =========================================
   GET CART PAGE
========================================= */
router.get('/', async (req, res) => {

    try {

        if (!req.user) {
            return res.redirect('/login');
        }

        const userId = req.user.ID;

        const products = await db.getCartProducts(userId);

        res.render('cart', {
            products
        });

    } catch (err) {

        console.log(err);

        res.status(500).send("Error loading cart");

    }

});


/* =========================================
   ADD TO CART
========================================= */
router.post('/add', async (req, res) => {

    try {

        console.log("BODY:", req.body);

        if (!req.user) {
            return res.json({
                redirect: '/login'
            });
        }

        const userId = req.user.ID;

        console.log("USER ID:", userId);

        const productId = Number(req.body.id);

        console.log("PRODUCT ID:", productId);

        const cart = await db.getOrCreateCart(userId);

        console.log("CART:", cart);

        await db.addToCart(cart.id, productId);

        console.log("PRODUCT ADDED");

        res.json({
            success: true
        });

    } catch (err) {

        console.log("ADD ERROR:", err);

        res.status(500).json({
            success: false
        });

    }

});


/* =========================================
   REMOVE FROM CART
========================================= */
router.post('/remove', async (req, res) => {

    try {

        console.log("REMOVE BODY:", req.body);

        if (!req.user) {
            return res.redirect('/login');
        }

        const userId = req.user.ID;
        console.log("REMOVE USER ID:", userId);

        const productId = Number(req.body.id);
        console.log("REMOVE PRODUCT ID:", productId);

        const cart = await db.getOrCreateCart(userId);
        console.log("REMOVE CART:", cart);

        await db.removeFromCart(cart.id, productId);

        console.log("PRODUCT REMOVED");

        res.json({
            success: true
        });

    } catch (err) {

        console.log("REMOVE ERROR:", err);

        res.status(500).json({
            success: false
        });

    }

});

module.exports = router;