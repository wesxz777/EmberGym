# EmberGym - How to Run Your Website

## 🌐 Your Website URLs

### Live Website (GitHub Pages)
**URL:** https://wesle777.github.io/EmberGym/

- ✅ Accessible from anywhere in the world
- ✅ Works on all devices (mobile, tablet, desktop)
- ⚠️ Shows "No Trainers Yet" (backend not connected)

### Local Development
**URL:** http://localhost:5173/

- ✅ Full database access
- ✅ Shows real trainer data from your MySQL database

---

## 🖥️ How to Run Everything Locally

### Step 1: Start XAMPP
- Open XAMPP Control Panel
- Start **MySQL**
- Start **Apache** (optional, for phpMyAdmin)

### Step 2: Start Backend Server
```powershell
cd backend
node server.js
```
✅ You should see: "MySQL database connected successfully"
✅ Server running on http://localhost:3001

Leave this terminal running.

### Step 3: Start Frontend
Open a new terminal:
```powershell
npm run dev
```
✅ Visit: http://localhost:5173/

---

## 📝 Quick Commands

### Start Development:
```powershell
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
npm run dev
```

### Deploy Updates to GitHub Pages:
```powershell
git add .
git commit -m "Your update message"
git push
```
Wait 1-2 minutes, changes will be live at: https://wesle777.github.io/EmberGym/

---

## ✅ Current Setup (Local Development)

- **Frontend:** GitHub Pages (public, always accessible)
- **Backend:** localhost:3001 (only on your computer)
- **Database:** XAMPP MySQL (local)

**Perfect for:**
- ✅ Local development and testing
- ✅ Showcasing design on GitHub Pages
- ✅ Learning and experimenting

---

## 🚀 What Works Where

### Current Setup: GitHub Pages (Public)
- ✅ Beautiful UI and design
- ✅ All pages and navigation
- ⚠️ Shows "No Trainers Yet" (backend offline)
- ❌ Login, signup, booking won't work (no backend)

### Current Setup: Localhost (Your Computer)
- ✅ Everything above, PLUS
- ✅ Real data from your database
- ✅ Full CRUD operations
- ✅ All API endpoints working

---

## 🌟 Want Users to Interact with Your Site?

### Deploy to Production (Free!)

**See `RAILWAY_DEPLOYMENT.md` for step-by-step guide**

After deployment, users can:
- ✅ Login and signup
- ✅ Book classes
- ✅ Submit contact forms
- ✅ See real trainer data
- ✅ All features fully working!

**What changes:**
- Backend moves from your computer → Railway (free cloud hosting)
- Database moves from XAMPP → Railway MySQL (free cloud database)
- Frontend stays on GitHub Pages
- **Result:** Fully interactive website accessible anywhere!

---

That's it! Simple and clean. 🎉
