import Note from "../models/note.model.js";
import User from "../models/user.model.js"; 
import { errorHandler } from "../utils/error.js";

export const addNote = async (req, res, next) => {
  let { title, content, tags, category, reminderAt } = req.body; 
  if (typeof tags === 'string') {
    try { tags = JSON.parse(tags); } catch (e) { tags = tags.split(','); }
  }

  const { id } = req.user;

  if (!title) {
    return next(errorHandler(400, "Title is required"));
  }
  if (!content) {
    return next(errorHandler(400, "Content is required"));
  }

  try {
    let attachmentUrl = null;
    let attachmentName = null;
    
    if (req.file) {
      attachmentUrl = req.file.path; // Cloudinary returns the full secure URL in path
      attachmentName = req.file.originalname;
    }

    const note = new Note({
      title,
      content,
      category: category || "General", 
      reminderAt: reminderAt || null, 
      tags: tags || [],
      userId: id,
      attachmentUrl,
      attachmentName,
    });
    await note.save();

    res.status(201).json({
      success: true,
      message: "Note Added Successfuly",
      note,
    });
  } catch (error) {
    next(error);
  }
};

export const editNote = async (req, res, next) => {
  const note = await Note.findById(req.params.noteId);

  if (!note) {
    return next(errorHandler(404, "Note not found"));
  }
  if (req.user.id !== note.userId.toString() && !note.collaborators.includes(req.user.id)) { 
    return next(errorHandler(401, "You are not an owner or collaborator of this note!")); 
  }

  let { title, content, tags, isPinned, category, reminderAt } = req.body; 
  if (typeof tags === 'string') {
    try { tags = JSON.parse(tags); } catch (e) { tags = tags.split(','); }
  }

  if (!title && !content && !tags && !category && reminderAt === undefined && !req.file) { 
    return next(errorHandler(404, "No changes provided "));
  }

  try {
    if (title) {
      note.title = title;
    }
    if (content) {
      note.content = content;
    }
    if (tags) {
      note.tags = tags;
    }
    if (isPinned !== undefined) {  //using undefined check for booleans
      note.isPinned = isPinned;
    }
    if (category) { 
      note.category = category; 
    } 
    if (reminderAt !== undefined) { 
      note.reminderAt = reminderAt; 
    } 
    if (req.file) {
      note.attachmentUrl = req.file.path;
      note.attachmentName = req.file.originalname;
    }
    await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllNotes = async (req, res, next) => {
  const userId = req.user.id;
  const { category, tag } = req.query; 

  try {
    const filter = { 
      $or: [ { userId: userId }, { collaborators: userId } ]  
    }; 
    if (category) { 
      filter.category = category; 
    } 
    if (tag) { 
      filter.tags = tag; 
    } 

    const notes = await Note.find(filter).sort({ isPinned: -1 }); 
    res.status(200).json({
      success: true,
      message: "All notes retrived successfully",
      notes,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  const noteId = req.params.noteId;

  const note = await Note.findOne({ _id: noteId, userId: req.user.id });

  if (!note) {
    return next(errorHandler(404, "Note not found"));
  }
  try {
    await Note.deleteOne({ _id: noteId, userId: req.user.id });

    res.status(200).json({
      success: true,
      message: "Note deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateNotePinned = async (req, res, next) => {
  const noteId = req.params.noteId;
  try {
    const note = await Note.findById(noteId);
    if (!note) {
      return next(errorHandler(404, "Note not found!"));
    }

    if (req.user.id !== note.userId.toString() && !note.collaborators.includes(req.user.id)) { 
      return next(errorHandler(401, "You can only update notes you own or collaborate on!")); 
    } //*
    const { isPinned } = req.body;

    note.isPinned = isPinned;

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};

export const shareNote = async (req, res, next) => { 
  const noteId = req.params.noteId; 
  const { email } = req.body; 

  if (!email) { 
    return next(errorHandler(400, "Email is required to share a note")); 
  } 

  try { 
    const note = await Note.findById(noteId); 
    if (!note) { 
      return next(errorHandler(404, "Note not found")); 
    } 

    // Only owner can share 
    if (req.user.id !== note.userId.toString()) { 
      return next(errorHandler(401, "Only the owner can share this note!")); 
    } 

    const targetUser = await User.findOne({ email: { $regex: new RegExp(`^${email.trim()}$`, "i") } }); 
    if (!targetUser) { 
      return next(errorHandler(404, "User with this email does not exist.")); 
    } 

    if (note.userId.toString() === targetUser._id.toString()) { 
      return next(errorHandler(400, "You cannot share a note with yourself.")); 
    } 

    if (note.collaborators.includes(targetUser._id.toString())) { 
      return next(errorHandler(400, "User is already a collaborator.")); 
    } 

    note.collaborators.push(targetUser._id.toString()); 
    await note.save(); 

    res.status(200).json({ 
      success: true, 
      message: "Note shared successfully", 
      note, 
    }); 
  } catch (error) { 
    next(error); 
  } 
}; 

export const searchNote = async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(errorHandler(400, "Search query is required"));
  }
  try {
    const matchingNotes = await Note.find({
      $and: [ 
        { $or: [{ userId: req.user.id }, { collaborators: req.user.id }] }, 
        { $or: [ 
            { title: { $regex: new RegExp(query, "i") } }, 
            { content: { $regex: new RegExp(query, "i") } }, 
          ] 
        } 
      ] 
    });
    res.status(200).json({
      success: true,
      message: "Notes matching the search query retrived successfully",
      notes: matchingNotes,
    });
  } catch (error) {
    next(error);
  }
};
