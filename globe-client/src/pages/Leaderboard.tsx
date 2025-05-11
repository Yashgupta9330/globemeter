
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Trophy, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// For demo purposes, we'll create some mock data
interface LeaderboardEntry {
  rank: number;
  username: string;
  correctAnswers: number;
  totalPlayed: number;
  accuracy: number;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  
  useEffect(() => {
    // In a real app, you would fetch this data from your API
    const mockLeaderboard: LeaderboardEntry[] = [
      { rank: 1, username: 'WorldExplorer', correctAnswers: 95, totalPlayed: 100, accuracy: 95 },
      { rank: 2, username: 'GlobeTrotter42', correctAnswers: 88, totalPlayed: 95, accuracy: 93 },
      { rank: 3, username: 'TravelMaster', correctAnswers: 82, totalPlayed: 90, accuracy: 91 },
      { rank: 4, username: 'AdventureSeeker', correctAnswers: 75, totalPlayed: 85, accuracy: 88 },
      { rank: 5, username: 'WanderLust', correctAnswers: 70, totalPlayed: 80, accuracy: 87 },
      { rank: 6, username: 'PathFinder', correctAnswers: 65, totalPlayed: 75, accuracy: 87 },
      { rank: 7, username: 'MapReader', correctAnswers: 60, totalPlayed: 70, accuracy: 86 },
      { rank: 8, username: 'DestinationHunter', correctAnswers: 55, totalPlayed: 65, accuracy: 85 },
      { rank: 9, username: 'JourneyMaker', correctAnswers: 50, totalPlayed: 60, accuracy: 83 },
      { rank: 10, username: 'WorldWanderer', correctAnswers: 45, totalPlayed: 55, accuracy: 82 },
    ];
    
    // Check if the current user exists and add them to the leaderboard
    const savedUser = localStorage.getItem('globetrotter_user');
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user.username);
      
      // Check if the user is already in our mock data
      const userExists = mockLeaderboard.some(entry => entry.username === user.username);
      
      if (!userExists && user.totalPlayed > 0) {
        // Add the user to the leaderboard with their actual stats
        mockLeaderboard.push({
          rank: mockLeaderboard.length + 1,
          username: user.username,
          correctAnswers: user.correctAnswers,
          totalPlayed: user.totalPlayed,
          accuracy: user.totalPlayed > 0 ? Math.round((user.correctAnswers / user.totalPlayed) * 100) : 0
        });
        
        // Sort the leaderboard by correctAnswers
        mockLeaderboard.sort((a, b) => b.correctAnswers - a.correctAnswers);
        
        // Update ranks after sorting
        mockLeaderboard.forEach((entry, index) => {
          entry.rank = index + 1;
        });
      }
    }
    
    setLeaderboard(mockLeaderboard);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <Trophy className="h-8 w-8 text-accent mr-3" />
              <h1 className="text-3xl font-bold">Globetrotter Leaderboard</h1>
            </div>
            
            <Card>
              <CardHeader className="bg-muted/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    <span>Top Explorers</span>
                  </CardTitle>
                  <Badge className="bg-ocean">Global Rankings</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableCaption>
                    The world's top geographical masterminds
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>Explorer</TableHead>
                      <TableHead className="text-right">Correct</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Accuracy</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboard.map((entry) => (
                      <TableRow 
                        key={entry.username} 
                        className={currentUser === entry.username ? "bg-muted/30" : ""}
                      >
                        <TableCell className="font-medium">
                          {entry.rank <= 3 ? (
                            <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${
                              entry.rank === 1 ? 'bg-yellow-400' :
                              entry.rank === 2 ? 'bg-gray-300' : 
                              'bg-amber-700'
                            } text-white font-bold text-xs`}>
                              {entry.rank}
                            </span>
                          ) : (
                            entry.rank
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {entry.username}
                          {currentUser === entry.username && (
                            <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">{entry.correctAnswers}</TableCell>
                        <TableCell className="text-right">{entry.totalPlayed}</TableCell>
                        <TableCell className="text-right font-medium">
                          <span className={`
                            ${entry.accuracy > 90 ? 'text-green-600' : 
                              entry.accuracy > 70 ? 'text-ocean' : 
                              'text-coral'}
                          `}>
                            {entry.accuracy}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
