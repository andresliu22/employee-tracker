const express = require('express');
const router = express.Router();
const db = require('../config/connection');

router.get('/', (req, res) => {
    db.query('SELECT * FROM department;', function(error, resolves) {
        error ? res.json(error) : res.json(resolves);
    });
});
  
router.post('/', (req, res) => {
    db.query(`INSERT INTO department(name) VALUES (${req.body.department_name});`, function(error, resolves) {
        error ? res.json(error) : res.json(resolves);
    });
});

module.exports = router;