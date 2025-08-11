const Employee = require('../models/Employee');

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, department, joiningDate, leaveBalance } = req.body;
    if (!name || !email || !joiningDate) return res.status(400).json({ message: 'Missing required fields' });

    // Basic email uniqueness handled by mongoose unique, but check for friendly error:
    const exists = await Employee.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Employee with this email already exists' });

    const emp = new Employee({
      name, email, department,
      joiningDate: new Date(joiningDate),
      leaveBalance: typeof leaveBalance === 'number' ? leaveBalance : Number(process.env.DEFAULT_ANNUAL_LEAVE_DAYS || 18)
    });

    await emp.save();
    return res.status(201).json(emp);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getLeaveBalance = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    return res.json({ employeeId: emp._id, name: emp.name, leaveBalance: emp.leaveBalance });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
