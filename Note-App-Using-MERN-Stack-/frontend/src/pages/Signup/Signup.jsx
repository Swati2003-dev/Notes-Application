import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axios from "axios";
import { toast } from "react-toastify";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    // sign up api
    try {
      const res = await axios.post(
        (import.meta.env.VITE_BACKEND_URL || "http://localhost:3001") +
          "/api/auth/signup",
        { username: name, email, password },
        { withCredentials: true }
      );

      if (res.data.success === false) {
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      setError("");
      navigate("/login");
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      toast.error(errorMsg);
      console.log(errorMsg);
      setError(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090f] flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300">

      {/* Ambient glow orbs */}
      <div className="absolute top-[-120px] right-[-120px] w-[480px] h-[480px] rounded-full bg-purple-400/20 dark:bg-purple-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[380px] h-[380px] rounded-full bg-indigo-400/20 dark:bg-indigo-500/15 blur-[100px] pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/60 dark:bg-white/[0.04] border border-white/40 dark:border-white/[0.08] rounded-2xl px-6 sm:px-10 py-8 sm:py-12 shadow-xl dark:shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-colors duration-300">

        {/* Header */}
        <p className="text-purple-500 dark:text-purple-400 text-[11px] font-semibold tracking-[0.18em] uppercase mb-2">
          Get started
        </p>
        <h4 className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-white/90 mb-8 leading-snug">
          Create your{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            free account
          </span>
        </h4>

        <form onSubmit={handleSignUp} className="flex flex-col gap-4">

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-white/40 tracking-wide uppercase">
              Full name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent dark:bg-white/[0.05] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white/90 placeholder:text-slate-400 dark:placeholder:text-white/25 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:bg-indigo-50/50 dark:focus:bg-indigo-500/[0.06] focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-white/40 tracking-wide uppercase">
              Email address
            </label>
            <input
              type="text"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent dark:bg-white/[0.05] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white/90 placeholder:text-slate-400 dark:placeholder:text-white/25 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:bg-indigo-50/50 dark:focus:bg-indigo-500/[0.06] focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-white/40 tracking-wide uppercase">
              Password
            </label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 dark:text-red-400 text-xs bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2.5">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 text-white text-sm font-medium tracking-wide shadow-md dark:shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(99,102,241,0.55)] hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.99] transition-all duration-200 cursor-pointer"
          >
            Create account
          </button>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent my-1" />

          {/* Login link */}
          <p className="text-center text-xs text-slate-500 dark:text-white/35">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-500 dark:text-indigo-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-300 hover:underline transition-colors ml-1"
            >
              Sign in
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Signup;