import React, { useEffect, useState, useRef } from "react";

function transformPostCodeResponse(data) {
  if (!data) return {};

  const pages = {};
  const api = {};

  for (const [filename, contents] of Object.entries(data?.frontendCode ?? {})) {
    pages[filename] = { file: { contents } };
  }

  for (const [filename, contents] of Object.entries(data?.backendCode ?? {})) {
    // Split the path and build nested structure
    const parts = filename.split('/').filter(Boolean);
    let current = api;
    
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = { directory: {} };
      }
      current = current[parts[i]].directory;
    }
    
    const fileName = parts[parts.length - 1];
    current[fileName] = { file: { contents } };
  }

  return {
    pages: {
      directory: {
        ...pages,
        api: { directory: api },
        "_app.js": {
          file: {
            contents: `
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
            `,
          },
        },
      },
    },
    styles: {
      directory: {
        "globals.css": {
          file: {
            contents: `
@tailwind base;
@tailwind components;
@tailwind utilities;
            `,
          },
        },
      },
    },
    "tailwind.config.js": {
      file: {
        contents: `
export default {
  content: ['./pages/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: [],
};
        `,
      },
    },
    "postcss.config.js": {
      file: {
        contents: `
export default { 
  plugins: { 
    tailwindcss: {}, 
    autoprefixer: {} 
  } 
}
        `,
      },
    },
    "package.json": {
      file: {
        contents: JSON.stringify({
          name: "webcontainer-nextjs-tailwind-app",
          type: "module",
          scripts: {
            dev: "next dev",
            build: "next build",
            start: "next start"
          },
          dependencies: {
            react: "^18.2.0",
            "react-dom": "^18.2.0",
            next: "^14.0.0",
            tailwindcss: "^3.3.2",  
            postcss: "^8.4.21",
            autoprefixer: "^10.4.14",
            "@react-three/fiber": "^8.15.16",
            "@react-three/drei": "^9.101.3",
            "framer-motion": "^11.2.6"
          },
        }),
      },
    },
  };
}

export const RenderCode = ({ file, ws }) => {
  const [iframeSrc, setIframeSrc] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState("Initializing...");
  const installStartedRef = useRef(false);
  const serverStartedRef = useRef(false);

  useEffect(() => {
    if (!ws || !file) return;

    const startContainer = async (files) => {
      try {
        setLoadingStatus("Mounting files...");
        await ws.mount(files);
        console.log("✓ Files mounted");

        // Only install once per session
        if (!installStartedRef.current) {
          installStartedRef.current = true;
          setLoadingStatus("Installing dependencies (this happens once)...");
          
          const installProcess = await ws.spawn("npm", ["install"]);
          
          // Show progress by monitoring output
          installProcess.output.pipeTo(new WritableStream({
            write(data) {
              console.log(data);
            }
          }));

          const installExitCode = await installProcess.exit;
          
          if (installExitCode !== 0) {
            console.error("npm install failed");
            setLoadingStatus("Installation failed. Please refresh.");
            return;
          }
          console.log("✓ Dependencies installed");
        } else {
          console.log("✓ Using cached dependencies");
        }

        // Start server only if not already running
        if (!serverStartedRef.current) {
          serverStartedRef.current = true;
          setLoadingStatus("Starting dev server...");
          
          const devProcess = await ws.spawn("npm", ["run", "dev"]);
          
          // Monitor server output
          devProcess.output.pipeTo(new WritableStream({
            write(data) {
              console.log(data);
            }
          }));
        }
        
        // Listen for server ready
        ws.on("server-ready", (port, url) => {
          console.log("✓ Server ready at:", url);
          setLoadingStatus("Ready!");
          setIframeSrc(url);
        });

      } catch (error) {
        console.error("Error:", error);
        setLoadingStatus("Error loading container. Please refresh.");
      }
    };

    const filesTree = transformPostCodeResponse(file);
    startContainer(filesTree);

  }, [file, ws]);

  return (
    <div className="w-full h-full">
      {iframeSrc ? (
        <iframe
          src={iframeSrc}
          className="w-full h-full border-none"
          title="Next.js Preview"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full bg-[#161616] text-white">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-2">{loadingStatus}</h2>
          <p className="mt-2 text-gray-400 text-center max-w-md">
            {installStartedRef.current 
              ? "Almost there! The server is starting up..." 
              : "First load takes longer. Subsequent loads will be instant! ⚡"}
          </p>
          <div className="mt-6 flex gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};