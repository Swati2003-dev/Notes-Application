import React from "react";
import { MdClose } from "react-icons/md";
import { useState, useEffect, useRef } from "react"; //*
import TagInput from "../../components/Input/TagInput";
import ReminderInput from "../../components/Input/ReminderInput"; //*
import { io } from "socket.io-client"; //*
import axios from "axios";
import { toast } from "react-toastify";

const AddEditNotes = ({ onClose, noteData, type, getAllNotes }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [category, setCategory] = useState(noteData?.category || "General"); //*
  const [reminderAt, setReminderAt] = useState(noteData?.reminderAt || null); //*
  const [error, setError] = useState(null);

  // * Socket.io Real-Time Collaboration Setup
  const socketRef = useRef(null); //*
  const isExternalChange = useRef(false); //*

  useEffect(() => { //*
    if (type !== "edit" || !noteData?._id) return; //* Only sync existing notes

    socketRef.current = io((import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") + "", { 
      forceNew: true, 
      withCredentials: true,
      transports: ["websocket"] //*
    }); //*

    socketRef.current.on("connect", () => { //*
      toast.success("Socket connected perfectly!"); //*
    }); //*

    socketRef.current.on("connect_error", (err) => { //*
      toast.error(`Socket Blocked: ${err.message}`); //*
    }); //*

    // 1. Join room
    socketRef.current.emit("join-note", noteData._id); //*

    // 2. Listen for incoming changes
    socketRef.current.on("receive-changes", (newPayload) => { //*
      isExternalChange.current = true; //* Loop prevention flag
      
      if (newPayload.title !== undefined) setTitle(newPayload.title); //*
      if (newPayload.content !== undefined) setContent(newPayload.content); //*

      setTimeout(() => { isExternalChange.current = false; }, 100); //*
    }); //*

    return () => { //*
      socketRef.current.disconnect(); //*
    }; //*
  }, [type, noteData]); //*

  // * Silent Background Auto-Save
  const autoSaveNote = async (currentTitle, currentContent) => { //*
    if (type !== "edit" || !noteData?._id) return; //*
    try { //*
      await axios.post( //*
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/api/note/edit/${noteData._id}`, //*
        { title: currentTitle, content: currentContent, tags, category, reminderAt }, //*
        { withCredentials: true } //*
      ); //*
      getAllNotes(); //* Silently refresh the cards in the background //*
    } catch (error) { //*
      console.log("Auto-save error:", error.message); //*
    } //*
  }; //*

  useEffect(() => { //*
    if (type !== "edit" || !noteData?._id) return; //*
    if (isExternalChange.current) return; //* Never auto-save someone else's broadcasted typing //*

    // Wait 1.5 seconds after they stop typing before saving
    const timeoutId = setTimeout(() => { //*
      // Ensure we don't save completely empty notes
      if (title.trim() || content.trim()) { //*
        autoSaveNote(title, content); //*
      } //*
    }, 1500); //*

    return () => clearTimeout(timeoutId); //*
  }, [title, content]); //*

  const editNote = async () => {
    const noteId = noteData._id;
    try {
      const res = await axios.post(
        (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") + "/api/note/edit/" + noteId,
        { title, content, tags, category, reminderAt }, //*
        { withCredentials: true },
      );
      if (res.data.success === false) {
        console.log(res.data.message);
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      getAllNotes();
      onClose();
    } catch (error) {
      console.log(error.message);
      setError(error.message);
      toast.error(error.message);
    }
  };
  const addNewNote = async () => {
    try {
      const res = await axios.post(
        (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") + "/api/note/add",
        { title, content, tags, category, reminderAt }, //*
        { withCredentials: true },
      );

      if (res.data.success === false) {
        console.log(res.data.message);
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      getAllNotes();
      onClose();
    } catch (error) {
      console.log(error.message);
      setError(error.message);
      toast.error(error.message);
    }
  };
  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the Title");
      return;
    }
    if (!content) {
      setError("Please enter the Content");
      return;
    }
    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>
      <div className="flex flex-col gap-2">
        <label className="input-label text-red-400 uppercase">Title</label>

        <input
          type="text"
          className="text-2xl text-slate-950 dark:text-white bg-transparent outline-none" //*
          placeholder="Wake up at 6a.m."
          value={title}
          onChange={({ target }) => { //*
            setTitle(target.value); //*
            if (!isExternalChange.current && type === "edit" && socketRef.current) { //*
              socketRef.current.emit("send-changes", noteData._id, { title: target.value }); //*
            } //*
          }} //*
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label text-red-400 uppercase">Content</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 dark:text-white outline-none bg-slate-50 dark:bg-slate-700/50 p-2 rounded" //*
          placeholder="Content..."
          rows={10}
          value={content}
          onChange={({ target }) => { //*
            setContent(target.value); //*
            if (!isExternalChange.current && type === "edit" && socketRef.current) { //*
              socketRef.current.emit("send-changes", noteData._id, { content: target.value }); //*
            } //*
          }} //*
        />
      </div>

      <div className="flex flex-col gap-2 mt-4"> {/* //* */}
        <label className="input-label text-red-400 uppercase">Category</label> {/* //* */}
        <select 
          className="text-sm text-slate-950 dark:text-white outline-none bg-slate-50 dark:bg-slate-700 p-2 rounded cursor-pointer" //*
          value={category} 
          onChange={({ target }) => setCategory(target.value)} 
        > 
          <option className="bg-white text-black dark:bg-slate-800 dark:text-white" value="General">General</option> {/* //* */}
          <option className="bg-white text-black dark:bg-slate-800 dark:text-white" value="Work">Work</option> {/* //* */}
          <option className="bg-white text-black dark:bg-slate-800 dark:text-white" value="Personal">Personal</option> {/* //* */}
          <option className="bg-white text-black dark:bg-slate-800 dark:text-white" value="Study">Study</option> {/* //* */}
          <option className="bg-white text-black dark:bg-slate-800 dark:text-white" value="Ideas">Ideas</option> {/* //* */}
        </select> 
      </div> 

      <ReminderInput reminderAt={reminderAt} setReminderAt={setReminderAt} /> {/* //* */}

      <div className="mt-3">
        <label className="input-label text-red-500 uppercase">tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;