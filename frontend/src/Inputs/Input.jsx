import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-[13px] text-slate-800">
        {label}
      </label>
      <div className="input-box focus-within:ring-2 focus-within:ring-primary/50 transition-all">
        <input
          id={inputId}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className="w-full bg-transparent outline-none py-1"
          value={value}
          onChange={(e) => onChange(e)}
        />
        {type === "password" &&
          (showPassword ? (
            <FaRegEye
              size={22}
              className="text-primary cursor-pointer"
              onClick={toggleShowPassword}
              aria-label="Passwort verbergen"
              role="button"
            />
          ) : (
            <FaRegEyeSlash
              size={22}
              className="text-slate cursor-pointer"
              onClick={toggleShowPassword}
              aria-label="Passwort anzeigen"
              role="button"
            />
          ))}
      </div>
    </div>
  );
};

export default Input;
