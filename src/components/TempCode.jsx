import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import useWebSocket from 'react-use-websocket';
import susLogo from '../assets/sus.svg';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import TempCodeChat from './TempCodeChat';

export const TempCode = () => {
  const navigate = useNavigate();
  const [page, setpage] = useState("main");
  const [file, Usefile] = useState(null)
  const [query, setQuery] = useState("");
  const [username, Useusername] = useState("")
  const [sending, setSending] = useState(false);
  const [loading, setloading] = useState(true);
  const [limit, setlimit] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setlimit((prev) => (prev > 0 ? prev - 1 : 0));
    setpage("code");
  }

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
  useEffect(() => {
    const fetchUser = async () => {
      setloading(true)
      const data = await GetUser();
      console.log(data.status);
      if (data.status === "done") {
        Useusername(data.username);
        setlimit(data.sitecraftlimit ?? 0);
        setloading(false);
      } else {
        navigate("/login"); // <-- send() isn't defined, I assume you meant navigate
      }
    };

    fetchUser();
  }, []);
  const handlequickgen = () => {
    setpage("code");
  }

  const [placeholder, setPlaceholder] = useState("Start building ur dream website...");

  useEffect(() => {
    const messages = [
      "Start building your dream website...",
      "Turn your ideas into reality 🚀",
      "Code your imagination ✨",
      "Your next big project starts here 💡",
      "Design. Build. Launch. 🌐",
      "What will you create today?"
    ];
    let i = 0;
    const interval = setInterval(() => {
      setPlaceholder(messages[i % messages.length]);
      i++;
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      {loading && (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-950 to-black text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mb-6"></div>
            <h2 className="text-2xl font-semibold">Loading...</h2>
            </div>
      )}
      {page === "code" && (<TempCodeChat queryHome= {query} />)}
      {page === "main" && (
      <div className='bg-gradient-to-b from-slate-950 to-black min-h-screen flex-col text-white'

      >
        <div className='flex justify-between p-4 '>
          <button onClick={() => navigate("/app")} className='flex gap-2 items-center hover:scale-105 duration-300'>
            <div className='flex gap-2 items-center'>
              <img src={susLogo} alt="sus" height={32} width={32} />
              <h1 className='text-md font-mono'>NotAnyAI</h1>
            </div>
          </button>
          <div className='flex gap-4 items-center'>
            <h1 className='text-lg font-semibold text-slate-400 hover:text-blue-500 hover:scale-105 duration-300'>{username}</h1>
            <div className='text-white bg-orange-600 p-2 rounded-2xl font-black text-xs'>
              Prompt Left - {limit}/5
            </div>
          </div>

        </div>
        <div className='flex flex-col items-center'>
          <motion.h1 className='text-5xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg pt-10'
            style={{ fontFamily: "'Orbitron', sans-serif" }}
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
          >SiteCraft AI</motion.h1>
          <motion.p className='text-lg mt-3 max-w-lg text-center'
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
          >Build websites in minutes using <span className='text-2xl text-blue-600'>Artificial intelligence </span>
            Just describe your idea and watch it come alive.</motion.p>
        </div>
        <motion.div className='flex flex-col items-center mt-16 gap-4 bg-slate-900 px-4 py-4 max-w-2xl mx-auto rounded-3xl'
        >
          <motion.input type="text" name="prompt" id="prompt" className='w-full h-12 p-3 rounded-3xl text-white bg-slate-800 ' 
          autoComplete="off" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e)=>{if (e.key=="Enter") handleSubmit()}}
          placeholder={placeholder} />
          <div className='flex justify-between items-center w-full'>
            <div className='flex gap-3 items-center justify-end'>
              <input type="submit" className=' bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-3xl text-white font-semibold hover:to-purple-700 hover:bg-slate-600 transition-all duration-300'
              onClick={handleSubmit}  value={sending ? "Generating" : "Generate"} disabled={sending}></input>
              <input type="file" id="fileInput"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    Usefile(e.target.files[0]);
                  }
                }}
                className="w-10 h-10 hidden items-center justify-center rounded-full hover:bg-slate-600 cursor-pointer transition-colors" />
              <label
                htmlFor="fileInput"
                className="px-3 py-3 flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 justify-center rounded-full hover:bg-slate-600 cursor-pointer transition-colors"
              >
                {/* Camera Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6  text-white"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h3l2-3h8l2 3h3v13H3V7z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </label>
            </div>
            {file && (
              <div className="flex items-center gap-2">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-10 h-10 rounded-md object-cover"
                />
                <span className="text-xs text-slate-300 ">{file.name}</span>
              </div>
            )}
          </div>
        </motion.div>
        <div>
          <h1 className='text-lg text-center font-semibold mt-8'>Quick Generations</h1>
          <div className='flex gap-4 justify-center flex-wrap mt-3'>
            <button className="px-3 py-1 rounded-lg border border-slate-600 bg-white/10 backdrop-blur-md text-slate-200 text-sm hover:bg-white/20 transition"
            onClick={() => {setQuery("Make me a YouTube Clone website"); handlequickgen();}}
            >YouTube Clone</button>
            <button className="px-3 py-1 rounded-lg border border-slate-600 bg-white/10 backdrop-blur-md text-slate-200 text-sm hover:bg-white/20 transition"
            onClick={() => {setQuery("Make me a Todo web app"); handlequickgen();}}
            >Todo App</button>
            <button className="px-3 py-1 rounded-lg border border-slate-600 bg-white/10 backdrop-blur-md text-slate-200 text-sm hover:bg-white/20 transition"
            onClick={() => {setQuery("Make me a Tic Tac Toe web Game player vs computer"); handlequickgen();}}
            >Tic Tac Toe Game</button>
            <button className="px-3 py-1 rounded-lg border border-slate-600 bg-white/10 backdrop-blur-md text-slate-200 text-sm hover:bg-white/20 transition"
            onClick={() => {setQuery("Make me a e-comm website"); handlequickgen();}}
            >E-Com Website</button>
          </div>
        </div>
        <div>

        </div>
        <div className='flex gap-8 p-6 mt-10 justify-center flex-wrap'>
          <div className='flex flex-col gap-2 max-w-xs text-center text-slate-300 bg-slate-900 p-6 rounded-2xl hover:scale-105 transition-all duration-300'>
            <h1 className='text-xl font-bold'>⚡ Instant Websites</h1>
            <p className='text-sm'>Generate production-ready sites with one click.</p>
          </div>
          <div className='flex flex-col gap-2 max-w-xs text-center text-slate-300 bg-slate-900 p-6 rounded-2xl hover:scale-105 transition-all duration-300'>
            <h1 className='text-xl font-bold'>🎨 Custom Designs</h1>
            <p className='text-sm'>Upload images and get tailored layouts & styles.</p>
          </div>
          <div className='flex flex-col gap-2 max-w-xs text-center text-slate-300 bg-slate-900 p-6 rounded-2xl hover:scale-105 transition-all duration-300'>
            <h1 className='text-xl font-bold'>🛠 Developer Friendly</h1>
            <p className='text-sm'>Export clean React code to continue building.</p>
          </div>
        </div>

        <div className="bg-gradient-to-t from-slate-900 to-slate-950 py-12 px-6 mt-16 rounded-3xl max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-white mb-8">❓ Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="bg-slate-800 rounded-xl p-4 hover:bg-slate-700 transition">
              <summary className="cursor-pointer text-md font-semibold text-blue-400">
                Do I need coding skills to use SiteCraft AI?
              </summary>
              <p className="mt-2 text-slate-300">
                Nope! Just describe your idea in plain English and SiteCraft AI will generate a complete website for you.
              </p>
            </details>

            <details className="bg-slate-800 rounded-xl p-4 hover:bg-slate-700 transition">
              <summary className="cursor-pointer text-md font-semibold text-blue-400">
                Can I export the code?
              </summary>
              <p className="mt-2 text-slate-300">
                Yes! You can export clean, developer-friendly React code and continue building your project.
              </p>
            </details>

            <details className="bg-slate-800 rounded-xl p-4 hover:bg-slate-700 transition">
              <summary className="cursor-pointer text-md font-semibold text-blue-400">
                Is it free to use?
              </summary>
              <p className="mt-2 text-slate-300">
                You get a limited number of free generations. For unlimited access, talk to developer i.e. Dhananjay Mishra.
              </p>
            </details>

            <details className="bg-slate-800 rounded-xl p-4 hover:bg-slate-700 transition">
              <summary className="cursor-pointer text-md font-semibold text-blue-400">
                What kind of websites can I build?
              </summary>
              <p className="mt-2 text-slate-300">
                From portfolios to landing pages to small business sites — SiteCraft AI can generate flexible layouts for almost anything.
              </p>
            </details>
          </div>
        </div>
        <footer className="text-center text-slate-500 text-xs mt-20 pb-6">
          <div>
            <h1>© 2069 🚀 SiteCraftAI — A Product of NotAnyAI</h1>
            <h2 className='hover:text-slate-300'>(Experimental)</h2>
          </div>
        </footer>
      </div>)}
    </>
  )
}
