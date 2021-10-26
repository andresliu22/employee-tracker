const router = require('express').Router();
const employeeRouter = require('./employeeRoutes');

router.use('/employee', employeeRouter)

module.exports = router;