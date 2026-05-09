import React, { useState, useEffect } from "react"; //*
import { MdDarkMode, MdLightMode } from "react-icons/md"; //*
import SearchBar from "./SearchBar/SearchBar";
import ProfileInfo from "./Cards/ProfileInfo";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  signoutStart,
  signoutSuccess,
  signoutFailure,
} from "../redux/user/userSlice";
import { toast } from "react-toastify";

const Navbar = ({ userInfo, handleClearSearch, onSearchNote }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // * Theme Setup
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light"); 

  useEffect(() => { 
    if ( 
      theme === "dark" || 
      (!("theme" in localStorage) && 
        window.matchMedia("(prefers-color-scheme: dark)").matches) 
    ) { 
      document.documentElement.classList.add("dark"); 
    } else { 
      document.documentElement.classList.remove("dark"); 
    } 
  }, [theme]); 

  const toggleTheme = () => { 
    const newTheme = theme === "dark" ? "light" : "dark"; 
    setTheme(newTheme); 
    localStorage.setItem("theme", newTheme); 
  }; 

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };
  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };
  const onLogout = async () => {
    try {
      dispatch(signoutStart());

      const res = await axios.get((import.meta.env.VITE_BACKEND_URL || "http://localhost:3001") + "/api/auth/signout", {
        withCredentials: true,
      });

      if (res.data.success === false) {
        dispatch(signoutFailure(res.data.message));
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      dispatch(signoutSuccess());
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
      dispatch(signoutFailure(error.message));
    }
  };
  return (
    <div className="bg-white dark:bg-slate-800 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 drop-shadow transition-colors duration-300 gap-3">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <Link to={"/"}>
          <h2 className="text-xl font-medium text-black py-2">
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Good</span>
            <span className="text-slate-900 dark:text-white"> Notes</span>
          </h2>
        </Link>

        <div className="flex items-center gap-3 sm:hidden">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex justify-center items-center bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            {theme === "dark" ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
          </button>
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </div>
      </div>

      <SearchBar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <div className="hidden sm:flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full flex justify-center items-center bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          {theme === "dark" ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
        </button>
        <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
      </div>
    </div>
  );
};
export default Navbar;
