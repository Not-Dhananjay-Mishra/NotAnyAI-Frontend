import { useEffect, useState } from "react";

const ShowCode = ({ file }) => {
  const [page, setPage] = useState({});
  const [api, setApi] = useState({});
  const [currCode, setCurrCode] = useState("")
  function transformPostCodeResponse(data) {
    if (!data) return {};

    const pages = {};
    const api = {};

    for (const [filename, contents] of Object.entries(data?.frontendCode ?? {})) {
      pages[filename] = { file: { contents } };
    }

    for (const [filename, contents] of Object.entries(data?.backendCode ?? {})) {
      // Normalize backend file names so "video/[id].js" -> "videoid.js"
      const normalized = filename.replace(/\//g, "");
      api[normalized] = { file: { contents } };
    }

    setPage(pages);
    setApi(api);
    console.log("Pages:", pages);
    console.log("API:", api);
  }

  useEffect(() => {
    transformPostCodeResponse(file);
  }, [file]);

  return (
    <div className="flex flex-row h-screen ">
      {/* Sidebar filenames */}
      <div className="w-1/6 p-4 overflow-y-auto border-r border-gray-700">
        {Object.entries(page).map(([filename, obj], idx) => (
          <div key={idx} className="py-2">
            <button
              className="w-full bg-slate-950 px-3 py-2 rounded-2xl text-white text-center hover:bg-[#3f3f40] transition"
              onClick={() => setCurrCode(obj.file.contents)}
            >
              {filename}
            </button>
          </div>
        ))}
      </div>

      {/* Code viewer */}
      <div className="flex-1 bg-gray-900 rounded-lg p-4 shadow-md overflow-auto scrollbar-hide">
        <h1 className="pb-6 pt-5 text-2xl font-bold text-white">Code</h1>
        <pre className="text-left text-sm md:text-base text-green-300 whitespace-pre-wrap">
          <code>{currCode}</code>
        </pre>
      </div>
    </div>
  );
};

export default ShowCode;
