import { Countdown } from "@/components/ui/countdown";
import { Link } from "wouter";

interface HeroSectionProps {
  title: string;
  description: string;
  imageUrl: string;
  startDate: Date;
  actionLink?: string;
  actionText?: string;
}

export default function HeroSection({
  title,
  description,
  imageUrl,
  startDate,
  actionLink = "/tournaments",
  actionText = "REGISTER NOW"
}: HeroSectionProps) {
  return (
    <section className="mb-10">
      <div className="relative rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/20 to-accent-pink/20 z-0"></div>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-64 md:h-80 object-cover z-0 opacity-40"
        />
        <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-10 z-10">
          <h1 className="text-3xl md:text-5xl font-bold font-rajdhani text-white mb-2">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-2xl">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={actionLink}>
              <a className="inline-block bg-gradient-to-r from-accent-blue to-accent-blue/80 text-white px-6 py-3 rounded font-rajdhani font-semibold hover:from-accent-blue/90 hover:to-accent-blue/70 transition shadow-lg shadow-accent-blue/20">
                {actionText}
              </a>
            </Link>
            <button className="bg-gray-800/80 text-white px-6 py-3 rounded font-rajdhani font-semibold hover:bg-gray-700/80 transition border border-accent-blue/30">
              VIEW DETAILS
            </button>
          </div>
          <div className="absolute bottom-4 right-6 bg-black/60 rounded-lg px-4 py-2 flex items-center">
            <div className="mr-3">
              <div className="text-xs text-gray-400">STARTS IN</div>
              <Countdown targetDate={startDate instanceof Date ? startDate : new Date(startDate)} />
            </div>
            <div className="h-8 w-8 rounded-full bg-accent-blue/20 flex items-center justify-center">
              <i className="ri-timer-line text-accent-yellow"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
