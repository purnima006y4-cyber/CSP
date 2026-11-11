# Smart Complaint Management System for Rural Areas (MERN Stack)
## Venkatapuram Gram Panchayat • Community Service Project (CSP)
**Academic Level:** B.Tech Computer Science & Engineering  
**Target Area:** Venkatapuram Village, Andhra Pradesh  
**Technology Stack:** MongoDB, Express.js, React (Vite), Node.js (MERN) + Bootstrap 5 + react-i18next + Chart.js  

---

## Quick Start Guide

### 1. Configure Backend `.env`
Inside `smart-complaint-management/backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/smart_complaint_management
JWT_SECRET=venkatapuram_csp_jwt_secret_key_2026_super_secure
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### 2. Populate Demo Data (Optional / Recommended)
```bash
cd smart-complaint-management/backend
npm run seed
```

### 3. Run Backend (Port 5000)
```bash
cd smart-complaint-management/backend
npm start
```

### 4. Run Frontend (Port 5173)
```bash
cd smart-complaint-management/frontend
npm run dev
```

### 5. Access Application
Open: [http://localhost:5173/](http://localhost:5173/)

- **Panchayat Admin Login:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
  - **Username:** `admin` | **Password:** `Admin@123`
- **Resident Citizen Login:** [http://localhost:5173/login](http://localhost:5173/login)
  - **Mobile / Email:** `9876543210` / `venkat@gmail.com` | **Password:** `User@123`

---
*For detailed documentation, routes table, testing checklist, and troubleshooting guide, please see `smart-complaint-management/README.md`.*
