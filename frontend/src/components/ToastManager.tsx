import React, { createContext, useContext, useState, ReactNode } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

interface ToastContextProps {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextProps | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<string[]>([]);

  const showToast = (message: string) => {
    setToasts((prev) => [...prev, message]);
    setTimeout(() => setToasts((prev) => prev.slice(1)), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer position="bottom-end" className="p-3">
        {toasts.map((msg, index) => (
          <Toast key={index} bg="dark" text="light">
            <Toast.Body>{msg}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};
