require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const employeeRoutes = require('./routes/employeeRoutes');
const leaveRoutes = require('./routes/leaveRoutes');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/leave_management');

app.get('/', (req, res) => res.send('Leave Management API running'));

app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', leaveRoutes);

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
