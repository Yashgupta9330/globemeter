
import React from 'react';
import { Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-muted/30 border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-ocean" />
            <span className="font-bold text-ocean">Globetrotter Challenge</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} The Globetrotter Team. All rights reserved.
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-ocean">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-ocean">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-ocean">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
