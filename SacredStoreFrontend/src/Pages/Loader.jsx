import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-amber-50 via-white to-orange-50 text-gray-800 min-h-[500px] relative overflow-hidden">
      
      {/* Sacred Geometry Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 border border-amber-300 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
          <div className="absolute top-8 left-8 w-80 h-80 border border-orange-300 rounded-full animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
          <div className="absolute top-16 left-16 w-64 h-64 border border-yellow-300 rounded-full animate-spin" style={{animationDuration: '10s'}}></div>
        </div>
      </div>

      {/* Floating Blessed Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-amber-400 opacity-30 animate-float"
            style={{
              left: `${15 + (i * 10)}%`,
              top: `${20 + ((i % 4) * 20)}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: '4s'
            }}
          >
            {i % 4 === 0 && '✨'}
            {i % 4 === 1 && '🕯️'}
            {i % 4 === 2 && '📿'}
            {i % 4 === 3 && '🪔'}
          </div>
        ))}
      </div>

      {/* Main Loader Container */}
      <div className="relative z-20 mb-8">
        {/* Outer Golden Ring */}
        <div className="w-32 h-32 rounded-full border-4 border-gradient-to-r from-amber-400 to-orange-500 absolute top-0 left-0 animate-spin border-amber-400" style={{animationDuration: '3s'}}></div>
        
        {/* Inner Sacred Symbol Ring */}
        <div className="w-24 h-24 rounded-full border-2 border-orange-400 absolute top-4 left-4 animate-spin flex items-center justify-center" style={{animationDuration: '2s', animationDirection: 'reverse'}}>
          <div className="text-xs text-amber-600 font-medium">॥ ॐ ॥</div>
        </div>
        
        {/* Central Divine Symbol */}
        <div className="w-32 h-32 flex items-center justify-center relative z-30">
          <div className="relative">
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-sm opacity-30 animate-pulse"></div>
            
            {/* Main Icon - Shopping bag with sacred symbol */}
            <div className="relative w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl shadow-lg flex items-center justify-center border-2 border-amber-300">
              <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
              </svg>
              {/* Sacred overlay */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-xs text-white">
                ॐ
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="relative z-20 text-center mb-6">
        <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 mb-2">
          Sacred Marketplace
        </h2>
        <p className="text-lg text-amber-700 font-medium animate-pulse">
          Blessing your spiritual journey...
        </p>
      </div>

      {/* Progress Indicators */}
      <div className="relative z-20 flex items-center space-x-4 mb-8">
        <div className="flex space-x-2">
          {['Prayers', 'Blessings', 'Products'].map((item, index) => (
            <div key={item} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse"
                style={{animationDelay: `${index * 0.5}s`}}
              ></div>
              <span className="text-sm text-amber-700 font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sacred Loading Bar */}
      <div className="relative z-20 w-80 h-2 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
        <div className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-full animate-pulse relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer"></div>
        </div>
      </div>

      {/* Bottom Blessing Text */}
      <div className="relative z-20 mt-8 text-center">
        <p className="text-sm text-amber-600 italic font-light">
          "May your shopping be blessed with divine guidance"
        </p>
        <div className="flex justify-center mt-3 space-x-4 text-amber-500">
          <span className="animate-bounce" style={{animationDelay: '0s'}}>🙏</span>
          <span className="animate-bounce" style={{animationDelay: '0.2s'}}>✨</span>
          <span className="animate-bounce" style={{animationDelay: '0.4s'}}>🕉️</span>
          <span className="animate-bounce" style={{animationDelay: '0.6s'}}>✨</span>
          <span className="animate-bounce" style={{animationDelay: '0.8s'}}>🙏</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
            opacity: 0.6;
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;