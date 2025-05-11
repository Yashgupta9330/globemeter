import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import axios from "../utils/axios.config";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getPanelElementsForGroup } from "react-resizable-panels";

function New() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { validateAndLoadUser } = useAuth();

  useEffect(() => {
    const handleInvitation = async () => {
      if (token) {
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          console.log("token ",token)
          await validateAndLoadUser();
          setTimeout(() => {
            navigate("/game");
          }, 2000);
        } catch (error) {
          console.error("Error validating invitation:", error);
          navigate("/login");
        }
      } else {
         navigate("/login");
      }
    };

    handleInvitation();
  }, [token, navigate]);

  return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex w-full h-full justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ocean"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
  );
}

export default New;