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
        "http://localhost:3000/api/auth/signin",
        {
          email,
          password,
        },
        { withCredentials: true },
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
      toast.error(error.message);
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="flex items-center justify-center mt-28">
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={handleLogin}>
          <h4 className="text-2xl mb-7">Login</h4>
          <input
            type="text"
            placeholder="Email"
            className="input-box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-end mt-1 mb-4">
            <Link to="/forgot-password" className="text-sm font-medium text-[#2B85FF] hover:underline">
              Forgot Password?
            </Link>
          </div>

          {error && <p className="text-red-500 text-sm pb-1">{error}</p>}
          <button type="submit" className="btn-primary">
            Login
          </button>

          <p className="text-sm text-center mt-4">
            Not registered yet?
            <Link
              to={"/signup"}
              className="font-medium text-[#2B85FF] underline pl-2"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
