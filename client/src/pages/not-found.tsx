import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Gamepad2, Home, ArrowLeft, RefreshCw } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900">
      <div className="relative w-full max-w-3xl mx-auto text-center px-6 py-12">
        {/* Glowing effect in the background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[100px] opacity-30 blur-3xl bg-primary rounded-full animate-pulse-slow"></div>
        </div>
        
        {/* Content with glass-morphism effect */}
        <div className="relative glass-effect rounded-2xl border border-white/10 p-8 md:p-12 shadow-xl">
          {/* Game Over Text */}
          <div className="bg-black/50 inline-block px-6 py-2 rounded-lg mb-8 border border-primary/30 shadow-lg shadow-primary/20">
            <h1 className="font-orbitron text-primary tracking-wider animate-pulse-glow">GAME OVER</h1>
          </div>
          
          {/* 404 Text with game style */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Gamepad2 className="h-12 w-12 text-primary animate-pulse" />
              <h2 className="text-6xl md:text-7xl font-bold font-rajdhani text-white tracking-wider">404</h2>
            </div>
            <h3 className="text-2xl md:text-3xl font-rajdhani text-white mb-4">LEVEL NOT FOUND</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              The battlefield you're looking for doesn't exist. The enemy may have moved or been defeated already.
            </p>
          </div>
          
          {/* Game UI style stats */}
          <div className="bg-black/40 rounded-lg p-4 max-w-xs mx-auto mb-8 border border-white/10">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex flex-col items-center">
                <span className="text-gray-400">ERROR CODE</span>
                <span className="text-primary font-mono">404</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-400">STATUS</span>
                <span className="text-destructive font-mono">FAILED</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-400">LIVES REMAINING</span>
                <span className="text-accent-yellow font-mono">3</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-400">NEXT ATTEMPT</span>
                <span className="text-accent-green font-mono">READY</span>
              </div>
            </div>
          </div>
          
          {/* Action buttons with game UI style */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 h-auto font-rajdhani font-bold">
                <Home className="mr-2 h-4 w-4" /> RETURN TO BASE
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-white/20 hover:bg-white/5 text-white px-5 py-2 h-auto font-rajdhani font-bold"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> PREVIOUS CHECKPOINT
            </Button>
            <Button 
              variant="outline" 
              className="border-white/20 hover:bg-white/5 text-white px-5 py-2 h-auto font-rajdhani font-bold"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> RELOAD MISSION
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
