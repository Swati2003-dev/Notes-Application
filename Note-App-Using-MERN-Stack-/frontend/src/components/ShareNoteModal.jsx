import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";

const ShareNoteModal = ({ noteData, onClose, getAllNotes }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleShare = async () => {
    if (!email) {
      setError("Please enter an email address");
      return;
    }
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/api/note/share-note/${noteData._id}`,
        { email },
        { withCredentials: true }
      );
      if (res.data.success === false) {
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      getAllNotes();
      onClose();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50 dark:hover:bg-slate-700"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>
      
      <h2 className="text-xl font-medium text-slate-900 dark:text-white mb-4">
        Share Note
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Enter the email of the user you want to collaborate with in real-time.
      </p>
      
      <div className="flex flex-col gap-2">
        <label className="input-label text-blue-500 uppercase">Email Address</label>
        <input
          type="email"
          className="text-sm text-slate-950 dark:text-white outline-none bg-slate-50 dark:bg-slate-700/50 p-3 rounded border dark:border-slate-600 focus:border-blue-500"
          placeholder="friend@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
      
      <button
        className="btn-primary font-medium mt-5 p-3 w-full text-center"
        onClick={handleShare}
      >
        SEND INVITE
      </button>
    </div>
  );
};

export default ShareNoteModal;
