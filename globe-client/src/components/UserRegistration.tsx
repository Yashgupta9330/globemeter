import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Globe, Loader } from 'lucide-react';
import axios from "../utils/axios.config";

interface UserRegistrationProps {
  onRegister: (username: string) => void;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { toast } = useToast();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    debounceRef.current = setTimeout(() => {
      if (username.trim().length >= 3) {
        checkUsername(username.trim());
      } else {
        setIsUsernameAvailable(false);
        setErrorMessage(username.length > 0 ? 'Username must be at least 3 characters' : '');
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [username]);

  const checkUsername = async (name: string) => {
    setIsValidating(true);
    setErrorMessage('');

    try {
      const response = await axios.get(`/user/username/${name}`);
      const isAvailable = !response.data.success;
      setIsUsernameAvailable(isAvailable);
      setErrorMessage(isAvailable ? '' : 'Username is already taken');

      if (!isAvailable) {
        toast({
          title: "Username unavailable",
          description: "This username is already taken. Please try another one.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(error);
      setIsUsernameAvailable(false);
      setErrorMessage('Error checking username');
      toast({
        title: "Error",
        description: "Failed to check username availability",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isValidating) {
      toast({
        title: "Please wait",
        description: "Checking username availability...",
        variant: "default"
      });
      return;
    }

    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to continue.",
        variant: "destructive"
      });
      return;
    }

    if (!isUsernameAvailable) {
      toast({
        title: "Invalid username",
        description: errorMessage || "Please choose a valid username",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      onRegister(username.trim());
      setIsLoading(false);
      toast({
        title: "Welcome aboard!",
        description: `You're registered as ${username}. Happy globe-trotting!`,
      });
    }, 1000);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto travel-card">
          <div className="flex items-center justify-center mb-6">
            <Globe className="h-10 w-10 text-ocean mr-2" />
            <h2 className="text-2xl font-bold">Join the Adventure</h2>
          </div>

          <p className="text-center text-muted-foreground mb-6">
            Create a username to start playing and challenge friends
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                placeholder="Choose your explorer name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
              />
              {isValidating && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Loader className="w-3 h-3 animate-spin" /> Checking availability...
                </p>
              )}
              {errorMessage && !isValidating && (
                <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-ocean hover:bg-ocean-dark"
              disabled={isLoading || isValidating}
            >
              {isLoading ? "Creating Profile..." : "Create Profile"}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default UserRegistration;
