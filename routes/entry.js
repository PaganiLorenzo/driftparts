const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('entry', { title: 'entry' });
});

module.exports = router;
