import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-secondary-bg border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="font-orbitron text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-accent-pink mb-4">
              BATTLESPHERE
            </div>
            <p className="text-gray-400 text-sm mb-4">
              India's premier esports tournament platform. Compete, win, and earn real cash prizes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-accent-blue transition-colors">
                <i className="ri-instagram-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-accent-blue transition-colors">
                <i className="ri-twitter-x-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-accent-blue transition-colors">
                <i className="ri-youtube-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-accent-blue transition-colors">
                <i className="ri-discord-line text-xl"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-rajdhani font-semibold text-white mb-4">GAMES</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-accent-blue transition-colors">Free Fire</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent-blue transition-colors">PUBG Mobile</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent-blue transition-colors">COD Mobile</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent-blue transition-colors">BGMI</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent-blue transition-colors">All Games</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-rajdhani font-semibold text-white mb-4">QUICK LINKS</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tournaments" className="text-gray-400 hover:text-accent-blue transition-colors">Tournaments</Link></li>
              <li><Link href="/leaderboard" className="text-gray-400 hover:text-accent-blue transition-colors">Leaderboard</Link></li>
              <li><Link href="/teams" className="text-gray-400 hover:text-accent-blue transition-colors">Teams</Link></li>
              <li><Link href="/rewards" className="text-gray-400 hover:text-accent-blue transition-colors">Rewards</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-accent-blue transition-colors">Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-rajdhani font-semibold text-white mb-4">LEGAL</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-accent-blue transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent-blue transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent-blue transition-colors">Refund Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent-blue transition-colors">Fair Play Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent-blue transition-colors">KYC Requirements</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} BattleSphere. All rights reserved.</p>
          <p className="mt-2">
            BattleSphere is not affiliated with Free Fire, PUBG Mobile, COD Mobile, or BGMI. All game logos and trademarks are property of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
