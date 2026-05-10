import React, { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="relative w-full">
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Password"}
        className="w-full bg-transparent dark:bg-white/[0.05] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-slate-800 dark:text-white/90 placeholder:text-slate-400 dark:placeholder:text-white/25 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:bg-indigo-50/50 dark:focus:bg-indigo-500/[0.06] focus:ring-2 focus:ring-indigo-500/20"
      />

      {isShowPassword ? (
        <FaRegEye
          size={20}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500 dark:text-indigo-400 cursor-pointer"
          onClick={toggleShowPassword}
        />
      ) : (
        <FaRegEyeSlash
  size={20}
  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 cursor-pointer hover:text-slate-600 dark:hover:text-gray-300 transition-colors"
  onClick={toggleShowPassword}
/>
      )}
    </div>
  );
};

export default PasswordInput;