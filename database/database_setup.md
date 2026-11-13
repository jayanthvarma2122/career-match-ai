# 🗄️ MongoDB Database Setup Guide for CareerMatch AI

This guide walks you through setting up a MongoDB database for **CareerMatch AI**—either using a **Free Cloud MongoDB Atlas Cluster** (Recommended) or a **Local MongoDB Instance**.

---

## Option 1: MongoDB Atlas (Cloud - 100% Free Forever) ⭐ *Recommended*

MongoDB Atlas is the cloud-hosted version of MongoDB. It is fast, secure, requires zero local installation, and works across any computer or operating system.

### Step 1: Create a Free MongoDB Atlas Account
1. Visit [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with your Google account or email address.

### Step 2: Deploy a Free M0 Cluster
1. Choose the **M0 Free** shared tier.
2. Select your nearest cloud provider region (e.g., AWS / Mumbai `ap-south-1` or Singapore).
3. Name your cluster (e.g., `CareerMatchCluster`) and click **Create**.

### Step 3: Configure Database Security
1. **Create Database User**:
   - Go to **Security** > **Database Access**.
   - Click **Add New Database User**.
   - Authentication Method: **Password**.
   - Choose a username (e.g., `careermatch_admin`) and a secure password (e.g., `StudentPass2026!`).
   - Role: **Read and write to any database**.
   - Click **Add User**.

2. **Configure Network Access**:
   - Go to **Security** > **Network Access**.
   - Click **Add IP Address**.
   - Choose **Allow Access from Anywhere** (`0.0.0.0/0`) so you can test from college Wi-Fi, home, or demo laptops.
   - Click **Confirm**.

### Step 4: Copy Connection String
1. Go to **Deployments** > **Database**.
2. Click **Connect** on your cluster.
3. Select **Drivers** (Node.js).
4. Copy the connection string. It will look like:
   ```env
   mongodb+srv://careermatch_admin:<password>@careermatchcluster.xxxx.mongodb.net/careermatch_ai?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual database user password.

### Step 5: Save in Backend `.env`
Open `career-match-ai/backend/.env` and set:
```env
MONGO_URI=mongodb+srv://careermatch_admin:StudentPass2026!@careermatchcluster.xxxx.mongodb.net/careermatch_ai?retryWrites=true&w=majority
```

---

## Option 2: Local MongoDB Community Server

If you prefer to run MongoDB locally on your Windows machine:
1. Download **MongoDB Community Server**:
   [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run the `.msi` installer and check "Install MongoDB as a Service".
3. Install **MongoDB Compass** (GUI) when prompted.
4. Your default local connection string is:
   ```env
   MONGO_URI=mongodb://localhost:27017/careermatch_ai
   ```

---

## 🛡️ Built-in Zero-Config Fallback Mode

> **Interview Highlight**: If MongoDB is not yet running or if you are demoing offline during an interview, **CareerMatch AI automatically detects the absence of a database connection within 5 seconds and activates an in-memory session engine!**
>
> The server will **never crash**, allowing users and evaluators to register, log in, analyze resumes, and match jobs seamlessly. When a valid `MONGO_URI` is provided, the application seamlessly persists all data to MongoDB.

