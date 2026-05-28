const express = require('express');
const router = express.Router();

// Homepage
router.get('/', (req, res) => {
    res.render('index');
});

// Login
router.get('/login', (req, res) => {
    res.render('login');
});

// Cart
router.get('/cart', (req, res) => {
    res.render('cart');
});

module.exports = router;