import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  size?: "sm" | "base" | "lg";
  variant?: "default" | "primary" | "secondary" | "outline" | "disabled";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  size = "base",
  variant = "default",
  leftIcon,
  rightIcon,
  onClick,
  className = "",
  disabled = false,
}: ButtonProps) {
  const sizeClasses = {
    sm: "py-2 px-4 text-sm rounded-md",
    base: "py-3 px-6 rounded-xl",
    lg: "py-4 px-8 text-xl rounded-xl",
  };

  const variantClasses = {
    default: "bg-gray-200 hover:bg-gray-400 cursor-pointer",
    primary: "text-white bg-blue-500 hover:bg-blue-700 cursor-pointer",
    secondary: "text-white bg-gray-900 hover:bg-gray-700 cursor-pointer",
    outline: "border border-gray-500 hover:bg-gray-200 cursor-pointer",
    disabled: "text-gray-400 bg-gray-300",
  };

  const justifyClasses =
    leftIcon || rightIcon ? "justify-between" : "justify-center gap-2";

  return (
    <button
      className={`flex items-center ${justifyClasses} ${className} ${sizeClasses[size]} ${variantClasses[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {leftIcon && (
        <span className={`flex items-center justify-center ${className}`}>
          {leftIcon}
        </span>
      )}
      {children}
      {rightIcon && (
        <span className={`flex items-center justify-center ${className}`}>
          {rightIcon}
        </span>
      )}
    </button>
  );
}
