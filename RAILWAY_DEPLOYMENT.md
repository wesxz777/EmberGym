# 🚂 Deploy EmberGym to Railway (Free Tier)

This guide will help you deploy your backend and database to Railway so users can fully interact with your EmberGym website on GitHub Pages.

## Prerequisites
- GitHub account with EmberGym repository
- Railway account (sign up at [railway.app](https://railway.app))

---

## Part 1: Create Railway Project

### 1. Sign Up for Railway
1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Sign in with your GitHub account
4. You'll get **$5 free credits per month** (enough for small projects)

### 2. Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your **wesle777/EmberGym** repository
4. Railway will detect it's a Node.js project

---

## Part 2: Add MySQL Database

### 1. Add Database to Project
1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add MySQL"**
4. Railway will automatically create a MySQL database

### 2. Get Database Credentials
1. Click on the MySQL service
2. Go to **"Variables"** tab
3. You'll see these variables (Railway auto-generates them):
   - `MYSQL_HOST`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`
   - `MYSQL_PORT`

### 3. Import Your Database Schema
1. Click on the MySQL service
2. Go to **"Data"** tab
3. Click **"Connect"** to get connection command, or:
4. Use Railway's built-in **MySQL client** to run your SQL:
   - Open the **"Query"** tab
   - Copy and paste your database schema from `backend/database-schema.sql`
   - Execute the queries

**OR** use a local MySQL client to connect:
```bash
mysql -h [MYSQL_HOST] -u [MYSQL_USER] -p[MYSQL_PASSWORD] [MYSQL_DATABASE] < backend/database-schema.sql
```

---

## Part 3: Configure Backend Environment Variables

### 1. Open Backend Service Settings
1. Click on your **backend service** (EmberGym)
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**

### 2. Add These Environment Variables

Click **"Add Reference"** for database variables (recommended):
- `DB_HOST` → Reference → MySQL → `MYSQL_HOST`
- `DB_USER` → Reference → MySQL → `MYSQL_USER`
- `DB_PASSWORD` → Reference → MySQL → `MYSQL_PASSWORD`
- `DB_NAME` → Reference → MySQL → `MYSQL_DATABASE`
- `DB_PORT` → Reference → MySQL → `MYSQL_PORT`

Add these as **Raw Variables**:
- `FRONTEND_URL` = `https://wesle777.github.io`
- `PORT` = (leave empty, Railway auto-assigns)

### 3. Configure Build Settings
1. Go to **"Settings"** tab
2. Under **"Build"**:
   - Root Directory: `backend`
   - Build Command: (leave empty)
   - Start Command: `npm start`

---

## Part 4: Deploy Backend

### 1. Trigger Deployment
1. Railway will automatically deploy when you:
   - Push changes to GitHub
   - Change environment variables
   - Click **"Deploy"** manually

### 2. Wait for Deployment
- Watch the **"Deployments"** tab
- Wait for status to show **"Success"** (usually 1-2 minutes)
- Check **"Logs"** if there are errors

### 3. Get Your Backend URL
1. Go to **"Settings"** tab
2. Scroll to **"Environment"** section
3. Click **"Generate Domain"**
4. You'll get a URL like: `https://embergym-production.up.railway.app`
5. **Copy this URL** - you'll need it next!

### 4. Test Your API
Open these URLs in your browser:
- `https://your-app.railway.app/api/health` → Should show `{"status":"ok"}`
- `https://your-app.railway.app/api/trainers` → Should show your trainers
- `https://your-app.railway.app/api/stats` → Should show database stats

---

## Part 5: Update Frontend for Production

### 1. Update API Configuration
1. Open `src/config/api.ts` in your project
2. Replace the placeholder URL with your Railway backend URL:

```typescript
const getApiUrl = (): string => {
  if (import.meta.env.PROD) {
    return 'https://your-app.railway.app/api'; // ← Your Railway URL here
  }
  return 'http://localhost:3001/api';
};
```

### 2. Commit and Push Changes
```powershell
git add .
git commit -m "Configure production API URL"
git push origin main
```

### 3. Wait for GitHub Pages Deployment
- Go to your repository on GitHub
- Click **"Actions"** tab
- Wait for the deployment to complete (1-2 minutes)
- Your site will be live at: https://wesle777.github.io/EmberGym/

---

## Part 6: Verify Everything Works

### Test on GitHub Pages
1. Open https://wesle777.github.io/EmberGym/
2. Navigate to **Trainers** page
3. You should see trainers from your database!
4. Try other features:
   - Login/Signup (if implemented)
   - Booking classes
   - Contact forms
   - All should now work!

---

## 🎉 You're Done!

Your EmberGym website is now fully functional:
- ✅ **Frontend**: Hosted on GitHub Pages (free)
- ✅ **Backend**: Hosted on Railway (free tier)
- ✅ **Database**: MySQL on Railway (free tier)
- ✅ **Users**: Can fully interact with your site!

---

## 📊 Railway Free Tier Limits

- **$5 free credits per month**
- **500 hours of usage** (enough for always-on small apps)
- **100 GB bandwidth**
- **1 GB storage** for database

For a gym website with moderate traffic, this should be plenty!

---

## 🔧 Troubleshooting

### "Failed to fetch" errors
- Check if backend is running: Visit `https://your-app.railway.app/api/health`
- Check CORS: Make sure `FRONTEND_URL` is set to `https://wesle777.github.io`

### Database connection errors
- Check database environment variables in Railway
- Make sure all DB_* variables are correctly referenced from MySQL service

### Backend won't start
- Check **"Logs"** tab in Railway
- Make sure `backend/` folder structure is correct
- Verify `package.json` has `"type": "module"`

### Empty data on website
- Make sure you imported your database schema
- Add some data to your database using Railway's Query tool

---

## 🚀 Next Steps

### Add More Data
Use Railway's MySQL Query tool to add:
- Trainers
- Classes
- Schedule
- Membership plans

### Monitor Usage
- Check Railway dashboard for usage metrics
- Set up alerts if you're approaching limits

### Custom Domain (Optional)
- Railway allows custom domains
- Go to Settings → Domains → Add custom domain

---

## 💡 Alternative Free Hosting Options

If you exceed Railway limits or want alternatives:
- **Render**: Similar to Railway, $0 free tier (sleeps after inactivity)
- **Fly.io**: Generous free tier, more complex setup
- **PlanetScale**: Free MySQL database (can use with any backend host)
- **Vercel**: Free for frontend + serverless functions

---

Need help? Check Railway docs at https://docs.railway.app
