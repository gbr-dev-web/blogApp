import { createContext, useContext, useState, useRef } from "react";

// Contexto para FlashMessage
const FlashContext = createContext();

// Componente FlashMessage
function FlashMessage({ type = "success", message, onClose}) {
  const colors = {
    success: "bg-teal-600",
    error: "bg-red-600",
  };

  return (
    <div
      role="alert"
      className={`fixed right-4 p-4 rounded-lg shadow-lg flex items-center text-white ${colors[type]}`}
      style={{ top: type === "success" ? "1rem" : "5rem", minWidth: "300px" }}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-auto text-white opacity-90 hover:opacity-100 text-2xl font-bold px-2"
        aria-label="Close alert"
      >
        &times;
      </button>
    </div>
  );
}

export function FlashProvider({ children }) {
    const [flash, setFlash] = useState(null);
    const timeoutRef = useRef(null);
  
    const showFlash = (type, message, timeout = 3000) => {
      setFlash({ type, message });
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      timeoutRef.current = setTimeout(() => setFlash(null), timeout);
    };
  
    return (
      <FlashContext.Provider value={{ showFlash }}>
        {children}
        {flash && (
          <FlashMessage
            type={flash.type}
            message={flash.message}
            onClose={() => setFlash(null)}
          />
        )}
      </FlashContext.Provider>
    );
  }

export function useFlash() {
  return useContext(FlashContext);
}
