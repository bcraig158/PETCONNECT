# Quick Start Guide

## ✅ Server is Running!

Your application is now running at:
**http://localhost:3001**

(Port 3001 because port 3000 was in use)

## 📋 What You Can Do Now

### 1. View the App
Open your browser and go to: **http://localhost:3001**

### 2. Pages Available:
- **Home** → http://localhost:3001
- **Products** → http://localhost:3001/products
- **Register** → http://localhost:3001/register
- **Login** → http://localhost:3001/login
- **About** → http://localhost:3001/about
- **Contact** → http://localhost:3001/contact

### 3. After Registering/Logging In:
- **Account** → http://localhost:3001/account
- **Orders** → http://localhost:3001/orders
- **Page Builder** → http://localhost:3001/builder
- **Your Public Page** → http://localhost:3001/[your-username]

## ⚠️ Important: Database Connection

Before the app will work fully, you need to update your `.env.local` file with your Supabase database connection string:

1. Go to: https://supabase.com/dashboard/project/mwqoyvapjyjzaemsosoh
2. Settings → Database → Connection string
3. Copy the **URI** connection string
4. Update `DATABASE_URL` in `.env.local`
5. Restart the server (Ctrl+C then `PORT=3001 npm run dev`)

## 🛑 To Stop the Server

Press `Ctrl+C` in the terminal where it's running.

## 🚀 To Restart

```bash
cd /Users/brycecraig/PETCONNECT
PORT=3001 npm run dev
```

Or create a shortcut by updating package.json to use port 3001 by default.

