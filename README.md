# 🗂 Mini Leave Management System (MVP)

## 📌 Overview
This is the **MVP (Minimum Viable Product)** of a Leave Management System designed for a startup with around **50 employees**.  

It allows the **HR team** to:
- Add new employees with basic details
- Apply, approve, and reject leave requests
- Track leave balance for each employee
- Handle important edge cases to ensure **data integrity**

---

## 🛠 Tech Stack
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas (Cloud)
- **ODM:** Mongoose
- **Tools:** Postman (API testing), Nodemon (development)
- **Environment Config:** `.env` file for sensitive settings

---

## ✨ Features
1. **Add Employee**
   - Name, Email (unique), Department, Joining Date, Initial Leave Balance
2. **Apply Leave**
   - Validates dates, prevents overlaps, checks leave balance
3. **Approve Leave**
   - Deducts balance & updates status to `APPROVED`
4. **Reject Leave**
   - Adds reason & updates status to `REJECTED`
5. **Check Leave Balance**
   - View remaining leaves for any employee

---

## 📂 Project Structure
```
leave-management/
├── config/          # Database connection
├── controllers/     # API logic
├── models/          # Mongoose schemas
├── routes/          # API endpoints
├── utils/           # Helper functions
├── .env             # Environment variables sample
├── server.js        # App entry point
└── README.md
```

---

## ⚙ Setup & Installation

### 1️⃣ Install dependencies
```bash
npm install
```

### 2️⃣ Setup `.env` file
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/leave_management?retryWrites=true&w=majority
DEFAULT_ANNUAL_LEAVE_DAYS=18
```

### 3️⃣ Run the server
```bash
npm run dev
```

---

## 📌 API Endpoints

### 1. Add Employee  
**POST** `/api/employees`
```json
{
  "name": "Vaibhav",
  "email": "vaibhav@example.com",
  "department": "Engineering",
  "joiningDate": "2025-07-01",
  "leaveBalance": 18
}
```

---

### 2. Get Leave Balance  
**GET** `/api/employees/:id/balance`

---

### 3. Apply Leave  
**POST** `/api/leaves`
```json
{
  "employeeId": "<employeeId>",
  "startDate": "2025-08-20",
  "endDate": "2025-08-22",
  "reason": "Personal"
}
```

---

### 4. Approve Leave  
**PATCH** `/api/leaves/:id/approve`

---

### 5. Reject Leave  
**PATCH** `/api/leaves/:id/reject`
```json
{
  "reason": "Project deadline"
}
```

---

## ✅ Edge Cases Handled
- Applying before joining date  
- End date earlier than start date  
- Invalid date formats  
- Applying for more days than available balance  
- Overlapping leave requests (PENDING or APPROVED)  
- Employee not found  
- Only PENDING leaves can be approved/rejected  
- Prevent approving if balance is insufficient  

---

## 🚀 Potential Improvements
- Authentication & Role-Based Access Control (Employee, HR)
- Leave accrual & prorating for mid-year joiners
- Multiple leave types (Sick, Casual, Paid) with separate balances
- Email/SMS notifications on leave application/decision
- Audit logs and DB transactions to prevent race conditions
- Frontend + Admin dashboard with analytics
- Unit & integration tests with CI/CD pipeline
- Cloud deployment with MongoDB Atlas and Load Balancer

---

## 🖼 System HLD Diagram
![System HLD diagram](https://github.com/user-attachments/assets/d1edf564-7c3c-4fef-af5f-98b162d33f17)

---

## 📦 Deployment
- Can be deployed on **Render / Railway / Heroku**
- Uses **MongoDB Atlas** for cloud database
- Example deployed API base URL:  
```
https://leave-management-system-4j27.onrender.com
```
