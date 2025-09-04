import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import useWebSocket from 'react-use-websocket';
import susLogo from '../assets/sus.svg';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
const defaultFiles = {
  "/App.js": {
    code: `
        import React from 'react';
        import Hero from './Hero.jsx';

        function App() {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-950 to-black text-white">
            <Hero />
            </div>
        );
        }

        export default App;
    `,
  },
  "/Hero.jsx": {
    code: `
        import React from 'react';

        const Hero = () => {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-950 to-black text-white p-4">
            <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-4 leading-tight">
                SiteCraft AI by NotAnyAI
            </h1>
            <p className="text-xl md:text-2xl text-center max-w-2xl mb-8">
                Unlock your creativity. Create stunning websites with just a prompt!
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-100 transform hover:scale-105 transition duration-300 ease-in-out">
                Start Building 🚀
            </button>
            </div>
        );
        };

        export default Hero;
    `,
  },
};

const loadingdefault = {
    "App.js":{
        code: `import React from 'react';
        import Loading from './Loading.jsx';

        function App({ isLoading }) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-950 to-black text-white">
            <Loading />
            </div>
        );
        }

        export default App;`
    },
    "Loading.jsx":{
        code:`import React from 'react';
        const Loading = () => {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-950 to-black text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mb-6"></div>
            <h2 className="text-2xl font-semibold">Building your project...</h2>
            <p className="mt-2 text-gray-400">This may take a few seconds ⏳</p>
            </div>
        );
        };

        export default Loading;`
    }
}

const TempCodeChat = ({ queryHome }) => {
    const token = localStorage.getItem("Authorization");
    const [view,setView] = useState("Preview")
    const [defaultfiles, setdefaultFiles] = useState(defaultFiles);
    const [files, setFiles] = useState({});
    const [query, setQuery] = useState("");
    const [sending, setSending] = useState(false);
    const [lastquery, setlastquery] = useState("");
    const [think, setthink] = useState([]);
    const [file, Usefile] = useState(null)
    const [genstart, setgenstart] = useState([]);
    const [gencomplete, setgencomplete] = useState([]);
    const [processing, setprocessing] = useState([]);
    const [username, Useusername] = useState("")
    const [qhome, Useqhome] = useState(queryHome ?? "")
    const messagesEndRef = useRef(null);
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(`wss://notanyai-backend.onrender.com/wss/chat?token=${token}`);

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
            const data = await GetUser();
            console.log(data.status);
            if (data.status === "done") {
                Useusername(data.username);
            } else {
                navigate("/login"); // <-- send() isn't defined, I assume you meant navigate
            }
        };

        fetchUser();
    }, []);
    const handleSubmit = (customQuery) => {
        const q = (customQuery ?? query).trim();
        if (!q) return;

        setSending(true);
        setlastquery(q);
        sendJsonMessage({ agent: "code", query: q, img: "" });
        Useqhome("");
        setQuery("");
        setthink([]);
        setgenstart([]);
        setgencomplete([]);
        setprocessing([]);
        setFiles({});
        setdefaultFiles(loadingdefault);
    }
    //useEffect(() => {
    /*if (queryHome) {
        console.log("Received query from Home:", queryHome);
        handleSubmit(queryHome);
    }
    }, [queryHome]);*/
    if (qhome !== "") {
        console.log("Received query from Home:", qhome);
        handleSubmit(qhome);
        Useqhome("");
    }
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [think]);
    useEffect(()=>{
        if(lastJsonMessage?.text){
            setthink((prev) => [...prev,lastJsonMessage.text])
        }
        else if(lastJsonMessage?.codegenstart){
            setgenstart((prev) => [...prev,lastJsonMessage.codegenstart])
        }
        else if(lastJsonMessage?.codegencomplete){
            setgencomplete((prev) => [...prev,lastJsonMessage.codegencomplete])
        }
        else if(lastJsonMessage?.processing){
            setprocessing((prev) => [...prev,lastJsonMessage.processing])
        }
        else if (lastJsonMessage){
            setFiles(lastJsonMessage)
            setSending(false)
        }
    },[lastJsonMessage])
    const sandboxFiles = Object.keys(files).length ? files : defaultfiles;
    return (
        <div className='bg-gradient-to-b from-slate-950 to-black min-h-screen flex-col text-white'>
            <div className='flex justify-between p-4 '>
                <div className='flex gap-2 items-center'>
                    <img src={susLogo} alt="sus" height={32} width={32} />
                    <div className='flex flex-col leading-none'>
                        <h1 className='text-md font-mono'>NotAnyAI</h1>
                    </div>
                </div>
                <div>
                <button className='bg-slate-800 p-2 rounded-2xl mt-1 hover:scale-95 hover:bg-slate-700 transition-transform duration-150' onClick={() => setView("Code")}>
                    Code 💻 
                </button>
                <button className='bg-slate-800 p-2 rounded-2xl mt-1 ml-2 hover:scale-95 hover:bg-slate-700 transition-transform duration-150' onClick={() => setView("Preview")} >
                    Preview ✨
                </button>
                </div>
                <div className='flex gap-4 items-center'>
                    <h1 className='text-lg font-semibold text-slate-400 hover:text-blue-500 hover:scale-105 duration-300'>{username}</h1>
                    <div className='text-white bg-orange-600 p-2 rounded-2xl font-black text-xs'>
                        Left - 3/3
                    </div>
                </div>
            </div>
<div className="flex flex-row flex-1 overflow-hidden p-3">
        <div className="w-1/5 bg-gradient-to-b from-slate-950 to-black rounded-2xl flex flex-col p-3">
          <div className="flex-1 text-white overflow-y-auto scrollbar-hide">
            <div className='flex flex-col gap-2 overflow-y-auto scrollbar-hide'>
                {lastquery === "" && (
                    <div className='text-white flex flex-col justify-center items-center mt-32'>
                        <h1 className='text-xl md:text-2xl font-bold mb-1'>Welcome Back!</h1>
                        <p className='text-xs md:text-xs mb-1 '>ready to build amazing websites and web apps today? 🌐💻</p>
                        <p className='text-xs md:text-xs mb-1 '>Your AI-powered coding assistant can generate React, HTML, CSS</p>
                        <p className='text-xs md:text-xs mb-1 '>and Tailwind code, instantly preview it, and help you</p>
                        <p className='text-xs md:text-xs mb-1 '>create professional frontends in minutes</p>
                        <h1 className='text-lg md:text-xl font-bold mb-1'>(Experimental)</h1>
                        
                    </div>
                )}
                {lastquery && (<div className='border rounded-xl p-3 w-fit border-gray-700 text-sm text-white bg-gradient-to-br from-blue-500 to-blue-600 self-end'>
                    {lastquery}
                </div>)}
                {think && (<div className='flex flex-col justify-start gap-2'>

                    {think.length > 0 && (<div className='border rounded-xl p-3 w-fit border-gray-700 text-sm text-white bg-gray-900'>
                    {think.map((ele,idx)=>{
                        return (
                            <p key={idx} >{ele}</p>
                        )
                    })}
                    </div>)}

                    {genstart.length > 0 && (<div className='border rounded-xl p-3 w-fit border-gray-700 text-sm text-white bg-gray-900'>
                    {genstart.map((ele,idx)=>{
                        return (
                            <p key={idx} >{ele}</p>
                        )
                    })}
                    </div>)}

                    {gencomplete.length > 0 && (<div className='border rounded-xl p-3 w-fit border-gray-700 text-sm text-white bg-gray-900'>
                    {gencomplete.map((ele,idx)=>{
                        return (
                            <p key={idx} >{ele}</p>
                        )
                    })}
                    </div>)}

                    {processing.length > 0 && (<div className='border rounded-xl p-3 w-fit border-gray-700 text-sm text-white bg-gray-900'>
                    {processing.map((ele,idx)=>{
                        return (
                            <p key={idx} >{ele}</p>
                        )
                    })}
                    </div>)}
                </div>)}
            </div>
          </div>
        <motion.div className='flex flex-col items-center gap-4 bg-slate-900 px-4 py-4 max-w-3xl mx-auto rounded-3xl w-full'
        >
          <input type="text" name="prompt" id="prompt" className='w-full h-12 p-3 rounded-3xl text-white bg-slate-800 ' 
          autoComplete="off"  value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e)=>{if (e.key=="Enter") handleSubmit()}} 
          placeholder='Start building ur dream website...' />
          <div className='flex justify-between items-center w-full'>
            <div className='flex gap-3 items-center justify-end'>
              <input type="submit" className=' bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-3xl text-white font-semibold hover:to-purple-700 hover:bg-slate-600 transition-all duration-300'
              onClick={handleSubmit}  value={sending ? "Generating" : "Generate"} disabled={sending}>
                </input>
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
        </div>

        {/* Right panel */}
        <div className="w-4/5 bg-gradient-to-b from-slate-950 to-black rounded-2xl ml-3 text-white max-w-4/5">
               <div className="flex-1 bg-slate-900 rounded-2xl m-3 overflow-hidden h-[830px]">
                    <SandpackProvider 
                    template="react"
                    theme="dark"
                    files={sandboxFiles}
                    customSetup={{
                        dependencies: {
                        react: "^18.2.0",
                        "react-dom": "^18.2.0",
                        tailwindcss: "^3.4.1",
                        postcss: "^8.4.21",
                        autoprefixer: "^10.4.13",
                        "@react-three/fiber": "^8.15.16",
                        "@react-three/drei": "^9.101.3",
                        },
                    }}
                    options={{
                        externalResources: ["https://cdn.tailwindcss.com"],
                        editorHeight: 830,
                        autorun: true,
                        recompileMode: "immediate",
                        recompileDelay: 0,  
                    }}
                    >
                    <SandpackLayout>
                        {view === "Code" && (
                        <SandpackCodeEditor showTabs wrapContent closableTabs autorun style={{ height: "830px" }} />
                        )}

                        {view === "Preview" && <SandpackPreview style={{ height: "830px" }} autorun/>}
                    </SandpackLayout>
                    </SandpackProvider>
                </div>   
        </div>
      </div>
        </div>
    )
}

export default TempCodeChat