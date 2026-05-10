import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { token } = useParams();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password) {
      setError("Please enter a new password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"}/api/auth/reset-password/${token}`,
        { password },
        { withCredentials: true },
      );

      if (res.data.success === false) {
        toast.error(res.data.message);
        setError(res.data.message);
        setLoading(false);
        return;
      }

      toast.success(res.data.message || "Password resetted successfully!");
      setLoading(false);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Link has expired or is invalid.";
      toast.error(errorMsg);
      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090f] flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300">
      {/* Ambient glow orbs */}
      <div className="absolute top-[-120px] right-[-80px] w-[420px] h-[420px] rounded-full bg-purple-400/20 dark:bg-purple-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[360px] h-[360px] rounded-full bg-indigo-400/20 dark:bg-indigo-500/15 blur-[100px] pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/60 dark:bg-white/[0.04] border border-white/40 dark:border-white/[0.08] rounded-2xl px-10 py-12 shadow-xl dark:shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-colors duration-300">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-purple-500 dark:text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
            />
          </svg>
        </div>

        {/* Header */}
        <p className="text-purple-500 dark:text-purple-400 text-[11px] font-semibold tracking-[0.18em] uppercase mb-2">
          Almost there
        </p>
        <h4 className="text-3xl font-semibold text-slate-800 dark:text-white/90 mb-3 leading-snug">
          Reset your{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            password
          </span>
        </h4>
        <p className="text-sm text-slate-500 dark:text-white/35 mb-8 leading-relaxed">
          Please enter your new password below. Make sure it's strong and
          memorable.
        </p>

        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-slate-500 dark:text-white/40 tracking-wide uppercase">
              New password
            </label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-slate-500 dark:text-white/40 tracking-wide uppercase">
              Confirm password
            </label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
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
            disabled={loading}
            className="w-full mt-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 text-white text-sm font-medium tracking-wide shadow-md dark:shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(99,102,241,0.55)] hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none dark:disabled:hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)] disabled:hover:brightness-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin w-4 h-4 text-white/70"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent my-1" />

          {/* Back to login */}
          <p className="text-center text-xs text-slate-500 dark:text-white/35">
            <Link
              to="/login"
              className="text-indigo-500 dark:text-indigo-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-300 hover:underline transition-colors"
            >
              ← Back to Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
