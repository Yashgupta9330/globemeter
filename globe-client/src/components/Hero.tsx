
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Globe } from 'lucide-react';
import Globe3D from './Globe';

interface HeroProps {
  onStartGame: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartGame }) => {
  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background dots pattern */}
      <div className="absolute inset-0 bg-world-pattern opacity-10 -z-10"></div>

      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left side with text */}
        <div className="flex-1 md:max-w-[50%] space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            <span className="block">The</span>
            <span className="text-ocean animate-float inline-block">Globetrotter</span>
            <span className="block">Challenge</span>
          </h1>

          <p className="text-lg text-muted-foreground">
            How well do you know our planet? Test your knowledge in this
            ultimate travel guessing game where cryptic clues lead to
            amazing destinations!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button
              size="lg"
              className="bg-ocean hover:bg-ocean-dark text-white font-medium gap-2"
              onClick={onStartGame}
            >
              <MapPin className="h-5 w-5" /> Start Your Journey
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-ocean text-ocean hover:bg-ocean/5"
            >
              <Globe className="h-5 w-5 mr-2" /> Learn More
            </Button>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-700 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-green-700 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-yellow-700 border-2 border-white"></div>
            </div>
            <p className="text-sm text-muted-foreground">Join 5,000+ travelers</p>
          </div>
        </div>

        {/* Right side with globe animation */}
        <div className="flex-1 h-[300px] md:h-[500px] relative">
          <Globe3D />
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-white/50 to-transparent"></div>
    </div>
  );
};

export default Hero;
