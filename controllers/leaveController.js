const Leave = require('../models/Leave');
const Employee = require('../models/Employee');
const { daysBetweenInclusive } = require('../utils/helpers');

exports.applyLeave = async (req, res) => {
  try {
    const { employeeId, startDate, endDate, reason } = req.body;
    if (!employeeId || !startDate || !endDate) return res.status(400).json({ message: 'Missing fields' });

    const emp = await Employee.findById(employeeId);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });

    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s) || isNaN(e)) return res.status(400).json({ message: 'Invalid dates' });
    if (e < s) return res.status(400).json({ message: 'End date cannot be before start date' });

    // before joining
    if (s < new Date(emp.joiningDate).setHours(0,0,0,0)) {
      return res.status(400).json({ message: 'Cannot apply for leave before joining date' });
    }

    const days = daysBetweenInclusive(s, e);

    // check overlapping existing leaves for same employee (PENDING or APPROVED)
    const overlapping = await Leave.findOne({
      employee: emp._id,
      status: { $in: ['PENDING', 'APPROVED'] },
      $or: [
        { $and: [{ startDate: { $lte: s } }, { endDate: { $gte: s } }] },
        { $and: [{ startDate: { $lte: e } }, { endDate: { $gte: e } }] },
        { $and: [{ startDate: { $gte: s } }, { endDate: { $lte: e } }] }
      ]
    });
    if (overlapping) return res.status(400).json({ message: 'Overlapping leave request exists' });

    // check balance
    if (days > emp.leaveBalance) return res.status(400).json({ message: 'Insufficient leave balance' });

    const leave = new Leave({
      employee: emp._id,
      startDate: s,
      endDate: e,
      days,
      reason
    });
    await leave.save();

    return res.status(201).json(leave);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.approveLeave = async (req, res) => {
  try {
    const id = req.params.id;
    const leave = await Leave.findById(id).populate('employee');
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });
    if (leave.status !== 'PENDING') return res.status(400).json({ message: 'Only pending leaves can be approved' });

    const emp = leave.employee;
    if (leave.days > emp.leaveBalance) {
      return res.status(400).json({ message: 'Cannot approve: employee has insufficient leave balance' });
    }

    // Deduct balance and approve
    emp.leaveBalance = emp.leaveBalance - leave.days;
    await emp.save();

    leave.status = 'APPROVED';
    leave.decidedAt = new Date();
    await leave.save();

    return res.json({ message: 'Leave approved', leave });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.rejectLeave = async (req, res) => {
  try {
    const id = req.params.id;
    const { reason } = req.body;
    const leave = await Leave.findById(id);
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });
    if (leave.status !== 'PENDING') return res.status(400).json({ message: 'Only pending leaves can be rejected' });

    leave.status = 'REJECTED';
    leave.decidedAt = new Date();
    leave.reason = leave.reason ? leave.reason + '\n\nREJECTION_NOTE: ' + (reason || 'No reason') : (reason || 'No reason');
    await leave.save();

    return res.json({ message: 'Leave rejected', leave });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getLeavesForEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const leaves = await Leave.find({ employee: employeeId }).sort({ startDate: -1 });
    return res.json(leaves);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
