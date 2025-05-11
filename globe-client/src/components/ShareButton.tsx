import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaTimes, FaSpinner } from "react-icons/fa";
import { useAuth } from "../context/auth";
import { useToast } from "../context/toast";
import html2canvas from "html2canvas";
import { Trophy } from "lucide-react";
import UserRegistration from "./UserRegistration";

interface ShareButtonProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  currentClue?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  isOpen,
  onClose,
  score,
  currentClue,
}) => {
  const [step, setStep] = useState<number>(1);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [shareImage, setShareImage] = useState<string | null>(null);
  const [friendsToken, setFriendsToken] = useState<string | null>(null);

  const { registerFriend, user: invitingUser } = useAuth();
  const { showToast } = useToast();
  const shareContentRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setStep(1);
    setUsername("");
    setPassword("");
    setIsCreating(false);
    setShareImage(null);
    onClose();
  };

  const handleRegister = async (newUsername: string, newPassword: string) => {
    try {
      setIsCreating(true);
      setUsername(newUsername);
      setPassword(newPassword);

      const token = await registerFriend(newUsername, newPassword);
      setFriendsToken(token);
      setStep(2);

      setTimeout(() => {
        generateShareImage();
      }, 1000);
    } catch (error) {
      console.error("Error registering friend:", error);
      showToast("Failed to create account", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const generateShareImage = async () => {
    if (shareContentRef.current) {
      try {
        const images = shareContentRef.current.querySelectorAll("img");
        if (images.length > 0) {
          await Promise.all(
            [...images].map((img) => {
              if (img.complete) return Promise.resolve();
              return new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
              });
            })
          );
        }

        const canvas = await html2canvas(shareContentRef.current, {
          scale: 2,
          backgroundColor: null,
          logging: false,
        });

        const image = canvas.toDataURL("image/png");
        setShareImage(image);
      } catch (error) {
        console.error("Error generating share image:", error);
        showToast("Failed to generate share image", "error");
      }
    }
  };

  const shareToWhatsApp = () => {
    const frontendURL = import.meta.env.VITE_FRONTEND_URL || "https://globemeter.vercel.app";
    if (!shareImage || !friendsToken) {
      showToast("Unable to share. Please try again.", "error");
      return;
    }

    const text = `*GLOBETOTTER CHALLENGE!*

Hey explorer! ${invitingUser?.username} just set the bar high with ${score} points in Globetotter!

Think you've got what it takes? Dive into a world of cryptic clues and iconic destinations to test your geography smarts.

YOUR LOGIN CREDENTIALS:
Username: ${username}
Password: ${password}

Take on the challenge: ${frontendURL}/new/${friendsToken}/${score}

Explore. Decode. Dominate. How far can your travel knowledge take you?`;

    try {
      const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(shareUrl, "_blank");
      showToast("Challenge shared successfully!", "success");
    } catch (error) {
      console.error("Error sharing to WhatsApp:", error);
      showToast("Failed to share challenge", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-2xl z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {step === 1 ? "Create Challenge Account" : "Share Challenge"}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        <div className="p-4">
          {step === 1 && <UserRegistration onRegister={handleRegister} />}

          {step === 2 && (
            <ShareContent
              username={username}
              score={score}
              currentClue={currentClue}
              shareImage={shareImage}
              shareToWhatsApp={shareToWhatsApp}
              ref={shareContentRef}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

const ShareContent = React.forwardRef<
  HTMLDivElement,
  {
    username?: string;
    score?: number;
    currentClue?: string;
    shareImage: string | null;
    shareToWhatsApp: () => void;
  }
>(({ currentClue,score, shareImage, shareToWhatsApp }, ref) => {
  const { user: invitingUser } = useAuth();

  return (
    <div className="space-y-6">
      <div
        ref={ref}
        style={{
          background: "linear-gradient(to right, #4f46e5, #7c3aed)",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", zIndex: "10", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Trophy className="h-8 w-8" />
          </div>

          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              margin: "0.75rem 0",
            }}
          >
            {invitingUser?.username} has challenged you!
          </h3>

          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "0.5rem",
              padding: "0.75rem",
              margin: "0.75rem 0",
            }}
          >
            <p style={{ fontWeight: "500" }}>Current Score</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {score} points
            </p>
          </div>

          {currentClue && (
            <div
              style={{
                fontSize: "0.875rem",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                margin: "0.75rem 0",
              }}
            >
              <p style={{ fontWeight: "500", marginBottom: "0.25rem" }}>
                Sample Clue:
              </p>
              <p style={{ fontStyle: "italic" }}>"{currentClue}"</p>
            </div>
          )}

          <p style={{ fontSize: "0.875rem", marginTop: "0.75rem" }}>
            Can you beat their score?
          </p>
        </div>
      </div>

      {shareImage ? (
        <button
          onClick={shareToWhatsApp}
          className="w-full py-3 bg-[#25D366] text-white rounded-md font-medium flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors"
        >
          <FaWhatsapp className="text-xl" />
          Share to WhatsApp
        </button>
      ) : (
        <div className="flex justify-center">
          <FaSpinner className="animate-spin text-primary text-2xl" />
        </div>
      )}

      <p className="text-sm text-center text-gray-500">
        Your friend will be able to see your score and try to beat it!
      </p>
    </div>
  );
});
ShareContent.displayName = "ShareContent";

export default ShareButton;