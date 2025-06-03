import axios from "../utils/axios.config";
import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { useToast } from "./toast";
import { AxiosError } from "axios";

export interface User {
  username: string;
  id: string;
  score: number;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loginWithCredentials: (username: string, password: string) => Promise<boolean>;
  registerUser: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerFriend: (username: string, password: string) => Promise<string>;
  validateAndLoadUser: () => Promise<void>;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // SIGN IN USER
  async function loginWithCredentials(username: string, password: string) {
    setIsLoading(true);
    try {
      const res = await axios.post("/user/signin", { username, password });
      if (res.data.message === "User Login Success") {
        const loggedInUser = res.data.user;
        setUser(loggedInUser);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        toast({
          title: "Welcome back!",
          description: `Good to see you again, ${loggedInUser.username}!`,
        });
        setIsLoading(false);
        return true;
      } else {
        toast({
          title: "Login failed",
          description: res.data.error || "Invalid credentials",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: "Login failed",
          description: error.response?.data?.error || error.message || "Could not connect to server",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login failed",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
      setIsLoading(false);
      return false;
    }
  }

  // SIGN UP USER
  async function registerUser(username: string, password: string) {
    setIsLoading(true);
    try {
      const res = await axios.post("/user/signup", { username, password });
      if (res.data.message === "User Signup Success") {
        const newUser = res.data.user;
        setUser(newUser);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(newUser));
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        toast({
          title: "Account created!",
          description: `Welcome, ${newUser.username}!`,
        });
        setIsLoading(false);
        return true;
      } else {
        toast({
          title: "Registration failed",
          description: res.data.error || "Could not create account",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: "Registration failed",
          description: error.response?.data?.error || error.message || "Could not connect to server",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration failed",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
      setIsLoading(false);
      return false;
    }
  }


  async function registerFriend(username: string, password: string) {
    try {
      const res = await axios.post("/user/signup", { username, password });
      if (res.data.message === "User Signup Success") {
        toast({
          title: "Friend registered",
          description: `Successfully registered ${username}.`,
        });
        return res.data.token;
      } else {
        toast({
          title: "Registration failed",
          description: res.data.error || "Could not register friend.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: "Registration failed",
          description: error.response?.data?.error || error.message || "Could not connect to server",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration failed",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
      return false;
    }
  }


  // LOGOUT USER
  function logout() {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    window.location.href = "/login";
  }

  // VALIDATE TOKEN AND LOAD USER
  async function validateAndLoadUser() {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (!token) return;

    setIsLoading(true);
    try {
      const response = await axios.get("/user/validate");
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        // Only clear auth data if the token is invalid
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
      }
    } catch (error) {
      // Only clear auth data if there's a network error or server error
      if (error instanceof AxiosError && error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
      }
      console.error("Token validation error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    validateAndLoadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        setUser,
        loginWithCredentials,
        registerUser,
        logout,
        registerFriend,
        validateAndLoadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthContextProvider");
  }
  return context;
};

export default AuthContextProvider;
