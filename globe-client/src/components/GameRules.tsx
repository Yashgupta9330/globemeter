
import React from 'react';
import { 
  MapPin, 
  Key, 
  ScrollText, 
  Trophy 
} from 'lucide-react';

const GameRules: React.FC = () => {
  const rules = [
    {
      icon: <Key className="h-8 w-8 text-ocean" />,
      title: "Cryptic Clues",
      description: "Receive mysterious hints about famous destinations around the world."
    },
    {
      icon: <MapPin className="h-8 w-8 text-land" />,
      title: "Guess the Place",
      description: "Test your knowledge by identifying which place the clue is referring to."
    },
    {
      icon: <ScrollText className="h-8 w-8 text-sand" />,
      title: "Learn Fun Facts",
      description: "Discover fascinating trivia and information about each destination."
    },
    {
      icon: <Trophy className="h-8 w-8 text-coral" />,
      title: "Challenge Friends",
      description: "Compete with friends to see who's the ultimate globetrotter."
    }
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How to Play</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {rules.map((rule, index) => (
            <div 
              key={index} 
              className="travel-card flex flex-col items-center text-center transition-transform hover:scale-105"
            >
              <div className="mb-4 p-4 rounded-full bg-muted">
                {rule.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{rule.title}</h3>
              <p className="text-muted-foreground">{rule.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameRules;
