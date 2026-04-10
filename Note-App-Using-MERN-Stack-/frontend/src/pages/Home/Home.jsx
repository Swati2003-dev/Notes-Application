import React, { useEffect } from "react";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditNotes from "./AddEditNotes";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import ReminderTracker from "../../components/ReminderTracker"; //*
import ShareNoteModal from "../../components/ShareNoteModal"; //*

const Home = () => {
  const { currentUser, loading, errorDispatch } = useSelector(
    (state) => state.user,
  );
  const [userInfo, setUserInfo] = useState("");
  const [allNotes, setAllNotes] = useState([]);

  console.log(allNotes);

  const navigate = useNavigate();
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [openShareModal, setOpenShareModal] = useState({ //*
    isShown: false, //*
    data: null, //*
  }); //*
  const [isSearch, setIsSearch] = useState(false);
  const [filterParams, setFilterParams] = useState({ tag: "", category: "" }); //*

  useEffect(() => {
    if (currentUser === null || !currentUser) {
      navigate("/login");
    } else {
      setUserInfo(currentUser);
      getAllNotes();
    }
  }, [filterParams]); //* added filterParams to dependency array to refetch on change

  //get all notes
  const getAllNotes = async () => {
    try {
      const res = await axios.get((import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") + "/api/note/all", {
        params: filterParams, //* pass the filters to backend
        withCredentials: true,
      });

      if (res.data.success === false) {
        console.log(res.data);
        return;
      }
      console.log(res.data);

      setAllNotes(res.data.notes);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = (noteDetails) => {
    setOpenAddEditModel({ isShown: true, data: noteDetails, type: "edit" });
  };

  const handleShare = (noteDetails) => { //*
    setOpenShareModal({ isShown: true, data: noteDetails }); //*
  }; //*

  //Delete  note
  const deleteNote = async (data) => {
    const noteId = data._id;

    try {
      const res = await axios.delete(
        (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") + "/api/note/delete/" + noteId,
        { withCredentials: true },
      );

      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      getAllNotes();
    } catch (error) {
      toast.error(error.message);
    }
  };
  const onSearchNote = async (query) => {
    try {
      const res = await axios.get((import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") + "/api/note/search", {
        params: { query },
        withCredentials: true,
      });

      if (res.data.success === false) {
        console.log(res.data.message);
        toast.error(res.data.message);
        return;
      }
      setIsSearch(true);
      setAllNotes(res.data.notes);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };
  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;

    try {
      const res = await axios.put(
        (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") + "/api/note/update-note-pinned/" + noteId,
        { isPinned: !noteData.isPinned },
        { withCredentials: true },
      );
      if (res.data.success === false) {
        toast.error(res.data.message);
        console.log(res.data.message);
        return;
      }
      toast.success(res.data.message)
      getAllNotes()
    } catch (error) {
      console.log(error.message);
      
    }
  };

  const handleFilter = (type, value) => { //*
    setFilterParams((prev) => ({ ...prev, [type]: value })); //*
    setIsSearch(false); //* clear search when using filters
  }; //*

  const clearFilters = () => { //*
    setFilterParams({ tag: "", category: "" }); //*
  }; //*

  return (
    <>
      <ReminderTracker notes={allNotes} getAllNotes={getAllNotes} /> {/* //* */}
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      {/* Category Chips UI */} 
      <div className="container mx-auto px-5 mt-6"> 
        <div className="flex items-center justify-center gap-3 overflow-x-auto no-scrollbar pb-2"> 
          {["All", "General", "Work", "Personal", "Study", "Ideas"].map((cat) => ( 
            <button 
              key={cat} 
              onClick={() => handleFilter("category", cat === "All" ? "" : cat)} 
              className={`px-5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${ 
                (filterParams.category === cat || (cat === "All" && !filterParams.category)) 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700" //*
              }`} 
            > 
              {cat} 
            </button> 
          ))} 
        </div> 
      </div> 
      
      {/* Active Filters UI */} 
      {filterParams.tag && ( 
        <div className="container mx-auto px-5 mt-4 flex items-center justify-center gap-3"> 
          <span className="text-sm font-medium text-slate-700">Filters:</span> 
          {filterParams.tag && ( 
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"> 
              Tag: #{filterParams.tag} 
            </span> 
          )} 
          <button 
            onClick={clearFilters} 
            className="text-red-500 text-sm hover:underline ml-2" 
          > 
            Clear Filters 
          </button> 
        </div> 
      )} 

      <div className="container mx-auto">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 max-md:m-5">
            {allNotes.map((note, index) => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={note.createdAt}
                content={note.content}
                tags={note.tags}
                isPinned={note.isPinned}
                category={note.category} //*
                reminderAt={note.reminderAt} //*
                onFilter={handleFilter} //*
                onEdit={() => {
                  handleEdit(note);
                }}
                onShare={() => { //*
                  handleShare(note); //*
                }} //*
                onDelete={() => {
                  deleteNote(note);
                }}
                onPinNote={() => {
                  updateIsPinned(note)
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={
              isSearch
                ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtakcQoMFXwFwnlochk9fQSBkNYkO5rSyY9A&s"
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDCtZLuixBFGTqGKdWGLaSKiO3qyhW782aZA&s"
            }
            message={
              isSearch
                ? "Oops! No Notes found matching your search"
                : `Ready to capture your ideas? Click the 'Add' button to start noting down your thoughts, inspiration and reminders. Let's get started!`
            }
          />
        )}
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#2B85FF] hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModel({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal //*
        isOpen={openShareModal.isShown} //*
        onRequestClose={() => {}} //*
        style={{ //*
          overlay: { backgroundColor: "rgba(0,0,0,0.5)" }, //*
        }} //*
        contentLabel="" //*
        className="w-[40%] max-md:w-[60%] max-sm:w-[70%] max-h-3/4 bg-white dark:bg-slate-800 rounded-md mx-auto mt-14 p-5 overflow-scroll transition-colors duration-300" //*
      > 
        <ShareNoteModal //*
          noteData={openShareModal.data} //*
          onClose={() => setOpenShareModal({ isShown: false, data: null })} //*
          getAllNotes={getAllNotes} //*
        /> 
      </Modal> 

      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)", //* slightly darker overlay for both modes
          },
        }}
        contentLabel=""
        className="w-[40%] max-md:w-[60%] max-sm:w-[70%] max-h-3/4 bg-white dark:bg-slate-800 rounded-md mx-auto mt-14 p-5 overflow-scroll transition-colors duration-300" //*
      >
        <AddEditNotes
          onClose={() =>
            setOpenAddEditModel({ isShown: false, type: "add", data: null })
          }
          noteData={openAddEditModel.data}
          type={openAddEditModel.type}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </>
  );
};

export default Home;
