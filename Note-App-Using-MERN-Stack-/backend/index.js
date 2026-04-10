import express from "express";
import mongoose from "mongoose";
import http from "http"; //*
import { Server } from "socket.io"; //*
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
mongoose
  .connect(process.env.MONGO_URI, { family: 4 })
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

//to make  input as json
app.use(express.json()); // Reads JSON data from request body
app.use(cookieParser()); // Reads cookies from browser
app.use(cors({ origin: [process.env.FRONTEND_URL || "http://localhost:5173"], credentials:true })); // Allows frontend and backend to communicate

const server = http.createServer(app); //*
const io = new Server(server, { cors: { origin: "http://localhost:5173", credentials: true } }); //*

io.on("connection", (socket) => { //*
  console.log("Socket connected:", socket.id); //*

  socket.on("join-note", (noteId) => { //*
    socket.join(noteId); //*
  }); //*

  socket.on("send-changes", (noteId, content) => { //*
    // Broadcast changes to everyone else in the same note room //*
    socket.to(noteId).emit("receive-changes", content); //*
  }); //*

  socket.on("disconnect", () => { //*
    console.log("Socket disconnected:", socket.id); //*
  }); //*
}); //*

// server.listen(3000, () => { 
//   console.log("Server is running");
// });

const PORT=process.env.PORT || 3000;
server.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`)
})

//import routes
import authRouter from "./routes/auth.route.js";
import noteRouter from "./routes/note.route.js";

app.use("/api/auth", authRouter);
app.use("/api/note", noteRouter);

//error handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});