
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Menu, X, LogIn, UserPlus, Trophy, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth(); 
  console.log("user ",user)
  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="py-4 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-ocean" />
          <span className="font-bold text-lg text-ocean">Globetrotter</span>
        </Link>
      </div>
      
      <div className="hidden md:flex items-center gap-4">
        <Button variant="ghost" className="text-muted-foreground" asChild>
          <Link to="/game">Play Game</Link>
        </Button>
        <Button variant="ghost" className="text-muted-foreground" asChild>
          <Link to="/leaderboard">Leaderboard</Link>
        </Button>
        <Button variant="ghost" className="text-muted-foreground">About</Button>
      </div>
      
      <div className="hidden md:block">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm">Hello, {user.username}</span>
            <Button 
              variant="outline" 
              className="border-ocean text-ocean hover:bg-ocean/5"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-ocean text-ocean hover:bg-ocean/5" asChild>
              <Link to="/login">
                <LogIn className="mr-1 h-4 w-4" /> Sign In
              </Link>
            </Button>
            <Button variant="default" className="bg-ocean hover:bg-ocean-dark" asChild>
              <Link to="/signup">
                <UserPlus className="mr-1 h-4 w-4" /> Sign Up
              </Link>
            </Button>
          </div>
        )}
      </div>
      
      {/* Mobile menu button */}
      <div className="md:hidden">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 w-9 p-0" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-border md:hidden animate-fade-in z-40">
          <div className="flex flex-col p-4">
            <Link 
              to="/game" 
              className="flex items-center gap-2 py-3 px-4 hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <List className="h-4 w-4" />
              <span>Play Game</span>
            </Link>
            <Link 
              to="/leaderboard" 
              className="flex items-center gap-2 py-3 px-4 hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <Trophy className="h-4 w-4" />
              <span>Leaderboard</span>
            </Link>
            <a 
              href="#" 
              className="flex items-center gap-2 py-3 px-4 hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>About</span>
            </a>
            
            <hr className="my-3" />
            
            {user ? (
              <>
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  Signed in as <span className="font-semibold">{user.username}</span>
                </div>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 py-3 px-4 hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
                <Link 
                  to="/signup" 
                  className="flex items-center gap-2 py-3 px-4 hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
