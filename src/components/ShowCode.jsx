import { useEffect, useState } from "react";

const ShowCode = ({ file }) => {
  const [page, setPage] = useState({});
  const [api, setApi] = useState({});
  const [currCode, setCurrCode] = useState("");

  function transformPostCodeResponse(data) {
    if (!data) return {};

    const pages = {};
    const apiFiles = {};

    for (const [filename, contents] of Object.entries(data?.frontendCode ?? {})) {
      pages[filename] = { file: { contents } };
    }

    for (const [filename, contents] of Object.entries(data?.backendCode ?? {})) {
      const normalized = filename.replace(/\//g, "");
      apiFiles[normalized] = { file: { contents } };
    }

    setPage(pages);
    setApi(apiFiles);
    
    // Set first file as default if available
    const firstFile = Object.values(pages)[0] || Object.values(apiFiles)[0];
    if (firstFile && !currCode) {
      setCurrCode(firstFile.file.contents);
    }
  }

  useEffect(() => {
    transformPostCodeResponse(file);
  }, [file]);

  return (
    <div className="flex flex-row h-full">
      {/* Sidebar filenames */}
      <div className="w-1/6 p-4 overflow-y-auto border-r border-gray-700 bg-[#161616]">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase">Frontend</h3>
          {Object.entries(page).map(([filename, obj], idx) => (
            <div key={`page-${idx}`} className="py-1">
              <button
                className="w-full bg-slate-800 px-3 py-2 rounded-lg text-white text-left text-sm hover:bg-slate-700 transition"
                onClick={() => setCurrCode(obj.file.contents)}
              >
                📄 {filename}
              </button>
            </div>
          ))}
        </div>

        {Object.keys(api).length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase">API</h3>
            {Object.entries(api).map(([filename, obj], idx) => (
              <div key={`api-${idx}`} className="py-1">
                <button
                  className="w-full bg-slate-800 px-3 py-2 rounded-lg text-white text-left text-sm hover:bg-slate-700 transition"
                  onClick={() => setCurrCode(obj.file.contents)}
                >
                  ⚡ {filename}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Code viewer */}
      <div className="flex-1 bg-[#252525] p-4 overflow-auto">
        <h1 className="pb-4 text-2xl font-bold text-white pl-2">Code Preview</h1>
        {currCode ? (
          <pre className="text-left text-sm text-green-300 whitespace-pre-wrap bg-black p-4 rounded-lg overflow-x-auto">
            <code>{currCode}</code>
          </pre>
        ) : (
          <div className="text-center text-gray-400 mt-20">
            <p>Select a file to view its code</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowCode;