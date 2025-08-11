const express = require('express');
const router = express.Router();
const empCtrl = require('../controllers/employeeController');

router.post('/', empCtrl.createEmployee);
router.get('/:id/balance', empCtrl.getLeaveBalance);

module.exports = router;
