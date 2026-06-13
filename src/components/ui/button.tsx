import React from "react";
import clsx from "clsx"; // Optional: Install clsx for cleaner class merging

type Variant = "default" | "outline" | "ghost";
type Size = "default" | "icon" | "sm" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  ...props
}) => {
  const variantClasses = {
    default: "bg-green-600 text-white hover:bg-green-700",
    outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-100",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  };

  const sizeClasses = {
    default: "px-4 py-2 text-sm",
    icon: "w-10 h-10 p-0 flex items-center justify-center",
    sm: "px-3 py-1 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      {...props}
      className={clsx(
        "rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </button>
  );
};
