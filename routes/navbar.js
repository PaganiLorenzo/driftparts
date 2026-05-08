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

// Categories
router.get('/coilovers', (req, res) => {
    res.render('articlePage');
});

router.get('/engine-oil', (req, res) => {
    res.render('articlePage');
});

router.get('/rims', (req, res) => {
    res.render('articlePage');
});

router.get('/race-seats', (req, res) => {
    res.render('articlePage');
});

router.get('/hydraulic-handbrakes', (req, res) => {
    res.render('articlePage');
});

router.get('/steering-wheels', (req, res) => {
    res.render('articlePage');
});

router.get('/differentials', (req, res) => {
    res.render('articlePage');
});

module.exports = router;