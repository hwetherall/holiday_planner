'use client';
import { useState, useEffect } from 'react';

const HOLIDAY_MESSAGES = [
  "🎄 Decking the halls with holiday magic...",
  "❄️ Making a list and checking it twice...",
  "🎁 Wrapping up the perfect destinations...",
  "🦌 Sending the reindeer to scout locations...",
  "🌟 Sprinkling holiday cheer on your options...",
  "🎅 Santa's elves are crafting your itinerary...",
  "🕯️ Lighting the menorah of possibilities...",
  "🎊 Preparing your festive adventure...",
  "🏔️ Carving out snowy mountain paths...",
  "🌊 Mapping coastal holiday havens..."
];

const SNOWFLAKES = ['❄️', '❅', '❆', '❄', '❅', '❆'];

export default function HolidayLoading() {
  const [messageIndex, setMessageIndex] = useState(0);

  // Rotate through holiday messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % HOLIDAY_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center relative overflow-hidden">
      {/* Falling snowflakes */}
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          className="absolute text-xl animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        >
          {SNOWFLAKES[Math.floor(Math.random() * SNOWFLAKES.length)]}
        </div>
      ))}

      {/* Main loading content */}
      <div className="text-center space-y-8 z-10 relative">
        {/* Christmas Tree */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Tree trunk */}
            <div className="w-4 h-8 bg-amber-800 mx-auto rounded-b"></div>
            {/* Tree layers */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="w-16 h-8 bg-green-600 rounded-t-full"></div>
            </div>
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
              <div className="w-20 h-8 bg-green-500 rounded-t-full"></div>
            </div>
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="w-24 h-8 bg-green-400 rounded-t-full"></div>
            </div>
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
              <div className="w-28 h-8 bg-green-300 rounded-t-full"></div>
            </div>
            {/* Star */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-2xl animate-pulse">
              ⭐
            </div>
            {/* Ornaments */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 -ml-8 text-red-500 animate-bounce">
              🔴
            </div>
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 ml-6 text-yellow-500 animate-bounce" style={{animationDelay: '0.5s'}}>
              🟡
            </div>
            <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 -ml-4 text-blue-500 animate-bounce" style={{animationDelay: '1s'}}>
              🔵
            </div>
          </div>
        </div>

        {/* Loading message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">
            🎄 Crafting Your Perfect Holiday 🎄
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            {HOLIDAY_MESSAGES[messageIndex]}
          </p>
        </div>

        {/* Animated loading bar */}
        <div className="w-64 mx-auto">
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <div className="h-full rounded-full animate-loading-bar" 
                 style={{
                   background: 'linear-gradient(90deg, #ef4444, #22c55e, #3b82f6, #ef4444)',
                   backgroundSize: '300% 100%'
                 }}>
            </div>
          </div>
        </div>

        {/* Holiday icons */}
        <div className="flex justify-center space-x-4 text-2xl">
          <span className="animate-bounce">🎁</span>
          <span className="animate-bounce" style={{animationDelay: '0.2s'}}>🦌</span>
          <span className="animate-bounce" style={{animationDelay: '0.4s'}}>🎅</span>
          <span className="animate-bounce" style={{animationDelay: '0.6s'}}>❄️</span>
          <span className="animate-bounce" style={{animationDelay: '0.8s'}}>🌟</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0.3;
          }
        }
        
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
        
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
}
