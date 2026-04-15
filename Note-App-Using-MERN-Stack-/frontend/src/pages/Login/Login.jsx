// import React from "react";
// import { useState } from "react";
// import PasswordInput from "../../components/Input/PasswordInput";
// import { Link, useNavigate } from "react-router-dom";
// import { validateEmail } from "../../utils/helper";
// import { useDispatch } from "react-redux";
// import {
//   signInFailure,
//   signInStart,
//   signInSuccess,
// } from "../../redux/user/userSlice";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!validateEmail(email)) {
//       setError("Please enter a valid email address");
//       return;
//     }
//     if (!password) {
//       setError("Please enter a password");
//       return;
//     }
//     setError("");

//     //Login API
//     try {
//       dispatch(signInStart());

//       const res = await axios.post(
//         (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") + "/api/auth/signin",
//         {
//           email,
//           password,
//         },
//         { withCredentials: true },
//       );

//       if (res.data.success === false) {
//         console.log(res.data);
//         toast.error(res.data.message);
//         dispatch(signInFailure(res.data.message));
//         return;
//       }
//       toast.success(res.data.message);
//       dispatch(signInSuccess(res.data.user));
//       navigate("/");
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || error.message;
//       toast.error(errorMsg);
//       dispatch(signInFailure(errorMsg));
//     }
//   };

//   return (
//     <div className="flex items-center justify-center mt-28">
//       <div className="w-96 border rounded bg-white px-7 py-10">
//         <form onSubmit={handleLogin}>
//           <h4 className="text-2xl mb-7">Login</h4>
//           <input
//             type="text"
//             placeholder="Email"
//             className="input-box"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <PasswordInput
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <div className="flex justify-end mt-1 mb-4">
//             <Link to="/forgot-password" className="text-sm font-medium text-[#2B85FF] hover:underline">
//               Forgot Password?
//             </Link>
//           </div>

//           {error && <p className="text-red-500 text-sm pb-1">{error}</p>}
//           <button type="submit" className="btn-primary">
//             Login
//           </button>

//           <p className="text-sm text-center mt-4">
//             Not registered yet?
//             <Link
//               to={"/signup"}
//               className="font-medium text-[#2B85FF] underline pl-2"
//             >
//               Create an account
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;



//--------------------------------------------------------------------------------------------------
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
        (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") + "/api/auth/signin",
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
      const errorMsg = error.response?.data?.message || error.message;
      toast.error(errorMsg);
      dispatch(signInFailure(errorMsg));
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap');

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0f;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* Ambient background orbs */
        .login-root::before {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
          top: -150px;
          left: -150px;
          border-radius: 50%;
          pointer-events: none;
        }
        .login-root::after {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%);
          bottom: -100px;
          right: -100px;
          border-radius: 50%;
          pointer-events: none;
        }

        /* Noise texture overlay */
        .noise-overlay {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
        }

        .login-card {
          position: relative;
          z-index: 1;
          width: 420px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 48px 44px;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 32px 80px rgba(0, 0, 0, 0.6),
            0 0 60px rgba(99, 102, 241, 0.05);
          animation: cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .login-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(99, 102, 241, 0.9);
          margin-bottom: 10px;
          animation: fadeUp 0.5s 0.1s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .login-title {
          font-family: 'Playfair Display', serif;
          font-size: 34px;
          font-weight: 600;
          color: #f8f8ff;
          line-height: 1.15;
          margin-bottom: 32px;
          animation: fadeUp 0.5s 0.15s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .login-title span {
          background: linear-gradient(135deg, #818cf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .field-wrapper {
          margin-bottom: 16px;
          animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .field-wrapper:nth-child(1) { animation-delay: 0.2s; }
        .field-wrapper:nth-child(2) { animation-delay: 0.25s; }

        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.45);
          letter-spacing: 0.06em;
          margin-bottom: 8px;
        }

        /* Override input-box class for dark theme */
        .login-card .input-box,
        .login-card input[type="text"],
        .login-card input[type="email"],
        .login-card input[type="password"] {
          width: 100%;
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          padding: 13px 16px !important;
          color: #f0f0ff !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 14px !important;
          font-weight: 400 !important;
          outline: none !important;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s !important;
          box-sizing: border-box !important;
        }

        .login-card .input-box::placeholder,
        .login-card input[type="text"]::placeholder,
        .login-card input[type="email"]::placeholder {
          color: rgba(255, 255, 255, 0.25) !important;
        }

        .login-card .input-box:focus,
        .login-card input[type="text"]:focus,
        .login-card input[type="email"]:focus {
          border-color: rgba(129, 140, 248, 0.6) !important;
          background: rgba(129, 140, 248, 0.06) !important;
          box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.12) !important;
        }

        .forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 6px;
          margin-bottom: 20px;
          animation: fadeUp 0.5s 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .forgot-link {
          font-size: 12.5px;
          font-weight: 500;
          color: rgba(129, 140, 248, 0.8);
          text-decoration: none;
          transition: color 0.2s;
        }
        .forgot-link:hover {
          color: #a5b4fc;
        }

        .error-msg {
          font-size: 12.5px;
          color: #f87171;
          background: rgba(248, 113, 113, 0.08);
          border: 1px solid rgba(248, 113, 113, 0.2);
          border-radius: 8px;
          padding: 9px 13px;
          margin-bottom: 14px;
          animation: shake 0.35s cubic-bezier(.36,.07,.19,.97);
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-5px); }
          60%       { transform: translateX(5px); }
          80%       { transform: translateX(-3px); }
        }

        /* Override btn-primary for dark theme */
        .login-card .btn-primary,
        .login-btn {
          width: 100%;
          padding: 13px 0;
          background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
          border: none !important;
          border-radius: 12px !important;
          color: #fff !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 14.5px !important;
          font-weight: 500 !important;
          letter-spacing: 0.03em;
          cursor: pointer !important;
          transition: transform 0.18s, box-shadow 0.18s, filter 0.18s !important;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.35) !important;
          animation: fadeUp 0.5s 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .login-card .btn-primary:hover,
        .login-btn:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.5) !important;
          filter: brightness(1.08) !important;
        }

        .login-card .btn-primary:active,
        .login-btn:active {
          transform: translateY(0px) scale(0.99) !important;
        }

        .signup-row {
          text-align: center;
          margin-top: 24px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.35);
          animation: fadeUp 0.5s 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .signup-link {
          color: #818cf8;
          font-weight: 500;
          text-decoration: none;
          margin-left: 6px;
          transition: color 0.2s;
        }
        .signup-link:hover {
          color: #a5b4fc;
          text-decoration: underline;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          margin: 28px 0;
          animation: fadeUp 0.5s 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>

      <div className="login-root">
        <div className="noise-overlay" />

        <div className="login-card">
          <form onSubmit={handleLogin}>
            <p className="login-eyebrow">Welcome back</p>
            <h4 className="login-title">
              Sign in to your <span>account</span>
            </h4>

            <div className="field-wrapper">
              <label className="field-label">Email address</label>
              <input
                type="text"
                placeholder="you@example.com"
                className="input-box"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field-wrapper">
              <label className="field-label">Password</label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="forgot-row">
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button type="submit" className="btn-primary">
              Sign in
            </button>

            <div className="divider" />

            <p className="signup-row">
              Don't have an account?
              <Link to="/signup" className="signup-link">
                Create one free
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
