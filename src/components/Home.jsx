import React, { useEffect, useRef  } from 'react'
import { useState } from 'react';
import useWebSocket from 'react-use-websocket';
import susLogo from '../assets/sus.svg';

function App() {
  const token = localStorage.getItem("Authorization");
  const [file, Usefile] = useState(null)
  const [lastfile, Uselastfile] = useState(null)
  const [inp, Useinp] = useState("")
  const [Msg, UseMsg] = useState("")
  const [CurrMsg, UseCurrMsg] = useState("")
  const messagesEndRef = useRef(null);
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(`wss://notanyai-backend.onrender.com/wss/chat?token=${token}`);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [Msg]);
  useEffect(() => {
    if (lastJsonMessage?.text) {
    const cleanedMsg = lastJsonMessage.text
      .replace(/^"|"$/g, "") // remove surrounding quotes
      .replace(/\\n/g, "<br/>") // replace \n with <br/>
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") 
      .replace(/\*(.*?)\*/g, "<strong>$1</strong>") 
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .trim();

      UseMsg(cleanedMsg);
    }
  }, [lastJsonMessage]);
  const handleSend = () => {
    UseCurrMsg(inp);
    UseMsg("Thinking...");

    if (!inp.trim()) return;

    if (file) {
      Uselastfile(file)
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("e")
        const base64Data = reader.result.split(",")[1]; // this is your base64 string
        sendJsonMessage({ agent: "img", query: inp, img: base64Data });
        Useinp("");
        Usefile(null);
      };
      reader.readAsDataURL(file);
    } else {
      // No image selected
      sendJsonMessage({ agent: "normal", query: inp, img: "" });
      Useinp("");
      Usefile(null)
      
    }
  };
  return (
      <div className='flex flex-row h-[100dvh] overflow-hidden relative '>
        <div className='bg-green-700 hidden md:block  md:w-1/6 bg-gradient-to-br from-slate-800 to-slate-800'>
          <div className='bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-b-xl flex items-center gap-3'>
            <img src={susLogo} alt="sus" height={64} width={64} />
            <div className='text-white hidden md:block'>
              <h1 className='text-xl font-bold'>NotAny AI</h1>
              <h2>Your AI Assistant</h2>
            </div>
          </div>
          <div className='mt-5 mx-4 font-bold'>
          <button 
            className="w-full hidden md:block bg-gradient-to-r py-3 from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 rounded-xl transform hover:scale-[1.02] transition-all duration-200"
          >
            New Conversation 
          </button>
          <button 
            className="w-full md:hidden bg-gradient-to-r py-3 from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 rounded-xl transform hover:scale-[1.02] transition-all duration-200"
          >
            + 
          </button>
          </div>
        </div>
        <div className='bg-red-500 flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white '>
            <div className='flex flex-col h-full'>
              <div className=' bg-gradient-to-br from-slate-900/80 to-slate-800/80 px-8 py-5 flex justify-between'>
                <div>
                  <h1 className='text-lg md:text-xl'>Welcome to <span className='font-bold'>NotAny AI</span></h1>
                  <p className=' text-xs md:text-xs text-slate-400'>Powered by advanced AI • Always here to help</p>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-slate-500">Online</span>
                  </div>
                </div>
              </div>
              <div className='flex-1 p-4 overflow-y-auto'>
                <div className='flex flex-col justify-centre '>
                    {lastfile && (
                      <div className='self-end'>
                        <img
                          src={URL.createObjectURL(lastfile)}
                          alt={lastfile.name}
                          className="max-w-xs rounded-md mb-2"
                        />
                      </div>
                    )}
                {CurrMsg !== "" && (
                
                  <div className='border rounded-xl p-3 w-fit border-gray-700 text-sm text-white bg-gradient-to-br from-blue-500 to-blue-600 self-end'>
                    {CurrMsg}
                  </div>)}
                  {Msg !== "" &&
                  <p
                    style={{ whiteSpace: 'pre-wrap' }}
                    dangerouslySetInnerHTML={{ __html: "AI : " + Msg }}
                    className='border rounded-xl p-3 w-fit border-gray-700 text-sm text-white bg-gray-900 m-2 '
                  ></p>}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              <div className="p-4 border-t border-slate-700 flex flex-shrink-0 gap-2 justify-center items-center">
                <div className='w-3/4  overflow-hidden '>
                <div className='max-h-16 rounded-t-xl bg-slate-700 p-2 flex items-start justify-start'>
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
                  <input onKeyDown={(e)=>{if (e.key=="Enter") handleSend()}} value={inp} onChange={(e)=>{Useinp(e.target.value)}} 
                  type="text" className='border-none bg-slate-700 max-w-full w-full p-4 rounded-b-xl hover:border-white/40 outline-none focus:outline-none' 
                  placeholder='Enter your prompt'/>
                </div>
                <div>
                  <input type="file" id="fileInput" 
                  accept="image/*" 
                   onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        Usefile(e.target.files[0]);
                      }
                    }}
                  className="w-10 h-10 hidden items-center justify-center rounded-full hover:bg-slate-600 cursor-pointer transition-colors"/>
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
                <div><button onClick={handleSend} className=' bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-3 rounded-full hover:scale-90'>→</button></div>
              </div>
            </div>
        </div>
      </div>
  )
}

export default App