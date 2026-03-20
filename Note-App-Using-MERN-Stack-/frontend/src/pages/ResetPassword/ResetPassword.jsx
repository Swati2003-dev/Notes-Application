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
        `http://localhost:3000/api/auth/reset-password/${token}`,
        { password },
        { withCredentials: true }
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
      const errorMsg = error.response?.data?.message || "Link has expired or is invalid.";
      toast.error(errorMsg);
      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-28">
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={handleResetPassword}>
          <h4 className="text-2xl mb-2">Reset Password</h4>
          <p className="text-sm text-gray-500 mb-6">
            Please enter your new password below.
          </p>

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
          />
          
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
          />

          {error && <p className="text-red-500 text-sm pb-1">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <p className="text-sm text-center mt-4">
            <Link to="/login" className="font-medium text-[#2B85FF] underline pl-2">
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
