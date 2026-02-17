# Database Setup - Quick Start Guide

This guide will help you set up the MySQL database for EmberGym trainers.

## Step 1: Start XAMPP

1. Open XAMPP Control Panel
2. Start **Apache** (for phpMyAdmin)
3. Start **MySQL**

## Step 2: Create Database

1. Open your browser and go to: http://localhost/phpmyadmin
2. Click on the "SQL" tab at the top
3. Copy and paste this SQL code:

```sql
CREATE DATABASE IF NOT EXISTS embergym;
USE embergym;

CREATE TABLE IF NOT EXISTS trainers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  specialties JSON,
  certifications JSON,
  experience VARCHAR(100),
  bio TEXT,
  image TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  clients INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

4. Click "Go" button
5. You should see a success message

## Step 3: Install Backend Dependencies

Open a terminal/PowerShell in the project root and run:

```powershell
cd backend
npm install
```

## Step 4: Start Backend Server

```powershell
npm start
```

You should see:
```
✓ MySQL database connected successfully
🚀 Server running on http://localhost:3001
```

## Step 5: Start Frontend

Open a new terminal/PowerShell window in the project root:

```powershell
npm run dev
```

## Step 6: Test It Out

1. Open http://localhost:5173 in your browser
2. Navigate to the Trainers page
3. You should see "No Trainers Yet" message (empty state)

## Adding Your First Trainer

You can add trainers using a REST client like Postman or through code.

### Using PowerShell:

```powershell
$body = @{
    name = "Sarah Johnson"
    role = "Yoga Instructor"
    specialties = @("Yoga", "Meditation")
    certifications = @("RYT-500")
    experience = "8 years"
    bio = "Experienced yoga instructor"
    image = "https://via.placeholder.com/400"
    rating = 4.9
    clients = 150
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/trainers" -Method POST -Body $body -ContentType "application/json"
```

### Using curl:

```bash
curl -X POST http://localhost:3001/api/trainers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Johnson",
    "role": "Yoga Instructor",
    "specialties": ["Yoga", "Meditation"],
    "certifications": ["RYT-500"],
    "experience": "8 years",
    "bio": "Experienced yoga instructor",
    "image": "https://via.placeholder.com/400",
    "rating": 4.9,
    "clients": 150
  }'
```

After adding a trainer, refresh the Trainers page and you'll see them displayed!

## Troubleshooting

**Can't connect to MySQL:**
- Make sure XAMPP MySQL is running (green in XAMPP Control Panel)
- Check that port 3306 is not being used by another program

**Backend shows connection error:**
- Verify the database "embergym" exists in phpMyAdmin
- Check backend/.env file has correct credentials (default XAMPP: user=root, password=empty)

**Frontend shows error:**
- Make sure backend server is running on port 3001
- Check browser console (F12) for specific error messages
