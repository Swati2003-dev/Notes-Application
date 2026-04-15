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
        (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") +
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
    <div className="min-h-screen bg-[#09090f] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Ambient glow orbs */}
      <div className="absolute top-[-120px] left-[-120px] w-[480px] h-[480px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full bg-purple-500/15 blur-[100px] pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/[0.04] border border-white/[0.08] rounded-2xl px-10 py-12 shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl">

        {/* Header */}
        <p className="text-indigo-400 text-[11px] font-semibold tracking-[0.18em] uppercase mb-2">
          Welcome back
        </p>
        <h4 className="text-3xl font-semibold text-white/90 mb-8 leading-snug">
          Sign in to your{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            account
          </span>
        </h4>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-white/40 tracking-wide uppercase">
              Email address
            </label>
            <input
              type="text"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/90 placeholder:text-white/25 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:bg-indigo-500/[0.06] focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-white/40 tracking-wide uppercase">
              Password
            </label>
            <div className="[&_input]:bg-white/[0.05] [&_input]:border [&_input]:border-white/10 [&_input]:rounded-xl [&_input]:px-4 [&_input]:py-3 [&_input]:text-sm [&_input]:text-white/90 [&_input]:placeholder:text-white/25 [&_input]:outline-none [&_input]:transition-all [&_input]:w-full [&_input]:focus:border-indigo-500/60 [&_input]:focus:ring-2 [&_input]:focus:ring-indigo-500/20 [&_input]:focus:bg-indigo-500/[0.06]">
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end -mt-1">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-indigo-400/80 hover:text-indigo-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium tracking-wide shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.55)] hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.99] transition-all duration-200 cursor-pointer"
          >
            Sign in
          </button>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-1" />

          {/* Sign up */}
          <p className="text-center text-xs text-white/35">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-400 font-medium hover:text-indigo-300 hover:underline transition-colors ml-1"
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
