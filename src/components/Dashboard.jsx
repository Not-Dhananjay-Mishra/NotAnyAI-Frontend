import React from "react";

function Hero() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white text-center px-4">
      <h1 className="text-5xl font-extrabold mb-6">
        Welcome to <span className="text-blue-400">NotAny AI</span>
      </h1>
      <p className="text-lg text-gray-300 max-w-2xl mb-8">
        Your personal AI assistant for smarter conversations, quick answers,
        and creative ideas. Powered by modern AI technology.
      </p>
      <div className="flex gap-4">
        <a
          href="/login"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold"
        >
          Get Started
        </a>
      </div>
    </div>
  );
}

export default Hero;
