import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ToastProvider from './context/toast.tsx';
import AuthContextProvider from './context/auth.tsx';

createRoot(document.getElementById("root")!).render( 
    <ToastProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </ToastProvider>
  );
