
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Trophy, 
  UserCheck, 
  Share2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserStatsProps {
  username: string;
  correctAnswers: number;
  totalPlayed: number;
  onStartGame: () => void;
  onShareChallenge: () => void;
}

const UserStats: React.FC<UserStatsProps> = ({
  username,
  correctAnswers,
  totalPlayed,
  onStartGame,
  onShareChallenge
}) => {
  const accuracy = totalPlayed > 0 ? Math.round((correctAnswers / totalPlayed) * 100) : 0;
  
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto travel-card">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <UserCheck className="h-5 w-5 text-ocean" />
                <h2 className="text-2xl font-bold">{username}</h2>
                <Badge className="bg-ocean ml-2">Explorer</Badge>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-sm text-muted-foreground">Correct Answers</span>
                  <span className="text-3xl font-bold text-land">{correctAnswers}</span>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-sm text-muted-foreground">Total Played</span>
                  <span className="text-3xl font-bold text-ocean">{totalPlayed}</span>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-sm text-muted-foreground">Accuracy</span>
                  <span className="text-3xl font-bold text-coral">{accuracy}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <Button 
                className="bg-ocean hover:bg-ocean-dark gap-2"
                onClick={onStartGame}
              >
                <MapPin className="h-4 w-4" /> 
                Continue Adventure
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserStats;
