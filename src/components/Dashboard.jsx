import React, { useEffect, useRef  , useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { Logo } from "./Logo";

function Hero() {
  const send = useNavigate()
  const GetUser = async () => {
    const token = localStorage.getItem("Authorization");
    if (!token) return { status: "fail" };

    try {
      const res = await fetch("https://notanyai-backend.onrender.com/validate", {
        headers: {
          "Authorization": `${token}`,
          "Content-Type": "application/json"
        }
      });

      const json = await res.json();
      return json;
    } catch (err) {
      console.error("Validation failed", err);
      return { status: "fail" };
    }
  };
  const HandleGetstarted = () => {
    const fetchUser = async () => {
      const data = await GetUser();
      console.log(data.status);
      if (data.status === "done") {
        send("/app")
      } else {
        send("/login")
      }
    };

    fetchUser();
  }
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-50  to-blue-200 text-white text-center px-4 relative">
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-200/30 rounded-full px-6 py-2 mb-8 mt-12 hover:scale-110 transition-all duration-300 hover:shadow-xl shadow-md">
          <span className="text-blue-700 text-sm">✨ The Future of AI is Here</span>
        </div>
      <h1 className="text-7xl text bg-gradient-to-r from-blue-400 via-blue-600 to-blue-900 bg-clip-text text-transparent drop-shadow-lg font-bold p-10">
        NotAny AI
        </h1>
      <p className="text-xl md:text-3xl text-gray-700 font-light">
        Your personal AI assistant for smarter conversations, quick answers,
      </p>
      <p className="text-xl md:text-3xl text-gray-700 font-light">and creative ideas. Powered by modern AI technology.</p>
      <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light mt-2">Powered by intelligence that actually understands you and your vision.</p>
      <div className="flex gap-4 mt-10">
        <button onClick={()=>HandleGetstarted()} className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 rounded-lg font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
          Get Started
          </button>
      </div>
      <p className="text-gray-500 mt-4">
          Shh… it's still in beta. Limited access for now.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-3 gap-10 mt-10 text-gray-600 ">
        <div className="bg-white/70 p-8 max-w-64 rounded-lg shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-center items-center bg-red-400 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/25 w-12 h-12 mx-auto mb-3">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold">Lightning Fast</h1>
          <p>Get instant results with our optimized AI engine designed for speed and efficiency that never compromises quality.</p>
        </div>
        <div className="bg-white/70 p-8 max-w-64 rounded-lg shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-center items-center bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl shadow-lg shadow-blue-500/25 w-12 h-12 mx-auto mb-3">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold">Truly Intelligent</h1>
          <p>Advanced reasoning capabilities that go beyond simple pattern matching to understand context and nuance.</p>
        </div>
        <div className="bg-white/70 p-8 max-w-64 rounded-lg shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-center items-center bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl shadow-lg shadow-blue-500/25 w-12 h-12 mx-auto mb-3">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold">Privacy First</h1>
          <p>Your data stays yours. Built with privacy and security as core principles from day one.</p>
        </div>
      </div>

      <div className="flex flex-col items-center mt-10 text-gray-600">
        <h1 className="text-xl font-semibold">Powered by</h1>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg"
          alt="Google Gemini logo"
          className="h-12 w-auto mt-1 mb-10"
        />
      </div>
      
    </div>
  );
}

export default Hero;
