import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from "./Logo";

function Hero() {
  const send = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const GetUser = async () => {
    try {
      const token = sessionStorage.getItem("Authorization") || localStorage.getItem("Authorization");
      const res = await fetch("https://notanyai-backend.onrender.com/validate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
      });

      if (!res.ok) return { status: "fail" };

      const json = await res.json();
      return json;
    } catch (err) {
      console.error("Validation failed", err);
      return { status: "fail" };
    }
  };

  const HandleGetstarted = async () => {
    setIsLoading(true);
    try {
      const data = await GetUser();
      console.log("Validation response:", data);

      if (data.status === "done") {
        send("/app");
      } else {
        send("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      gradient: "from-white-500 to-white-600",
      title: "SiteCraft AI",
      description: "Generate complete full-stack applications with intelligent code generation. From concept to deployment-ready websites in minutes."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      gradient: "from-white-500 to-white-600",
      title: "Custom AI Tools",
      description: "Specialized tools tailored for your workflow. Context-aware assistance that adapts to your specific needs and preferences."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      gradient: "from-white-500 to-white-600",
      title: "Intelligent Chat",
      description: "Natural conversations powered by advanced language models. Get precise answers, creative solutions, and expert-level insights instantly."
    }
  ];


  return (
    <div className="min-h-screen flex flex-col items-center bg-[#161616] text-white text-center px-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`
        }}
      />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-7xl mx-auto">
        {/* Beta badge */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-200/30 rounded-full px-6 py-2 mb-8 mt-12 hover:scale-110 transition-all duration-300 hover:shadow-xl shadow-md cursor-default group">
          <span className="text-blue-200 text-sm flex items-center gap-2">
            <span className="animate-pulse">✨</span> 
            <span className="group-hover:text-blue-100 transition-colors">The Future of AI is Here</span>
          </span>
        </div>

        {/* Main heading with gradient animation */}
        <h1 className="text-7xl md:text-9xl font-instrument font-extrabold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-lg p-10 animate-gradient bg-[length:200%_auto]">
          NotAnyAI
        </h1>

        {/* Subtitle with improved spacing */}
        <div className="space-y-2 mb-4">
          <p className="text-xl md:text-3xl text-gray-200 font-light">
            Your personal <span className='instrument-serif-regular-italic bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent'>AI assistant</span> for smarter conversations, quick answers,
          </p>
          <p className="text-xl md:text-3xl text-gray-200 font-light">
            and creative ideas. Powered by modern AI technology.
          </p>
        </div>
        
        <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light mt-2 max-w-2xl">
          Powered by intelligence that actually understands you and your vision.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 mt-10">
          <button 
            onClick={HandleGetstarted} 
            disabled={isLoading}
            className="bg-white text-black px-8 py-3 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-white/20 hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Loading...
              </>
            ) : (
              <>
                Get Started
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
          <button 
            onClick={() => send("/login")} 
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Login
          </button>
        </div>

        {/* Beta notice */}
        <div className="mt-6 flex items-center gap-2 text-gray-400 bg-gray-800/30 px-4 py-2 rounded-full backdrop-blur-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-sm">Shh… it's still in beta. Limited access for now.</p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full max-w-6xl px-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-6 rounded-2xl border border-gray-800/50 hover:border-blue-500/30 transition-all duration-500 group overflow-hidden"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 rounded-2xl" />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`flex justify-center items-center bg-gradient-to-br ${feature.gradient} rounded-xl w-14 h-14 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {feature.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-100 transition-colors">{feature.title}</h3>
                <p className='text-gray-400 text-base leading-relaxed group-hover:text-gray-300 transition-colors'>{feature.description}</p>
              </div>

              {/* Subtle corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* Powered by section */}
        <div className="flex flex-col items-center mt-16 mb-10">
          <h2 className="text-sm font-medium text-slate-500 mb-3 tracking-wider uppercase">Powered by</h2>
          <div className="bg-[#202122] px-6 py-3 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors">
            <img
              src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg"
              alt="Google Gemini"
              className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;