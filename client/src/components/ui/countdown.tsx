import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: Date | string;
  onComplete?: () => void;
  className?: string;
}

export function Countdown({ targetDate, onComplete, className = "" }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Convert string date to Date object if needed
      const targetDateObj = targetDate instanceof Date ? targetDate : new Date(targetDate);
      
      // Check if the date is valid
      if (isNaN(targetDateObj.getTime())) {
        console.error("Invalid date provided to Countdown component");
        setIsComplete(true);
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      
      const difference = targetDateObj.getTime() - now.getTime();
      
      if (difference <= 0) {
        setIsComplete(true);
        onComplete?.();
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      return { hours, minutes, seconds };
    };
    
    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  if (isComplete) {
    return <div className={`${className} text-accent-pink`}>LIVE NOW</div>;
  }

  return (
    <div className={`${className} countdown`}>
      {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
    </div>
  );
}
