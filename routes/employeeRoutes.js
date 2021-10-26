const express = require('express');
const router = express.Router();
const db = require('../config/connection');

router.get('/', (req, res) => {
    db.query('SELECT * FROM employee', function(error, resolves) {
        error ? res.json(error) : res.json(resolves);
    });
});
  
router.post('/', (req, res) => {
    db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (${req.body.first_name}, ${req.body.last_name}, ${req.body.role_id}, ${req.body.manager_id});`, function(error, resolves) {
        error ? res.json(error) : res.json(resolves);
    });
});

router.put('/', (req, res) => {
});

router.delete('/', (req, res) => {
});

module.exports = router;