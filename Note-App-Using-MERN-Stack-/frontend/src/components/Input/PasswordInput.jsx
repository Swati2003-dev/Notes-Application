import React, { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="flex items-center w-full bg-[#ffffff0d] border border-white/10 rounded-xl px-4 py-3 transition-all duration-200 focus-within:border-indigo-500/60 focus-within:bg-[#6366f10f] focus-within:ring-2 focus-within:ring-indigo-500/20">
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Password"}
        className="w-full text-sm text-white/90 placeholder:text-white/25 bg-transparent outline-none mr-3"
      />

      {isShowPassword ? (
        <FaRegEye
          size={20}
          className="text-indigo-400 cursor-pointer flex-shrink-0"
          onClick={toggleShowPassword}
        />
      ) : (
        <FaRegEyeSlash
          size={20}
          className="text-white/40 cursor-pointer flex-shrink-0 hover:text-white/60 transition-colors"
          onClick={toggleShowPassword}
        />
      )}
    </div>
  );
};

export default PasswordInput;
