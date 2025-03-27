import { Countdown } from "@/components/ui/countdown";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Users, Zap } from "lucide-react";

interface HeroSectionProps {
  title: string;
  description: string;
  imageUrl: string;
  startDate: Date;
  actionLink?: string;
  actionText?: string;
  prizePool?: number;
  registeredPlayers?: number;
}

export default function HeroSection({
  title,
  description,
  imageUrl,
  startDate,
  actionLink = "/tournaments",
  actionText = "REGISTER NOW",
  prizePool = 500000,
  registeredPlayers = 1248
}: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isHovering) {
        setMousePosition({
          x: (e.clientX / window.innerWidth) - 0.5,
          y: (e.clientY / window.innerHeight) - 0.5
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovering]);

  const translateX = mousePosition.x * -10;
  const translateY = mousePosition.y * -10;

  return (
    <section className="mb-10">
      <div 
        className="relative rounded-xl overflow-hidden h-[450px] neon-border"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background/20 to-destructive/20 z-0"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-destructive/20 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>
          <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-accent-green/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        </div>
        
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover z-0 opacity-30 transform transition-transform duration-300"
          style={{ transform: `scale(1.05) translate(${translateX}px, ${translateY}px)` }}
        />
        
        {/* Overlay Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0)_1px,rgba(0,0,0,0.3)_1px)] bg-[length:4px_4px] z-0 opacity-40"></div>
        
        <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-10 z-10">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 bg-primary/90 hover:bg-primary px-3 py-1 text-lg font-semibold uppercase animate-pulse-glow">
              <Flame className="w-4 h-4 mr-1" /> LIVE
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-rajdhani text-white mb-4 tracking-tight">
              {title}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-destructive"> TOURNAMENT</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
              {description}
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl">
              <div className="bg-black/50 backdrop-blur-sm border border-primary/30 rounded-lg p-3 text-center">
                <Trophy className="w-6 h-6 mx-auto mb-1 text-accent-yellow" />
                <div className="text-accent-yellow font-semibold text-lg">₹{prizePool.toLocaleString()}</div>
                <div className="text-xs text-gray-400">PRIZE POOL</div>
              </div>
              
              <div className="bg-black/50 backdrop-blur-sm border border-primary/30 rounded-lg p-3 text-center">
                <Users className="w-6 h-6 mx-auto mb-1 text-accent-green" />
                <div className="text-accent-green font-semibold text-lg">{registeredPlayers.toLocaleString()}</div>
                <div className="text-xs text-gray-400">PLAYERS</div>
              </div>
              
              <div className="bg-black/50 backdrop-blur-sm border border-primary/30 rounded-lg p-3 text-center">
                <Zap className="w-6 h-6 mx-auto mb-1 text-accent-blue" />
                <div className="text-accent-blue font-semibold text-lg">32</div>
                <div className="text-xs text-gray-400">TEAMS</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={actionLink}>
                <a className="inline-block bg-gradient-to-r from-primary to-primary/80 text-white px-8 py-4 rounded-lg font-rajdhani font-semibold hover:from-primary/90 hover:to-primary/70 transition shadow-lg shadow-primary/20 transform hover:-translate-y-1">
                  {actionText} <i className="ri-arrow-right-line ml-2"></i>
                </a>
              </Link>
              <Link href="/tournaments-enhanced">
                <a className="bg-black/50 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-rajdhani font-semibold hover:bg-gray-900/80 transition border border-primary/30 transform hover:-translate-y-1">
                  ENHANCED VIEW <i className="ri-rocket-2-line ml-2"></i>
                </a>
              </Link>
            </div>
          </div>
          
          <div className="absolute bottom-6 right-8 bg-black/70 backdrop-blur-sm rounded-lg p-4 border border-primary/30 animate-pulse-glow">
            <div className="flex items-center">
              <div className="mr-4">
                <div className="text-sm text-gray-400 mb-1">TOURNAMENT STARTS IN</div>
                <Countdown targetDate={startDate instanceof Date ? startDate : new Date(startDate)} />
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <i className="ri-timer-line text-2xl text-primary"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
