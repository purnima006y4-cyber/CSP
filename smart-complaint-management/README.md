# Smart Complaint Management System for Rural Areas (MERN Stack)
## Venkatapuram Gram Panchayat • Community Service Project (CSP)
**Academic Level:** B.Tech Computer Science & Engineering  
**Target Area:** Venkatapuram Village, Andhra Pradesh  
**Technology Stack:** MongoDB, Express.js, React (Vite), Node.js (MERN) + Bootstrap 5 + react-i18next + Chart.js  

---

## 1. Project Overview
The **Smart Complaint Management System** is a digital civic governance web application built on the **MERN** stack for **Venkatapuram Gram Panchayat, Andhra Pradesh**. It enables rural citizens to report civic grievances online directly to Panchayat officers and track resolution in real time with an end-to-end progress timeline and in-site notifications.

### 6 Civic Problems Covered (from Door-to-Door Village Survey):
1. **Drinking Water:** Pipeline bursts, RO plant filtration issues, contamination.
2. **Roads & Potholes:** Craters on Mandal link road, broken culverts.
3. **Streetlights:** Non-functional LED fixtures and dark spots near school zones.
4. **Drainage & Sanitation:** Overflowing side drains, silt accumulation, mosquito breeding.
5. **Garbage Collection:** Missed tractor rounds, open dumping in vacant areas.
6. **Electricity & Feeder:** Agricultural pump low voltage drops, transformer sparks.

---

## 2. Prerequisites & Software Required
Before running the application, make sure you have the following installed on your computer:
1. **Node.js (v18 or higher)**: [https://nodejs.org](https://nodejs.org) (comes with npm).
2. **MongoDB**:
   - **Option A (Local):** [MongoDB Community Server](https://www.mongodb.com/try/download/community) + [MongoDB Compass](https://www.mongodb.com/products/compass).
   - **Option B (Cloud):** Free [MongoDB Atlas Cluster](https://www.mongodb.com/atlas/database) connection string.

---

## 3. Fast Setup & Installation (Step-by-Step)

### Step 1: Clone or Open Workspace
Navigate to the project root directory:
```bash
cd C:\csp\smart-complaint-management
```

### Step 2: Configure Environment Variables
In `backend/`, copy `.env.example` to `.env` (or verify `backend/.env` exists):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/smart_complaint_management
JWT_SECRET=venkatapuram_csp_jwt_secret_key_2026_super_secure
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```
*(If using MongoDB Atlas, replace `MONGO_URI` with your connection string: `mongodb+srv://<user>:<password>@cluster.mongodb.net/smart_complaint_management`).*

### Step 3: Install Dependencies
Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm install
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
```

### Step 4: Populate Seed Data (Demo Admin & Complaints)
Make sure your MongoDB server is running, then run the seed script from the `backend/` folder:
```bash
cd backend
npm run seed
```
This automatically initializes the database with:
- Default Panchayat Admin (`admin` / `Admin@123`)
- 3 registered village residents (Password: `User@123`)
- 6 realistic Venkatapuram complaints with progress timelines
- Initial sequence counter for Complaint IDs (`SCM-2026-0001` to `SCM-2026-0006`)

---

## 4. Starting the Application

### Start the Backend Server (Port 5000)
In Terminal 1:
```bash
cd backend
npm start
```
*Output: `[Backend Server Running] Port: 5000` | `[MongoDB Connected]`*

### Start the Frontend Client (Port 5173)
In Terminal 2:
```bash
cd frontend
npm run dev
```
*Output: `VITE v6.x.x ready in ... ms` -> Local: `http://localhost:5173/`*

Now open your browser and navigate to:  
👉 **[http://localhost:5173/](http://localhost:5173/)**

---

## 5. Default Demo Credentials

### A. Panchayat Administration Console
- **Admin Portal URL:** `http://localhost:5173/admin/login`
- **Username / Email:** `admin` (or `admin@venkatapuram.gov.in`)
- **Password:** `Admin@123`
- **Designation:** Sri K. Ramesh (Panchayat Secretary)

### B. Sample Registered Residents
- **Resident Login URL:** `http://localhost:5173/login`
- **Resident 1 (Venkat Rao - Ward 2):**
  - Mobile: `9876543210` or Email: `venkat@gmail.com`
  - Password: `User@123`
- **Resident 2 (Lakshmi Devi - Ward 1):**
  - Mobile: `9876543211` or Email: `lakshmi@gmail.com`
  - Password: `User@123`
- **Resident 3 (Suresh Kumar - Ward 4):**
  - Mobile: `9876543212` or Email: `suresh@gmail.com`
  - Password: `User@123`

---

## 6. Complete Application Routes & URLs

| Route | Role | Description |
| :--- | :--- | :--- |
| `http://localhost:5173/` | Public | Homepage with hero, live statistics, 6 categories & quick tracking |
| `http://localhost:5173/about` | Public | Venkatapuram village demographics & CSP field survey findings |
| `http://localhost:5173/services` | Public | 6 problem categories, SLAs (24–72h), and assigned Sachivalayam staff |
| `http://localhost:5173/contact` | Public | Panchayat office address, emergency contact directory & inquiry form |
| `http://localhost:5173/register` | Public | Resident registration with client-side mobile & password validation |
| `http://localhost:5173/login` | Public | Resident login via email OR 10-digit mobile number |
| `http://localhost:5173/track` | Public/User | Live grievance tracking with connected progress timeline |
| `http://localhost:5173/dashboard` | Resident | Resident metrics, recent grievances, and in-site notifications bell |
| `http://localhost:5173/complaints/new` | Resident | Lodge grievance with photo upload & live image preview |
| `http://localhost:5173/my-complaints` | Resident | Personal complaint archive with search, filters & pagination |
| `http://localhost:5173/profile` | Resident | View/update profile information and change password |
| `http://localhost:5173/admin/login` | Admin | Dedicated Panchayat administrative login console |
| `http://localhost:5173/admin/dashboard`| Admin | 5 KPI cards, Category Doughnut Chart (Chart.js) & recent issues |
| `http://localhost:5173/admin/complaints`| Admin | Master triage list, assign staff, update status, and log remarks |
| `http://localhost:5173/admin/users` | Admin | Resident directory with ward filters and grievance stats |
| `http://localhost:5173/admin/reports` | Admin | Chart.js analytics, monthly trend, print view & CSV export |

---

## 7. College Evaluation & Demo Checklist

Follow this sequence for your project presentation:
- [ ] **1. Multilingual Toggle:** Open `http://localhost:5173/` and click the **తెలుగు / English** button in the top utility bar. Verify the entire page instantly translates without reloading.
- [ ] **2. Resident Registration:** Click **Resident Register** (`/register`), enter a new villager's details, and sign in.
- [ ] **3. Lodge Grievance with Photo:** On `/complaints/new`, select category `Drinking Water`, choose Priority `High`, attach a photo, and watch the instant photo preview appear. Submit to receive your unique Tracking ID (e.g. `SCM-2026-0007`).
- [ ] **4. Check Initial Timeline:** Open `/track?cid=SCM-2026-0007` to see the initial status `[Pending]` and creation timestamp.
- [ ] **5. Admin Triage:** Sign in to `/admin/login` using `admin` / `Admin@123`. Open `/admin/complaints`, find `SCM-2026-0007`, click **Update**, assign staff (`B. Naidu`), change status to **In Progress**, and write official remarks.
- [ ] **6. In-Site Notification:** Log back in as the resident. Notice the **Notification Bell** alert. Click it to navigate directly to the updated complaint with its 2nd timeline node added!
- [ ] **7. Reports & CSV Export:** In the admin portal, open `/admin/reports` to inspect the Chart.js visual charts, click **Export to CSV** to download an Excel-ready report, and click **Print / PDF**.

---

## 8. Troubleshooting

### A. MongoDB is not running (connect ECONNREFUSED)
- **Fix (Windows):** Open Windows Services (`services.msc`), find **MongoDB Server**, right-click and click **Start**. Alternatively, start MongoDB manually by running `mongod` in a terminal.
- **Fix (Cloud):** Set your free MongoDB Atlas URI in `backend/.env`.

### B. Port 5000 or 5173 already in use
- **Fix:** In `backend/.env`, change `PORT=5001`. In `frontend/vite.config.js`, update target to `http://localhost:5001`.

### C. CORS Errors
- **Fix:** Ensure `FRONTEND_URL=http://localhost:5173` is set in `backend/.env`.

### D. Upload Folder Permissions
- **Fix:** The backend automatically creates `backend/uploads/` on startup. Ensure the process has standard write permissions to that directory.

---

**Venkatapuram Gram Panchayat CSP Evaluation • B.Tech CSE**
