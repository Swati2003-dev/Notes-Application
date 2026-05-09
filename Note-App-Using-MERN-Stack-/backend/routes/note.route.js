import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import upload from "../utils/upload.js";
import {
  addNote,
  deleteNote,
  editNote,
  getAllNotes,
  searchNote,
  updateNotePinned,
  
  shareNote, //*
} from "../controller/note.controller.js";

const router = express.Router();

router.post("/add", verifyToken, upload.single("attachment"), addNote);
router.post("/edit/:noteId", verifyToken, upload.single("attachment"), editNote);
router.get("/all", verifyToken, getAllNotes);
router.delete("/delete/:noteId", verifyToken, deleteNote);
router.put("/update-note-pinned/:noteId", verifyToken, updateNotePinned);
router.get("/search", verifyToken, searchNote);
router.put("/share-note/:noteId", verifyToken, shareNote); //*
export default router;
