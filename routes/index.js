const router = require('express').Router();
const departmentRouter = require('./departmentRoutes');
const roleRouter = require('./roleRoutes');
const employeeRouter = require('./employeeRoutes');

router.use('/department', departmentRouter);
router.use('/role', roleRouter);
router.use('/employee', employeeRouter);


module.exports = router;