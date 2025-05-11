import  { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import GameRules from '@/components/GameRules';
import UserRegistration from '@/components/UserRegistration';
import UserStats from '@/components/UserStats';
import Footer from '@/components/Footer';
import { useAuth } from '../context/auth'; 

const Index = () => {
  const { user, registerUser } = useAuth(); 
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegister = (username: string) => {
    registerUser(username,"1dufuvjgug"); 
    const challengeData = sessionStorage.getItem('globetrotter_challenge');
    if (challengeData) {
      toast({
        title: 'Ready to take on the challenge?',
        description: "Click 'Accept Challenge' to start playing!",
      });
    }
  };

  const handleStartGame = () => {
    navigate('/game');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero onStartGame={handleStartGame} />
      <GameRules />
      {user ? (
        <UserStats
          username={user.username}
          correctAnswers={user.score}
          totalPlayed={0} 
          onStartGame={handleStartGame}
          onShareChallenge={() => {}}
        />
      ) : (
        <UserRegistration onRegister={handleRegister} />
      )}

      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Test Your Knowledge?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of travelers from around the world in the ultimate
            geography challenge. Explore new places, learn fascinating facts,
            and compete with friends!
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
