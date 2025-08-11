const express = require('express');
const router = express.Router();
const leaveCtrl = require('../controllers/leaveController');

router.post('/', leaveCtrl.applyLeave);
router.patch('/:id/approve', leaveCtrl.approveLeave);
router.patch('/:id/reject', leaveCtrl.rejectLeave);
router.get('/employee/:id', leaveCtrl.getLeavesForEmployee);

module.exports = router;
