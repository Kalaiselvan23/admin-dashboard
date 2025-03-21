# **Admin Management Full Stack Application - Node.js Backend & React Frontend**  

This project is a **full-stack web application** with a **React frontend** (deployed on **Netlify**) and a **Node.js/Express backend** (deployed on **Render**). The backend uses **MongoDB** for data storage.  

---

## **📂 Project Structure**
```
/admin-dashboard
│── /client        # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│── /server        # Node.js backend
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│── .env           # Backend environment variables
│── README.md
```

---

## **⚡ Getting Started**

### **1️⃣ Prerequisites**
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Netlify CLI (optional)](https://docs.netlify.com/cli/get-started/)

---

### **2️⃣ Backend Setup**
#### **Environment Variables**
Create a `.env` file inside the **server** folder with the following:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=https://your-netlify-app.netlify.app
```

#### **Install dependencies**
```sh
cd server
npm install
```

#### **Run backend locally**
```sh
npm start
```
The backend should now be running at `http://localhost:5000`.

---

### **3️⃣ Frontend Setup**
The frontend is built with **React** and deployed on **Netlify**.

#### **Run frontend locally**
```sh
cd client
npm install
npm start
```
The frontend should now be running at `http://localhost:3000`.

---

## **🚀 Deployment**

### **Backend Deployment (Render)**
1. Go to [Render](https://render.com/).
2. Click **New Web Service** and connect your GitHub repository.
3. Set the **Build Command**:  
   ```
   npm install && npm run build
   ```
4. Set the **Start Command**:  
   ```
   npm start
   ```
5. Add the required **environment variables** in Render settings.
6. Click **Deploy**.

Your backend will be deployed at `https://your-render-app.onrender.com`.

---

### **Frontend Deployment (Netlify)**
1. Go to [Netlify](https://www.netlify.com/).
2. Click **New Site from Git** and connect your repository.
3. Set the **Build Command**:  
   ```
   npm run build
   ```
4. Set the **Publish Directory**:  
   ```
   build
   ```
5. Click **Deploy Site**.

Your frontend will be deployed at `https://your-netlify-app.netlify.app`.

---

## **🔧 Development**
To test locally:
1. Start the backend:  
   ```sh
   cd server
   npm start
   ```
2. Start the frontend:  
   ```sh
   cd client
   npm start
   ```

---

## **🎯 Features**
✅ **React Frontend** - Deployed on Netlify  
✅ **Node.js Backend** - Deployed on Render  
✅ **MongoDB Database**  
✅ **JWT Authentication**  
✅ **REST API with CRUD Operations**  

---

## **📜 License**
This project is licensed under the **MIT License**.

---
