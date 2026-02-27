# 📝 MERN Notes Application

A full-stack **Notes Application** built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**.  
This app allows users to securely register, log in, and organize their personal notes with powerful features like authentication, search, and pinning.

---

## 📖 About The Project

This project is a full-stack Notes Management application built as a practical implementation of the MERN stack.  
It demonstrates authentication using JWT, RESTful API development with Express, state management using Redux, and secure route handling for protected resources.

---

## 🚀 Features

### 🔐 Authentication
- User Registration
- Secure Login System
- Protected Routes (JWT-based)

### 🗂 CRUD Operations
- ➕ Create Notes
- 📝 Edit Notes
- ❌ Delete Notes
- 📋 View All Notes

### 📌 Pin Important Notes
- Highlight important notes
- Keep priority notes at the top

### 🔎 Search Functionality
- Quickly search notes
- Real-time filtering

---

## 🛠 Tech Stack

| Technology  | Purpose                          |
|-------------|----------------------------------|
| MongoDB     | Database for storing notes       |
| Express.js  | Backend API framework            |
| React.js    | Frontend user interface          |
| Node.js     | Server-side runtime              |
| Redux       | State management                 |
| JWT         | User authentication              |

---

## 📂 Project Structure

```
Notes-Application
│
├── frontend
│   └── src
│       ├── components
│       │   ├── Cards
│       │   ├── EmptyCard
│       │   ├── Input
│       │   ├── SearchBar
│       │   └── Navbar.jsx
│       │
│       ├── pages
│       │   ├── Home
│       │   ├── Login
│       │   └── Signup
│       │
│       ├── redux
│       ├── utils
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── backend
│   ├── controller
│   │   ├── auth.controller.js
│   │   └── note.controller.js
│   │
│   ├── models
│   │   ├── user.model.js
│   │   └── note.model.js
│   │
│   ├── routes
│   │   ├── auth.route.js
│   │   └── note.route.js
│   │
│   ├── utils
│   │   ├── error.js
│   │   └── verifyUser.js
│   │
│   ├── index.js
│   └── package.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Swati2003-dev/Notes-Application.git
cd Notes-Application
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file inside the backend folder:

```
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 🎯 Learning Outcomes

- Implemented JWT-based authentication
- Built RESTful APIs using Express
- Managed global state using Redux
- Connected React frontend with Node backend
- Structured a scalable full-stack application

---

## 🚀 Future Improvements

- Dark Mode support
- Tags & Categories
- Cloud Deployment
- Pagination
- Profile management

---

## 👩‍💻 Author

- Swati 
- Sonali
- Riya
- Rudra
---

## This part is showing the work distribution (Not Assigned yet)

- 👩‍💻 Member 1 – Backend Setup (Watch Backend Initial Part Only)

🎥 Watch video part:

Server setup
Express setup
MongoDB connection
Creating models

📁 Work:

Create server.js
Connect MongoDB
Create models (User/Product/etc.)
Basic route test (/ route)

* This person stops watching when CRUD/auth starts.
<!-- -------------------------------------------------------------------- -->
- 👩‍💻 Member 2 – Backend Routes + Authentication

🎥 Skip server setup part.
Start watching from:

Register API
Login API
JWT
Middleware

📁 Work:

Create routes folder
Create controllers
Register API
Login API

Protect routes

* This person doesn’t need frontend video.
<!-- ---------------------------------------------------------------------- -->
- 👩‍💻 Member 3 – Frontend UI Only (No Backend Connection)

🎥 Skip backend part completely.
Watch:

React setup
Components
Pages
Form design
Routing

📁 Work:

Login page
Register page
Dashboard page
Navbar
CSS

⚠️ Use dummy data if needed.
No API connection now.
<!-- ------------------------------------------------------------------------- -->
- 👩‍💻 Member 4 – Frontend + Backend Connection

🎥 Skip UI design part.
Watch:

Axios connection
API calling
useEffect
Form submission logic

📁 Work:

Connect login form to backend
Connect register form
Store token
Test full flow
