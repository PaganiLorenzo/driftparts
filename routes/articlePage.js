var express = require('express');
var router = express.Router();

const DataBase = require('../models/db');
const db = new DataBase();

router.get('/', async function(req, res, next) {

    try {

        const category = req.query.category;

        const products = await db.findProductsByCategory(category);

        res.render('articlePage', {
            category: category,
            articles: products
        });

    } catch(err) {

        console.log(err);

        next(err);

    }

});

module.exports = router;