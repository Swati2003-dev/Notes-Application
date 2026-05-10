import React from "react";
import { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter a password");
      return;
    }
    setError("");

    //Login API
    try {
      dispatch(signInStart());

      const res = await axios.post(
        (import.meta.env.VITE_BACKEND_URL || "http://localhost:3001") +
          "/api/auth/signin",
        { email, password },
        { withCredentials: true }
      );

      if (res.data.success === false) {
        console.log(res.data);
        toast.error(res.data.message);
        dispatch(signInFailure(res.data.message));
        return;
      }
      toast.success(res.data.message);
      dispatch(signInSuccess(res.data.user));
      navigate("/");
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      toast.error(errorMsg);
      dispatch(signInFailure(errorMsg));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090f] flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300">

      {/* Ambient glow orbs */}
      <div className="absolute top-[-120px] left-[-120px] w-[480px] h-[480px] rounded-full bg-indigo-400/20 dark:bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full bg-purple-400/20 dark:bg-purple-500/15 blur-[100px] pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/60 dark:bg-white/[0.04] border border-white/40 dark:border-white/[0.08] rounded-2xl px-6 sm:px-10 py-8 sm:py-12 shadow-xl dark:shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-colors duration-300">

        {/* Header */}
        <p className="text-indigo-500 dark:text-indigo-400 text-[11px] font-semibold tracking-[0.18em] uppercase mb-2">
          Welcome back
        </p>
        <h4 className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-white/90 mb-8 leading-snug">
          Sign in to your{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            account
          </span>
        </h4>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

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

          {/* Forgot Password */}
          <div className="flex justify-end -mt-1">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-indigo-500 dark:text-indigo-400/80 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
            >
              Forgot password?
            </Link>
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
            Sign in
          </button>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent my-1" />

          {/* Sign up */}
          <p className="text-center text-xs text-slate-500 dark:text-white/35">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-500 dark:text-indigo-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-300 hover:underline transition-colors ml-1"
            >
              Create one free
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;
