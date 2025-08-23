import React, { useState } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";

const Test = () => {
  const [query, setQuery] = useState("");
 const [files, setFiles] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
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
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Testing -  Frontend Code maker</h1>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your prompt..."
          className="border p-2 flex-1 rounded-lg"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Send
        </button>
      </form>

      {/* Sandpack */}
      {files && (
        <div className="max-h-screen h-max">
        <Sandpack
          template="react"
          files={Object.fromEntries(
            Object.entries(files).map(([name, code]) => [
              `/${name}`, 
              { code }
            ])
          )}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
            activeFile: "/App.jsx",
            layout: "preview",
            editorHeight: 900,
            editorWidthPercentage: 30,
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

        </div>
      )}
    </div>
  );
};

export default Test;
