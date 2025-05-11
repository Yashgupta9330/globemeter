import React, { createContext, useContext } from 'react';
import { useToast as useShadcnToast } from "@/components/ui/use-toast";

type ToastVariant = "default" | "destructive";

interface ToastContextType {
  toast: (props: { 
    title?: string; 
    description?: string; 
    variant?: ToastVariant;
  }) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast: shadcnToast } = useShadcnToast();

  const toast = ({ title, description, variant = "default" }: { 
    title?: string; 
    description?: string; 
    variant?: ToastVariant;
  }) => {
    shadcnToast({
      title,
      description,
      variant,
    });
  };

  // Legacy method for backward compatibility
  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const variant = type === "error" ? "destructive" : "default";
    const title = type === "success" ? "Success" : type === "error" ? "Error" : "Info";
    
    shadcnToast({
      title,
      description: message,
      variant,
    });
  };

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export default ToastProvider;