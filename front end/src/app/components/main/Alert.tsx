"use client";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

interface AlertProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onClose: () => void;
  duration?: number;
}

const typeColors = {
  success: "bg-green-100 text-green-700 border-green-400",
  error: "bg-red-100 text-red-700 border-red-400",
  warning: "bg-yellow-100 text-yellow-700 border-yellow-400",
  info: "bg-blue-100 text-blue-700 border-blue-400",
};

const Alert = ({
  message,
  type = "info",
  onClose,
  duration = 3000,
}: AlertProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`fixed top-5 right-5 z-50 p-4 border rounded-lg shadow-md flex items-center gap-3 transition-all duration-300 animate-slide-in ${typeColors[type]}`}
    >
      <span className="font-medium">{message}</span>
      <button onClick={onClose}>
        <IoClose className="text-lg cursor-pointer" />
      </button>
    </div>
  );
};

export default Alert;
