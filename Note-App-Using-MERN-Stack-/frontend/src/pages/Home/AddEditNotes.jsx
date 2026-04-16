// import React from "react";
// import { MdClose } from "react-icons/md";
// import { useState, useEffect, useRef } from "react";
// import TagInput from "../../components/Input/TagInput";
// import ReminderInput from "../../components/Input/ReminderInput";
// import { io } from "socket.io-client";
// import axios from "axios";
// import { toast } from "react-toastify";

// const AddEditNotes = ({ onClose, noteData, type, getAllNotes }) => {
//   const [title, setTitle] = useState(noteData?.title || "");
//   const [content, setContent] = useState(noteData?.content || "");
//   const [tags, setTags] = useState(noteData?.tags || []);
//   const [category, setCategory] = useState(noteData?.category || "General");
//   const [reminderAt, setReminderAt] = useState(noteData?.reminderAt || null);
//   const [error, setError] = useState(null);

//   // * Socket.io Real-Time Collaboration Setup
//   const socketRef = useRef(null);
//   const isExternalChange = useRef(false);

//   useEffect(() => {
//     if (type !== "edit" || !noteData?._id) return;

//     socketRef.current = io(
//       (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") + "",
//       {
//         forceNew: true,
//         withCredentials: true,
//         transports: ["websocket"],
//       },
//     );

//     socketRef.current.on("connect", () => {
//       toast.success("Socket connected perfectly!");
//     });

//     socketRef.current.on("connect_error", (err) => {
//       toast.error(`Socket Blocked: ${err.message}`);
//     });

//     socketRef.current.emit("join-note", noteData._id);

//     socketRef.current.on("receive-changes", (newPayload) => {
//       isExternalChange.current = true;
//       if (newPayload.title !== undefined) setTitle(newPayload.title);
//       if (newPayload.content !== undefined) setContent(newPayload.content);
//       setTimeout(() => {
//         isExternalChange.current = false;
//       }, 100);
//     });

//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, [type, noteData]);

//   // * Silent Background Auto-Save
//   const autoSaveNote = async (currentTitle, currentContent) => {
//     if (type !== "edit" || !noteData?._id) return;
//     try {
//       await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/api/note/edit/${noteData._id}`,
//         {
//           title: currentTitle,
//           content: currentContent,
//           tags,
//           category,
//           reminderAt,
//         },
//         { withCredentials: true },
//       );
//       getAllNotes();
//     } catch (error) {
//       console.log("Auto-save error:", error.message);
//     }
//   };

//   useEffect(() => {
//     if (type !== "edit" || !noteData?._id) return;
//     if (isExternalChange.current) return;

//     const timeoutId = setTimeout(() => {
//       if (title.trim() || content.trim()) {
//         autoSaveNote(title, content);
//       }
//     }, 1500);

//     return () => clearTimeout(timeoutId);
//   }, [title, content]);

//   const editNote = async () => {
//     const noteId = noteData._id;
//     try {
//       const res = await axios.post(
//         (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") +
//           "/api/note/edit/" +
//           noteId,
//         { title, content, tags, category, reminderAt },
//         { withCredentials: true },
//       );
//       if (res.data.success === false) {
//         setError(res.data.message);
//         toast.error(res.data.message);
//         return;
//       }
//       toast.success(res.data.message);
//       getAllNotes();
//       onClose();
//     } catch (error) {
//       setError(error.message);
//       toast.error(error.message);
//     }
//   };

//   const addNewNote = async () => {
//     try {
//       const res = await axios.post(
//         (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") +
//           "/api/note/add",
//         { title, content, tags, category, reminderAt },
//         { withCredentials: true },
//       );
//       if (res.data.success === false) {
//         setError(res.data.message);
//         toast.error(res.data.message);
//         return;
//       }
//       toast.success(res.data.message);
//       getAllNotes();
//       onClose();
//     } catch (error) {
//       setError(error.message);
//       toast.error(error.message);
//     }
//   };

//   const handleAddNote = () => {
//     if (!title) {
//       setError("Please enter the Title");
//       return;
//     }
//     if (!content) {
//       setError("Please enter the Content");
//       return;
//     }
//     setError("");
//     if (type === "edit") {
//       editNote();
//     } else {
//       addNewNote();
//     }
//   };

//   return (
//     <div className="relative bg-[#09090f] rounded-2xl p-6 border border-white/[0.08] shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
//       {/* Close button */}
//       <button
//         onClick={onClose}
//         className="w-8 h-8 rounded-lg flex items-center justify-center absolute -top-3 -right-3 bg-white/[0.05] border border-white/10 text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
//       >
//         <MdClose className="text-base" />
//       </button>

//       {/* Header badge */}
//       <div className="mb-5">
//         <span className="text-[10px] font-semibold tracking-[0.18em] uppercase px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
//           {type === "edit" ? "Editing note" : "New note"}
//         </span>
//       </div>

//       {/* Title */}
//       <div className="flex flex-col gap-1.5 mb-5">
//         <label className="text-[10px] font-semibold tracking-[0.15em] uppercase text-indigo-400/80">
//           Title
//         </label>
//         <input
//           type="text"
//           className="text-2xl font-semibold text-white/90 bg-transparent outline-none placeholder:text-white/15 border-b border-white/[0.07] pb-2 focus:border-indigo-500/40 transition-colors duration-200"
//           placeholder="Note title..."
//           value={title}
//           onChange={({ target }) => {
//             setTitle(target.value);
//             if (
//               !isExternalChange.current &&
//               type === "edit" &&
//               socketRef.current
//             ) {
//               socketRef.current.emit("send-changes", noteData._id, {
//                 title: target.value,
//               });
//             }
//           }}
//         />
//       </div>

//       {/* Content */}
//       <div className="flex flex-col gap-1.5 mb-5">
//         <label className="text-[10px] font-semibold tracking-[0.15em] uppercase text-indigo-400/80">
//           Content
//         </label>
//         <textarea
//           className="text-sm text-white/80 outline-none bg-white/[0.03] border border-white/[0.07] rounded-xl p-3 resize-none placeholder:text-white/20 focus:border-indigo-500/40 focus:bg-indigo-500/[0.04] focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
//           placeholder="Write your note here..."
//           rows={8}
//           value={content}
//           onChange={({ target }) => {
//             setContent(target.value);
//             if (
//               !isExternalChange.current &&
//               type === "edit" &&
//               socketRef.current
//             ) {
//               socketRef.current.emit("send-changes", noteData._id, {
//                 content: target.value,
//               });
//             }
//           }}
//         />
//       </div>

//       {/* Category */}
//       <div className="flex flex-col gap-1.5 mb-5">
//         <label className="text-[10px] font-semibold tracking-[0.15em] uppercase text-indigo-400/80">
//           Category
//         </label>
//         <select
//           className="text-sm text-white/80 outline-none bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2.5 cursor-pointer focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 appearance-none"
//           value={category}
//           onChange={({ target }) => setCategory(target.value)}
//           style={{
//             backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
//             backgroundRepeat: "no-repeat",
//             backgroundPosition: "right 12px center",
//             backgroundSize: "16px",
//           }}
//         >
//           {["General", "Work", "Personal", "Study", "Ideas"].map((cat) => (
//             <option key={cat} value={cat} className="bg-[#0f0f1a] text-white">
//               {cat}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Reminder */}
//       <div className="flex flex-col gap-1.5 mb-5">
//         <label className="text-[10px] font-semibold tracking-[0.15em] uppercase text-indigo-400/80">
//           Reminder
//         </label>
//         <div className="[&_input]:bg-white/[0.03] [&_input]:border [&_input]:border-white/[0.07] [&_input]:rounded-xl [&_input]:px-3 [&_input]:py-2.5 [&_input]:text-sm [&_input]:text-white/80 [&_input]:outline-none [&_input]:w-full [&_input]:transition-all [&_input]:focus:border-indigo-500/40 [&_input]:focus:ring-1 [&_input]:focus:ring-indigo-500/20 [&_svg]:text-indigo-400/60">
//           <ReminderInput
//             reminderAt={reminderAt}
//             setReminderAt={setReminderAt}
//           />
//         </div>
//       </div>

//       {/* Tags */}
//       <div className="flex flex-col gap-1.5 mb-5">
//         <label className="text-[10px] font-semibold tracking-[0.15em] uppercase text-indigo-400/80">
//           Tags
//         </label>
//         <div
//           className="
//           [&_input]:bg-white/[0.03] [&_input]:border [&_input]:border-white/[0.07] [&_input]:rounded-xl
//           [&_input]:px-3 [&_input]:py-2.5 [&_input]:text-sm [&_input]:text-white/80
//           [&_input]:outline-none [&_input]:transition-all [&_input]:placeholder:text-white/20
//           [&_input]:focus:border-indigo-500/40 [&_input]:focus:ring-1 [&_input]:focus:ring-indigo-500/20
//           [&_button]:bg-indigo-600 [&_button]:hover:bg-indigo-500 [&_button]:text-white
//           [&_button]:rounded-xl [&_button]:transition-all [&_button]:border-0
//           [&_.tag]:bg-indigo-500/10 [&_.tag]:border [&_.tag]:border-indigo-500/20
//           [&_.tag]:text-indigo-300 [&_.tag]:rounded-lg [&_.tag]:text-xs
//         "
//         >
//           <TagInput tags={tags} setTags={setTags} />
//         </div>
//       </div>

//       {/* Error */}
//       {error && (
//         <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5 mb-4">
//           {error}
//         </p>
//       )}

//       {/* Submit */}
//       <button
//         className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium tracking-wide shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.55)] hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.99] transition-all duration-200 cursor-pointer"
//         onClick={handleAddNote}
//       >
//         {type === "edit" ? "Update Note" : "Add Note"}
//       </button>
//     </div>
//   );
// };

// export default AddEditNotes;

//-------------------------------------------------------------------------------------------

// import React from "react";
// import { MdClose } from "react-icons/md";
// import { useState, useEffect, useRef } from "react";
// import TagInput from "../../components/Input/TagInput";
// import ReminderInput from "../../components/Input/ReminderInput";
// import { io } from "socket.io-client";
// import axios from "axios";
// import { toast } from "react-toastify";

// const AddEditNotes = ({ onClose, noteData, type, getAllNotes }) => {
//   const [title, setTitle] = useState(noteData?.title || "");
//   const [content, setContent] = useState(noteData?.content || "");
//   const [tags, setTags] = useState(noteData?.tags || []);
//   const [category, setCategory] = useState(noteData?.category || "General");
//   const [reminderAt, setReminderAt] = useState(noteData?.reminderAt || null);
//   const [error, setError] = useState(null);

//   const socketRef = useRef(null);
//   const isExternalChange = useRef(false);

//   useEffect(() => {
//     if (type !== "edit" || !noteData?._id) return;

//     socketRef.current = io(
//       (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") + "",
//       { forceNew: true, withCredentials: true, transports: ["websocket"] }
//     );

//     socketRef.current.on("connect", () => toast.success("Socket connected perfectly!"));
//     socketRef.current.on("connect_error", (err) => toast.error(`Socket Blocked: ${err.message}`));
//     socketRef.current.emit("join-note", noteData._id);

//     socketRef.current.on("receive-changes", (newPayload) => {
//       isExternalChange.current = true;
//       if (newPayload.title !== undefined) setTitle(newPayload.title);
//       if (newPayload.content !== undefined) setContent(newPayload.content);
//       setTimeout(() => { isExternalChange.current = false; }, 100);
//     });

//     return () => { socketRef.current.disconnect(); };
//   }, [type, noteData]);

//   const autoSaveNote = async (currentTitle, currentContent) => {
//     if (type !== "edit" || !noteData?._id) return;
//     try {
//       await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/api/note/edit/${noteData._id}`,
//         { title: currentTitle, content: currentContent, tags, category, reminderAt },
//         { withCredentials: true }
//       );
//       getAllNotes();
//     } catch (error) {
//       console.log("Auto-save error:", error.message);
//     }
//   };

//   useEffect(() => {
//     if (type !== "edit" || !noteData?._id) return;
//     if (isExternalChange.current) return;
//     const timeoutId = setTimeout(() => {
//       if (title.trim() || content.trim()) autoSaveNote(title, content);
//     }, 1500);
//     return () => clearTimeout(timeoutId);
//   }, [title, content]);

//   const editNote = async () => {
//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/api/note/edit/${noteData._id}`,
//         { title, content, tags, category, reminderAt },
//         { withCredentials: true }
//       );
//       if (res.data.success === false) { setError(res.data.message); toast.error(res.data.message); return; }
//       toast.success(res.data.message); getAllNotes(); onClose();
//     } catch (error) { setError(error.message); toast.error(error.message); }
//   };

//   const addNewNote = async () => {
//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/api/note/add`,
//         { title, content, tags, category, reminderAt },
//         { withCredentials: true }
//       );
//       if (res.data.success === false) { setError(res.data.message); toast.error(res.data.message); return; }
//       toast.success(res.data.message); getAllNotes(); onClose();
//     } catch (error) { setError(error.message); toast.error(error.message); }
//   };

//   const handleAddNote = () => {
//     if (!title) { setError("Please enter the Title"); return; }
//     if (!content) { setError("Please enter the Content"); return; }
//     setError("");
//     type === "edit" ? editNote() : addNewNote();
//   };

//   const fieldClass = "text-sm text-white/80 outline-none bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 w-full placeholder:text-white/20 focus:border-indigo-500/50 focus:bg-indigo-500/[0.05] focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200";
//   const labelClass = "text-[10px] font-bold tracking-[0.16em] uppercase text-indigo-400/70 mb-1.5 block";

//   return (
//     <div className="relative bg-[#0c0c15] rounded-2xl border border-white/[0.08] shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden">

//       {/* Top gradient bar */}
//       <div className="h-[2px] w-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600" />

//       {/* Header */}
//       <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.06]">
//         <div className="flex items-center gap-3">
//           <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
//             <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               {type === "edit"
//                 ? <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
//                 : <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
//               }
//             </svg>
//           </div>
//           <div>
//             <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-indigo-400/70 leading-none mb-0.5">
//               {type === "edit" ? "Edit note" : "New note"}
//             </p>
//             <p className="text-xs text-white/30 leading-none">
//               {type === "edit" ? "Changes auto-save" : "Fill in the details below"}
//             </p>
//           </div>
//         </div>

//         <button
//           onClick={onClose}
//           className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.04] border border-white/[0.08] text-white/30 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200"
//         >
//           <MdClose className="text-sm" />
//         </button>
//       </div>

//       {/* Body */}
//       <div className="px-6 py-5 flex flex-col gap-4">

//         {/* Title */}
//         <div>
//           <label className={labelClass}>Title</label>
//           <input
//             type="text"
//             className="w-full text-xl font-semibold text-white/90 bg-transparent outline-none placeholder:text-white/15 border-b border-white/[0.08] pb-2 focus:border-indigo-500/40 transition-colors duration-200"
//             placeholder="Note title..."
//             value={title}
//             onChange={({ target }) => {
//               setTitle(target.value);
//               if (!isExternalChange.current && type === "edit" && socketRef.current) {
//                 socketRef.current.emit("send-changes", noteData._id, { title: target.value });
//               }
//             }}
//           />
//         </div>

//         {/* Content */}
//         <div>
//           <label className={labelClass}>Content</label>
//           <textarea
//             className={`${fieldClass} resize-none`}
//             placeholder="Write your note here..."
//             rows={5}
//             value={content}
//             onChange={({ target }) => {
//               setContent(target.value);
//               if (!isExternalChange.current && type === "edit" && socketRef.current) {
//                 socketRef.current.emit("send-changes", noteData._id, { content: target.value });
//               }
//             }}
//           />
//         </div>

//         {/* Category + Reminder — side by side */}
//         <div className="grid grid-cols-2 gap-3">
//           <div>
//             <label className={labelClass}>Category</label>
//             <select
//               className={`${fieldClass} cursor-pointer appearance-none`}
//               value={category}
//               onChange={({ target }) => setCategory(target.value)}
//               style={{
//                 backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "right 10px center",
//                 backgroundSize: "14px",
//               }}
//             >
//               {["General", "Work", "Personal", "Study", "Ideas"].map((cat) => (
//                 <option key={cat} value={cat} className="bg-[#0c0c15] text-white">{cat}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className={labelClass}>Reminder</label>
//             <div className={`
//               [&_input]:bg-white/[0.04] [&_input]:border [&_input]:border-white/[0.08]
//               [&_input]:rounded-xl [&_input]:px-3 [&_input]:py-2.5
//               [&_input]:text-sm [&_input]:text-white/80 [&_input]:outline-none [&_input]:w-full
//               [&_input]:transition-all [&_input]:focus:border-indigo-500/50 [&_input]:focus:ring-1
//               [&_input]:focus:ring-indigo-500/20 [&_input]:focus:bg-indigo-500/[0.05]
//               [&_svg]:text-indigo-400/50 [&_svg]:w-3.5 [&_svg]:h-3.5
//             `}>
//               <ReminderInput reminderAt={reminderAt} setReminderAt={setReminderAt} />
//             </div>
//           </div>
//         </div>

//         {/* Tags */}
//         <div>
//           <label className={labelClass}>Tags</label>
//           <div className={`
//             [&_input]:bg-white/[0.04] [&_input]:border [&_input]:border-white/[0.08] [&_input]:rounded-xl
//             [&_input]:px-3 [&_input]:py-2.5 [&_input]:text-sm [&_input]:text-white/80
//             [&_input]:outline-none [&_input]:transition-all [&_input]:placeholder:text-white/20
//             [&_input]:focus:border-indigo-500/50 [&_input]:focus:ring-1 [&_input]:focus:ring-indigo-500/20
//             [&_input]:focus:bg-indigo-500/[0.05]
//             [&_button]:bg-indigo-600/80 [&_button]:hover:bg-indigo-500 [&_button]:text-white
//             [&_button]:rounded-xl [&_button]:px-3 [&_button]:transition-all [&_button]:border-0
//             [&_.tag]:bg-indigo-500/10 [&_.tag]:border [&_.tag]:border-indigo-500/20
//             [&_.tag]:text-indigo-300 [&_.tag]:rounded-lg [&_.tag]:text-xs [&_.tag]:px-2 [&_.tag]:py-0.5
//           `}>
//             <TagInput tags={tags} setTags={setTags} />
//           </div>
//         </div>

//         {/* Error */}
//         {error && (
//           <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
//             {error}
//           </p>
//         )}
//       </div>

//       {/* Footer */}
//       <div className="px-6 pb-6">
//         <button
//           className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium tracking-wide shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.55)] hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.99] transition-all duration-200 cursor-pointer"
//           onClick={handleAddNote}
//         >
//           {type === "edit" ? "Update Note" : "Add Note"}
//         </button>
//       </div>

//     </div>
//   );
// };

// export default AddEditNotes;

//-----------------------------------------------------------------------------------------------

import React from "react";
import { MdClose } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import TagInput from "../../components/Input/TagInput";
import ReminderInput from "../../components/Input/ReminderInput";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";

const AddEditNotes = ({ onClose, noteData, type, getAllNotes }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [category, setCategory] = useState(noteData?.category || "General");
  const [reminderAt, setReminderAt] = useState(noteData?.reminderAt || null);
  const [error, setError] = useState(null);

  const socketRef = useRef(null);
  const isExternalChange = useRef(false);

  useEffect(() => {
    if (type !== "edit" || !noteData?._id) return;

    socketRef.current = io(
      (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") + "",
      { forceNew: true, withCredentials: true, transports: ["websocket"] }
    );

    socketRef.current.on("connect", () => toast.success("Socket connected perfectly!"));
    socketRef.current.on("connect_error", (err) => toast.error(`Socket Blocked: ${err.message}`));
    socketRef.current.emit("join-note", noteData._id);

    socketRef.current.on("receive-changes", (newPayload) => {
      isExternalChange.current = true;
      if (newPayload.title !== undefined) setTitle(newPayload.title);
      if (newPayload.content !== undefined) setContent(newPayload.content);
      setTimeout(() => { isExternalChange.current = false; }, 100);
    });

    return () => { socketRef.current.disconnect(); };
  }, [type, noteData]);

  const autoSaveNote = async (currentTitle, currentContent) => {
    if (type !== "edit" || !noteData?._id) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/api/note/edit/${noteData._id}`,
        { title: currentTitle, content: currentContent, tags, category, reminderAt },
        { withCredentials: true }
      );
      getAllNotes();
    } catch (error) {
      console.log("Auto-save error:", error.message);
    }
  };

  useEffect(() => {
    if (type !== "edit" || !noteData?._id) return;
    if (isExternalChange.current) return;
    const timeoutId = setTimeout(() => {
      if (title.trim() || content.trim()) autoSaveNote(title, content);
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [title, content]);

  const editNote = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/api/note/edit/${noteData._id}`,
        { title, content, tags, category, reminderAt },
        { withCredentials: true }
      );
      if (res.data.success === false) { setError(res.data.message); toast.error(res.data.message); return; }
      toast.success(res.data.message); getAllNotes(); onClose();
    } catch (error) { setError(error.message); toast.error(error.message); }
  };

  const addNewNote = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/api/note/add`,
        { title, content, tags, category, reminderAt },
        { withCredentials: true }
      );
      if (res.data.success === false) { setError(res.data.message); toast.error(res.data.message); return; }
      toast.success(res.data.message); getAllNotes(); onClose();
    } catch (error) { setError(error.message); toast.error(error.message); }
  };

  const handleAddNote = () => {
    if (!title) { setError("Please enter the Title"); return; }
    if (!content) { setError("Please enter the Content"); return; }
    setError("");
    type === "edit" ? editNote() : addNewNote();
  };

  // Shared field styles — theme aware
  const fieldClass = `
    w-full text-[15px] outline-none transition-all duration-200 rounded-xl px-4 py-3
    bg-slate-100 dark:bg-white/[0.04]
    border border-slate-200 dark:border-white/[0.08]
    text-slate-800 dark:text-white/85
    placeholder:text-slate-400 dark:placeholder:text-white/20
    focus:border-indigo-400 dark:focus:border-indigo-500/60
    focus:bg-white dark:focus:bg-indigo-500/[0.05]
    focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/20
  `;

  const labelClass = `
    text-[11px] font-bold tracking-[0.14em] uppercase mb-2 block
    text-indigo-500 dark:text-indigo-400/80
  `;

  return (
    <div className="
      relative rounded-2xl overflow-hidden
      bg-white dark:bg-[#0c0c15]
      border border-slate-200 dark:border-white/[0.08]
      shadow-[0_32px_80px_rgba(0,0,0,0.25)] dark:shadow-[0_32px_80px_rgba(0,0,0,0.7)]
    ">

      {/* Top accent bar */}
      <div className="h-[3px] w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />

      {/* ── Header ── */}
      <div className="
        flex items-center justify-between px-6 pt-5 pb-4
        border-b border-slate-100 dark:border-white/[0.06]
      ">
        <div className="flex items-center gap-3">
          {/* Icon badge */}
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {type === "edit"
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              }
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-indigo-500 dark:text-indigo-400/80 leading-none mb-1">
              {type === "edit" ? "Edit note" : "New note"}
            </p>
            <p className="text-[13px] text-slate-400 dark:text-white/30 leading-none">
              {type === "edit" ? "Changes auto-save as you type" : "Fill in the details below"}
            </p>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
            bg-slate-100 dark:bg-white/[0.04]
            border border-slate-200 dark:border-white/[0.08]
            text-slate-400 dark:text-white/30
            hover:text-slate-700 dark:hover:text-white
            hover:bg-slate-200 dark:hover:bg-white/[0.08]
            transition-all duration-200"
        >
          <MdClose className="text-base" />
        </button>
      </div>

      {/* ── Body ── */}
      <div className="px-6 py-5 flex flex-col gap-5">

        {/* Title */}
        <div>
          <label className={labelClass}>Title</label>
          <input
            type="text"
            className={`${fieldClass} text-xl font-semibold`}
            placeholder="Note title..."
            value={title}
            onChange={({ target }) => {
              setTitle(target.value);
              if (!isExternalChange.current && type === "edit" && socketRef.current) {
                socketRef.current.emit("send-changes", noteData._id, { title: target.value });
              }
            }}
          />
        </div>

        {/* Content */}
        <div>
          <label className={labelClass}>Content</label>
          <textarea
            className={`${fieldClass} resize-none leading-relaxed`}
            placeholder="Write your note here..."
            rows={5}
            value={content}
            onChange={({ target }) => {
              setContent(target.value);
              if (!isExternalChange.current && type === "edit" && socketRef.current) {
                socketRef.current.emit("send-changes", noteData._id, { content: target.value });
              }
            }}
          />
        </div>

        {/* Category + Reminder — 2 columns */}
        <div className="grid grid-cols-2 gap-4">

          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>
            <select
              className={`${fieldClass} cursor-pointer appearance-none`}
              value={category}
              onChange={({ target }) => setCategory(target.value)}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
                backgroundSize: "15px",
              }}
            >
              {["General", "Work", "Personal", "Study", "Ideas"].map((cat) => (
                <option key={cat} value={cat} className="bg-white dark:bg-[#0c0c15] text-slate-800 dark:text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Reminder — hide the inner label from ReminderInput, show ours */}
          <div>
            <label className={labelClass}>Reminder</label>
            {/*
              We suppress the label ReminderInput renders by hiding any <label>
              child while styling its <input> to match our design system.
            */}
            <div className="
              [&_label]:hidden
              [&_input]:w-full [&_input]:text-[15px] [&_input]:outline-none [&_input]:transition-all
              [&_input]:rounded-xl [&_input]:px-4 [&_input]:py-3 [&_input]:cursor-pointer
              [&_input]:bg-slate-100 dark:[&_input]:bg-white/[0.04]
              [&_input]:border [&_input]:border-slate-200 dark:[&_input]:border-white/[0.08]
              [&_input]:text-slate-800 dark:[&_input]:text-white/85
              [&_input]:focus:border-indigo-400 dark:[&_input]:focus:border-indigo-500/60
              [&_input]:focus:ring-2 [&_input]:focus:ring-indigo-200 dark:[&_input]:focus:ring-indigo-500/20
              [&_svg]:text-indigo-400 [&_svg]:w-4 [&_svg]:h-4
            ">
              <ReminderInput reminderAt={reminderAt} setReminderAt={setReminderAt} />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className={labelClass}>Tags</label>
          <div className="
            [&_input]:w-full [&_input]:text-[15px] [&_input]:outline-none [&_input]:transition-all
            [&_input]:rounded-xl [&_input]:px-4 [&_input]:py-3
            [&_input]:bg-slate-100 dark:[&_input]:bg-white/[0.04]
            [&_input]:border [&_input]:border-slate-200 dark:[&_input]:border-white/[0.08]
            [&_input]:text-slate-800 dark:[&_input]:text-white/85
            [&_input]:placeholder:text-slate-400 dark:[&_input]:placeholder:text-white/20
            [&_input]:focus:border-indigo-400 dark:[&_input]:focus:border-indigo-500/60
            [&_input]:focus:ring-2 [&_input]:focus:ring-indigo-200 dark:[&_input]:focus:ring-indigo-500/20
            [&_button]:w-11 [&_button]:h-11 [&_button]:flex [&_button]:items-center [&_button]:justify-center
            [&_button]:bg-indigo-600 [&_button]:hover:bg-indigo-500
            [&_button]:text-white [&_button]:rounded-xl [&_button]:transition-all [&_button]:border-0
            [&_button]:text-xl [&_button]:font-bold [&_button]:flex-shrink-0
            [&_.tag]:bg-indigo-50 dark:[&_.tag]:bg-indigo-500/10
            [&_.tag]:border [&_.tag]:border-indigo-200 dark:[&_.tag]:border-indigo-500/20
            [&_.tag]:text-indigo-600 dark:[&_.tag]:text-indigo-300
            [&_.tag]:rounded-lg [&_.tag]:text-[13px] [&_.tag]:px-2.5 [&_.tag]:py-1
          ">
            <TagInput tags={tags} setTags={setTags} />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3">
            {error}
          </p>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="px-6 pb-6">
        <button
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[15px] font-semibold tracking-wide shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.55)] hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.99] transition-all duration-200 cursor-pointer"
          onClick={handleAddNote}
        >
          {type === "edit" ? "Update Note" : "Add Note"}
        </button>
      </div>

    </div>
  );
};

export default AddEditNotes;