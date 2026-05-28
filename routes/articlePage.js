var express = require('express');
var router = express.Router();

const DataBase = require('../models/db');
const db = new DataBase();

router.get('/', async function(req, res, next) {

    try {

        const category = req.query.category;
        const car = req.query.model;

        console.log("CATEGORY:", category);
        console.log("CAR:", car);

        let products = [];

        if (category) {
            products = await db.findProductsByCategory(category);
        }

        if (car) {
            products = await db.findProductsByModel(car);
        }

        if (category && car) {

            const catProducts = await db.findProductsByCategory(category);
            const carProducts = await db.findProductsByModel(car);

            const map = new Map();

            [...catProducts, ...carProducts].forEach(p => {
                map.set(p.ID, p);
            });

            products = Array.from(map.values());
        }

        console.log("PRODUCTS:", products);

        res.render('articlePage', {
            category: category || car,
            articles: products || []
        });

    } catch (err) {

        console.log(err);
        next(err);

    }

});
module.exports = router;