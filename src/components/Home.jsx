import React, { useEffect } from 'react'
import { useState } from 'react';
import useWebSocket from 'react-use-websocket';

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
      .trim();

      UseMsg(cleanedMsg);
    }
  }, [lastJsonMessage]);
  const handleSend = () => {
    UseCurrMsg(inp)
    if (!inp.trim()) return;
    sendJsonMessage({ agent: "normal", query: inp });
    Useinp("")
  }
  return (
    <div className='min-h-screen flex flex-col bg-gray-900 text-white'>
    <div className='flex-1 overflow-y-auto p-6 space-y-4 justify-center items-center'>
    {CurrMsg !== "" && <p className='text-[#1B2631] bg-[#5DADE2] p-3 rounded-xl'>{CurrMsg}</p>}
      <p
        style={{ whiteSpace: 'pre-wrap' }}
        dangerouslySetInnerHTML={{ __html: "NotAnyAI : " + Msg }}
        className='text-[#ECF0F1] bg-[#2C3E50] p-3 rounded-xl'
      ></p>
    </div>
      <div className='p-4 border-t border-gray-700 bg-gray-800 flex gap-2'>
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400"
          value={inp}
          onChange={(e)=>{Useinp(e.target.value)}}
        />
        <button
          className="px-5 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold disabled:opacity-50"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default App