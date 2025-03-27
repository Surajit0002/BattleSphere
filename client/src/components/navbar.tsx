import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="bg-secondary-bg border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="font-orbitron text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-accent-pink">
                  BATTLESPHERE
                </a>
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link href="/">
                <a className={`${location === "/" ? "text-white border-b-2 border-accent-blue" : "text-gray-300 hover:text-white border-transparent hover:border-accent-pink"} border-b-2 px-1 pt-1 font-medium`}>
                  Home
                </a>
              </Link>
              <Link href="/tournaments">
                <a className={`${location === "/tournaments" ? "text-white border-b-2 border-accent-blue" : "text-gray-300 hover:text-white border-transparent hover:border-accent-pink"} border-b-2 px-1 pt-1 font-medium`}>
                  Tournaments
                </a>
              </Link>
              <Link href="/leaderboard">
                <a className={`${location === "/leaderboard" ? "text-white border-b-2 border-accent-blue" : "text-gray-300 hover:text-white border-transparent hover:border-accent-pink"} border-b-2 px-1 pt-1 font-medium`}>
                  Leaderboard
                </a>
              </Link>
              <Link href="/teams">
                <a className={`${location === "/teams" ? "text-white border-b-2 border-accent-blue" : "text-gray-300 hover:text-white border-transparent hover:border-accent-pink"} border-b-2 px-1 pt-1 font-medium`}>
                  Team
                </a>
              </Link>
              <Link href="/rewards">
                <a className={`${location === "/rewards" ? "text-white border-b-2 border-accent-blue" : "text-gray-300 hover:text-white border-transparent hover:border-accent-pink"} border-b-2 px-1 pt-1 font-medium`}>
                  Rewards
                </a>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <span className="text-sm text-accent-green mr-2 font-medium">₹1,250</span>
                <button className="bg-gradient-to-r from-accent-blue to-accent-pink text-white px-4 py-1.5 rounded font-rajdhani font-medium hover:opacity-90 transition">
                  ADD FUNDS
                </button>
              </div>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center">
              <button className="p-1 text-gray-400 hover:text-white focus:outline-none">
                <i className="ri-notification-3-line text-xl"></i>
              </button>
              <div className="ml-4 relative flex-shrink-0">
                <div className="bg-secondary-bg p-1 rounded-full border border-accent-blue">
                  <img 
                    className="h-8 w-8 rounded-full" 
                    src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                    alt="User" 
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center md:hidden ml-4">
              <button className="text-gray-400 hover:text-white focus:outline-none">
                <i className="ri-menu-line text-2xl"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state (handled with state in a real implementation) */}
      <div className="hidden md:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/">
            <a className={`${location === "/" ? "bg-secondary-bg text-white block pl-3 pr-4 py-2 border-l-4 border-accent-blue" : "border-transparent text-gray-300 hover:text-white block pl-3 pr-4 py-2 border-l-4 hover:border-accent-pink"} font-medium`}>
              Home
            </a>
          </Link>
          <Link href="/tournaments">
            <a className={`${location === "/tournaments" ? "bg-secondary-bg text-white block pl-3 pr-4 py-2 border-l-4 border-accent-blue" : "border-transparent text-gray-300 hover:text-white block pl-3 pr-4 py-2 border-l-4 hover:border-accent-pink"} font-medium`}>
              Tournaments
            </a>
          </Link>
          <Link href="/leaderboard">
            <a className={`${location === "/leaderboard" ? "bg-secondary-bg text-white block pl-3 pr-4 py-2 border-l-4 border-accent-blue" : "border-transparent text-gray-300 hover:text-white block pl-3 pr-4 py-2 border-l-4 hover:border-accent-pink"} font-medium`}>
              Leaderboard
            </a>
          </Link>
          <Link href="/teams">
            <a className={`${location === "/teams" ? "bg-secondary-bg text-white block pl-3 pr-4 py-2 border-l-4 border-accent-blue" : "border-transparent text-gray-300 hover:text-white block pl-3 pr-4 py-2 border-l-4 hover:border-accent-pink"} font-medium`}>
              Team
            </a>
          </Link>
          <Link href="/rewards">
            <a className={`${location === "/rewards" ? "bg-secondary-bg text-white block pl-3 pr-4 py-2 border-l-4 border-accent-blue" : "border-transparent text-gray-300 hover:text-white block pl-3 pr-4 py-2 border-l-4 hover:border-accent-pink"} font-medium`}>
              Rewards
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}
