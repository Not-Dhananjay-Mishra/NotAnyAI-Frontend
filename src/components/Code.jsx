import React, { useEffect, useState } from 'react'
import susLogo from '../assets/sus.svg';
import { Sandpack } from "@codesandbox/sandpack-react";
import useWebSocket from 'react-use-websocket';

const defaultFiles = {
  "/App.js": {
    code: `
        import React from 'react';
        import Hero from './Hero.jsx';

        function App() {
        return (
            <div className="min-h-screen bg-gray-900 text-white">
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
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
            <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-4 leading-tight">
                Welcome to NotAnyAI
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
            <div className="min-h-screen bg-gray-900 text-white">
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
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mb-6"></div>
            <h2 className="text-2xl font-semibold">Building your project...</h2>
            <p className="mt-2 text-gray-400">This may take a few seconds ⏳</p>
            </div>
        );
        };

        export default Loading;`
    }
}


const Code = () => {
    const token = localStorage.getItem("Authorization");
    const [view,setView] = useState("preview")
    const [defaultfiles, setdefaultFiles] = useState(defaultFiles);
    const [files, setFiles] = useState({});
    const [query, setQuery] = useState("");
    const [sending, setSending] = useState(false);
    const [lastquery, setlastquery] = useState("");
    const [think, setthink] = useState([]);
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(`wss://notanyai-backend.onrender.com/wss/chat?token=${token}`);
    /*const handleSubmit = async (e) => {
        e.preventDefault();
        setQuery("")
        try {
        const res = await fetch("http://localhost:8000/api/code", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        });
        const data = await res.json();
        if (data) {
            setFiles(data);
        }
        } catch (error) {
        console.error("Error fetching code:", error);
        }
    };*/
    const handleSubmit = () => {
        if (!query.trim()) return;
        setSending(true)
        setlastquery(query)
        sendJsonMessage({ agent: "code", query: query, img: "" });
        setQuery("")
        setthink([])
        setFiles({})
        setdefaultFiles(loadingdefault)
    }
    useEffect(()=>{
        if(lastJsonMessage?.text){
            setthink((prev) => [...prev,lastJsonMessage.text])
        }
        else if (lastJsonMessage){
            setFiles(lastJsonMessage)
            setSending(false)
        }
    },[lastJsonMessage])
    const sandboxFiles = Object.keys(files).length ? files : defaultfiles;

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-slate-950">
      <div className="flex gap-4 justify-start items-center bg-gradient-to-br from-slate-800 to-slate-900 text-white px-6 py-3">
        <img src={susLogo} alt="sus" height={48} width={48} />
        <div>
          <h1 className="text-xl font-bold">AI Website Builder</h1>
          <h2 className="text-xs">Generate websites with AI</h2>
        </div>
      </div>

      <div className="flex flex-row flex-1 overflow-hidden p-3">
        <div className="w-1/5 bg-slate-900 rounded-2xl flex flex-col p-3">
          <div className="flex-1 overflow-y-auto text-white ">
            <div className='flex flex-col gap-2'>
                {lastquery && (<div className='border rounded-xl p-3 w-fit border-gray-700 text-sm text-white bg-gradient-to-br from-blue-500 to-blue-600 self-end'>
                    {lastquery}
                </div>)}
                {think && (<div className='flex flex-col justify-start gap-2'>
                    {think.map((ele,idx)=>{
                        return (
                            <p key={idx} className='border rounded-xl p-3 w-fit border-gray-700 text-sm text-white bg-gray-900'>{ele}</p>
                        )
                    })}
                </div>)}
            </div>
          </div>
          <div className="mt-2 flex gap-2">
            <input
              className="w-full p-2 rounded-lg bg-slate-800 text-white outline-none"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type prompt..."
              onKeyDown={(e)=>{if (e.key=="Enter") handleSubmit()}}
            />
            <input type="submit" className='bg-blue-600 p-2 rounded-xl text-white hover:scale-95 hover:bg-blue-700 transition-transform duration-150 w-1/6' 
            onClick={handleSubmit}  value={sending ? "wait" : "send"} disabled={sending} >
                </input>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 bg-slate-900 rounded-2xl ml-3 text-white">
            <div className='flex justify-center gap-4 mb-3'>
                <button className='bg-slate-800 p-3 rounded-2xl mt-2 hover:scale-95 hover:bg-slate-700 transition-transform duration-150' onClick={() => setView("code")}>
                    Code {"</>"} 
                </button>
                <button className='bg-slate-800 p-3 rounded-2xl mt-2 hover:scale-95 hover:bg-slate-700 transition-transform duration-150' onClick={() => setView("preview")} >
                    Preview 👁️
                </button>
            </div>
            <div className="h-[770px]">
                {view === "code" && (
                    <Sandpack
                        template="react"
                        theme={"dark"}
                        files={sandboxFiles}
                        options={{
                            externalResources: ["https://cdn.tailwindcss.com"],
                            activeFile: "/App.jsx",
                            layout: "preview",
                            editorHeight: 770,
                            editorWidthPercentage: 100,
                            showTabs: true,
                            showLineNumbers: true,
                            showConsole: false,
                        }}
                        customSetup={{
                            dependencies: {
                            react: "^18.2.0",
                            "react-dom": "^18.2.0",
                            tailwindcss: "^3.4.1",
                            postcss: "^8.4.21",
                            autoprefixer: "^10.4.13",
                            },
                        }}
                    />
                )}
                {view === "preview" && (
                    <Sandpack
                        template="react"
                        theme={"dark"}
                        files={sandboxFiles}
                        options={{
                            externalResources: ["https://cdn.tailwindcss.com"],
                            activeFile: "/App.jsx",
                            layout: "preview",
                            editorHeight: 770,
                            editorWidthPercentage: 0,
                            showTabs: true,
                            showLineNumbers: true,
                            showConsole: false,
                        }}
                        customSetup={{
                            dependencies: {
                            react: "^18.2.0",
                            "react-dom": "^18.2.0",
                            tailwindcss: "^3.4.1",
                            postcss: "^8.4.21",
                            autoprefixer: "^10.4.13",
                            },
                        }}
                    />
                )}
            </div>
        </div>
      </div>
    </div>
  )
}

export default Code
