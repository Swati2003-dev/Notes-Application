# 📝 MERN Notes Application

A full-stack **Notes Application** built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**.  
This app allows users to securely register, log in, and organize their personal notes with powerful features like authentication, search, and pinning.

---

## 📖 About The Project

This project is a full-stack Notes Management application built as a practical implementation of the MERN stack.  
It demonstrates authentication using JWT, RESTful API development with Express, state management using Redux, and secure route handling for protected resources.
Here is a detailed, beginner-friendly explanation of the whole project concept and the technologies used.

1. The Big Picture: MERN Stack

The application is split into two main parts: the Frontend (what the user sees) and the Backend (the server that processes data). It uses the MERN stack, which stands for:

MongoDB: The database where all the users and notes are stored.
Express.js: A web framework for Node.js used to build the backend server and its API routes (endpoints).
React.js: The library used to build the frontend user interface (UI).
Node.js: The runtime background environment that executes the backend JavaScript code.

2. How Authentication Works (JWT, Tokens, and Security)

This project features a secure authentication system. Here is the step-by-step flow of how a user creates an account and logs in securely:

## Step A: Signing Up and Hashing Passwords
When a user signs up (creates an account), they send an email and password to the backend.

Technology used: bcryptjs
What it does: The backend does not store the raw password (e.g., "password123"). Instead, it uses bcryptjs to hash it into a scrambled string (e.g., $2a$10$xyz...). This means even if a hacker accessed the database, they wouldn't know the users' real passwords.

## Step B: Logging In and Generating a JWT Token
When a user logs in, the backend checks if the email exists and if the provided password matches the scrambled password in the database.

Technology used: jsonwebtoken (JWT)
What it does: If the login is successful, the server generates a JSON Web Token (JWT).

What is a JWT? Think of it as a digital "ID Card" or a wristband at a concert. It contains the user's unique ID cryptographically signed by the server using a secret key (JWT_SECRET). Because it is signed by the server, it cannot be tampered with by the user.

## Step C: Sending the Token to the User via Cookies
Once the JWT is generated, the backend sends it to the user's browser, but it does this in a very specific, secure way.

Technology used: HTTP-Only Cookies
What it does: The backend places the JWT inside a cookie and sends it to the browser. It marks this cookie as httpOnly: true.

Why is this important? 
httpOnly means that the token cannot be accessed by the frontend JavaScript code. This prevents malicious scripts from stealing the token (a common attack called Cross-Site Scripting or XSS).

## Step D: Accessing Protected Routes (Using the Application)
Now that the user is logged in, they want to create notes or view existing ones.

Every time the frontend makes a request to the backend (e.g., "Get my notes"), the browser automatically attaches the cookie containing the JWT to the request.
The backend receives the request, takes the "ID Card" (JWT) out of the cookie, verifies that the digital signature is valid using its secret key, and figures out exactly which user is making the request. If the token is valid, it sends back the requested notes.

3. Frontend Technologies Used

React + Vite: The frontend is built with React and uses Vite as a super-fast build tool to run the development server.

Redux Toolkit (react-redux): Once the user logs in successfully, the frontend needs to remember the user's details across all pages (e.g., displaying their name on the navbar). Redux is a global state management tool that stores the user's data so any component can access it.

React Router DOM: Used to navigate between different pages like /login, /signup, and the home page / without having to reload the web page.
Tailwind CSS / Vanilla CSS: Used for writing styles quickly. Instead of writing custom CSS for everything, you can see utility classes in the code like flex, items-center, justify-center which style elements instantly.

    In summary, this project is a modern, full-stack application that handles data securely. The backend manages the database and authentication logic using hashed passwords and securely locked JWT cookies, while the frontend provides a smooth, interactive experience using React and Redux!
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