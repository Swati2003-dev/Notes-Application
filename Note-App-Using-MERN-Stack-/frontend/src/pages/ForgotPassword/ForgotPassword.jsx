import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/auth/forgot-password",
        { email },
        { withCredentials: true }
      );

      if (res.data.success === false) {
        toast.error(res.data.message);
        setError(res.data.message);
        setLoading(false);
        return;
      }
      
      toast.success(res.data.message || "Reset link sent to your email!");
      setLoading(false);
      // Wait a moment then navigate to login
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-28">
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={handleForgotPassword}>
          <h4 className="text-2xl mb-2">Forgot Password</h4>
          <p className="text-sm text-gray-500 mb-6">
            Enter your email and we'll send you a link to reset your password.
          </p>

          <input
            type="text"
            placeholder="Email"
            className="input-box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm pb-1">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="text-sm text-center mt-4">
            Remember your password?
            <Link to="/login" className="font-medium text-[#2B85FF] underline pl-2">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
