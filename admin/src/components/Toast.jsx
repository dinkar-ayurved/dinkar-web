import { useEffect } from "react";

const styles = {
  success: "bg-green-600 text-white",
  error: "bg-red-500 text-white",
  info: "bg-blue-500 text-white",
};

const Toast = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 z-50">
      <div
        className={`px-4 py-3 rounded shadow ${styles[type]}`}
      >
        {message}
      </div>
    </div>
  );
};

export default Toast;
