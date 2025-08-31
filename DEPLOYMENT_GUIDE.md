# 🚀 Deployment Guide - Render Platform

## 📋 Prerequisites
- GitHub account
- Render account (free at render.com)

## 🔧 Step 1: Prepare Your Code

### 1.1 Create GitHub Repository
1. Go to GitHub.com
2. Create new repository: `project-showcase`
3. Upload your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/project-showcase.git
   git push -u origin main
   ```

## 🌐 Step 2: Deploy Backend on Render

### 2.1 Create Backend Service
1. Go to [render.com](https://render.com)
2. Sign up/Login
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `project-showcase-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 2.2 Environment Variables
Add these in Render dashboard:
```
MONGO_URI=mongodb+srv://tinsukia579_db_user:vesgdMiZ0qaqO983@clusterp.bdmursy.mongodb.net/?retryWrites=true&w=majority&appName=ClusterP
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=https://your-frontend-url.onrender.com
PORT=10000
NODE_ENV=production
```

## 🎨 Step 3: Deploy Frontend on Render

### 3.1 Create Frontend Service
1. Click "New +" → "Static Site"
2. Connect same GitHub repository
3. Configure:
   - **Name**: `project-showcase-frontend`
   - **Root Directory**: `Frontend`
   - **Build Command**: Leave empty
   - **Publish Directory**: Leave empty
   - **Plan**: Free

### 3.2 Update Frontend API URL
After backend deploys, update in `Frontend/auth.js`:
```javascript
const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
```

## 🔗 Step 4: Connect Frontend to Backend

### 4.1 Update CORS
In your backend `.env` or Render environment variables:
```
CORS_ORIGIN=https://your-frontend-url.onrender.com
```

### 4.2 Update Frontend API Calls
Update all frontend files to use the new backend URL:
- `Frontend/auth.js`
- `Frontend/home.js`
- `Frontend/projects.js`
- `Frontend/user.js`

## ✅ Step 5: Test Your Deployment

1. **Backend**: Visit `https://your-backend-url.onrender.com/api/test`
2. **Frontend**: Visit `https://your-frontend-url.onrender.com`
3. **Test signup/login** functionality

## 🎯 Your Live URLs
- **Frontend**: `https://your-frontend-url.onrender.com`
- **Backend**: `https://your-backend-url.onrender.com`
- **API**: `https://your-backend-url.onrender.com/api`

## 🆘 Troubleshooting
- Check Render logs for errors
- Verify environment variables
- Ensure MongoDB connection works
- Test API endpoints

## 📞 Need Help?
- Render documentation: docs.render.com
- Check deployment logs in Render dashboard
