import React, { useEffect } from 'react'
import { useState } from 'react';
import useWebSocket from 'react-use-websocket';
import susLogo from '../assets/sus.svg';

function App() {
  const token = localStorage.getItem("Authorization");
  const [inp, Useinp] = useState("")
  const [Msg, UseMsg] = useState("")
  const [CurrMsg, UseCurrMsg] = useState("")
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(`wss://notanyai-backend.onrender.com/wss/chat?token=${token}`);
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
    UseCurrMsg(inp)
    UseMsg("Thinking...");
    if (!inp.trim()) return;
    sendJsonMessage({ agent: "normal", query: inp });
    Useinp("")
  }
  return (
      <div className='flex flex-row max-h-screen h-screen relative '>
        <div className='bg-green-700 w-1/6 bg-gradient-to-br from-slate-800 to-slate-800'>
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
                <div className='flex flex-col justify-center '>
                {CurrMsg !== "" && <p className='border rounded-xl p-3 w-fit border-gray-700 text-sm text-white bg-gradient-to-br from-blue-500 to-blue-600 self-end'>{CurrMsg}</p>}
                  {Msg !== "" && <p
                    style={{ whiteSpace: 'pre-wrap' }}
                    dangerouslySetInnerHTML={{ __html: "AI : " + Msg }}
                    className='border rounded-xl p-3 w-fit border-gray-700 text-sm text-white bg-gray-900 m-2 '
                  ></p>}
                </div>
              </div>
              
              <div className="p-4 border-t border-slate-700 mb-8 flex gap-4 justify-center items-center relative">
                <div className='w-2/3'><input onKeyDown={(e)=>{if (e.key=="Enter") handleSend()}} value={inp} onChange={(e)=>{Useinp(e.target.value)}} type="text" className='border border-slate-900 bg-slate-700 max-w-full w-full px-4 py-4 rounded-xl hover:border-white/40' placeholder='Enter your prompt'/></div>
                <div><button onClick={handleSend} className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-3 rounded-xl hover:scale-105'>Send</button></div>
              </div>
            </div>
        </div>
      </div>
  )
}

export default App