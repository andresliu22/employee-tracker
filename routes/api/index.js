const router = require('express').Router();

const employeeRoutes = require('./employeeRoutes');

router.use('/employees', employeeRoutes);

module.exports = router;
