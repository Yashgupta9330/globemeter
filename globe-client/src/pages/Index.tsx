import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import GameRules from '@/components/GameRules';
import UserRegistration from '@/components/UserRegistration';
import UserStats from '@/components/UserStats';
import ShareButton from '@/components/ShareButton';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Medal } from 'lucide-react';
import { useAuth } from '../context/auth'; 

const Index = () => {
  const { user, registerUser } = useAuth(); 
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const challenge = searchParams.get('challenge');
    const fromUser = searchParams.get('from');
    const challengerScore = searchParams.get('score');

    if (challenge && fromUser && challengerScore) {
      sessionStorage.setItem(
        'globetrotter_challenge',
        JSON.stringify({
          id: challenge,
          from: fromUser,
          score: parseInt(challengerScore),
        })
      );

      toast({
        title: `Challenge from ${fromUser}!`,
        description: `${fromUser} scored ${challengerScore} points. Think you can beat it?`,
      });
    }
  }, [searchParams, toast]);

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

  const handleAcceptChallenge = () => {
    navigate('/game');
  };

  const challengeData = JSON.parse(sessionStorage.getItem('globetrotter_challenge') || 'null');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <Hero onStartGame={handleStartGame} />
      <GameRules />

      {/* Challenge Banner */}
      {challengeData && (
        <section className="py-6 bg-ocean/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto p-6 rounded-lg bg-white shadow-md">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-ocean-light/20 flex items-center justify-center">
                    <Medal className="h-6 w-6 text-ocean" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Challenge from {challengeData.from}</h3>
                    <p className="text-sm text-muted-foreground">
                      Score to beat:{' '}
                      <span className="font-bold text-coral">{challengeData.score} points</span>
                    </p>
                  </div>
                </div>
                <Button className="bg-ocean hover:bg-ocean-dark" onClick={handleAcceptChallenge}>
                  Accept Challenge
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* User section */}
      {user ? (
        <UserStats
          username={user.username}
          correctAnswers={user.score}
          totalPlayed={0} // if not tracked, default to 0 or handle in context
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
