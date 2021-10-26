const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    db.query('SELECT * FROM role', function(error, resolves) {
        error ? res.json(error) : res.json(resolves);
    });
});
  
router.post('/', (req, res) => {
    db.query(`INSERT INTO role(title, salary, department_id) VALUES (${req.body.title}, ${req.body.salary}, ${req.body.department_id});`, function(error, resolves) {
        error ? res.json(error) : res.json(resolves);
    });
});

module.exports = router;