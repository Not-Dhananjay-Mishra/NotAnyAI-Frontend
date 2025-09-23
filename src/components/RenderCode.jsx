import React, { useEffect, useState, useRef } from "react";


function transformPostCodeResponse(data) {
  if (!data) return {};

  const pages = {};
  const api = {};

  for (const [filename, contents] of Object.entries(data?.frontendCode ?? {})) {
    pages[filename] = { file: { contents } };
  }

  for (const [filename, contents] of Object.entries(data?.backendCode ?? {})) {
    // Normalize backend file names so "video/[id].js" -> "video[id].js"
    const normalized = filename.replace(/\//g, '');
    api[normalized] = { file: { contents } };
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
          export default { plugins: { tailwindcss: {}, autoprefixer: {} } }
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
    const [startedonce, setstartedonce] = useState(false)



    useEffect(() => {
        if (!ws || !file) return;

        let runningProcess = null;

        const startContainer = async (files) => {
            await ws.mount(files);

            console.log("reached startcontainer")

            if(!startedonce){
                const installProcess = await ws.spawn("npm", ["install"]);
                await installProcess.exit;
            }
            await ws.spawn("npm", ["run", "dev"]);
            ws.on("server-ready", (port, url) => {
                console.log("Next.js dev server running at:", url);
                setIframeSrc(url);
            });
            setstartedonce(true)
        };

        const filesTree = transformPostCodeResponse(file);
        startContainer(filesTree);
    }, [file]);

    return (
        <div style={{ flex: 1 }}>
            {iframeSrc ? (
                <iframe
                    src={iframeSrc}
                    style={{ width: "100%", height: "830px", border: "none" }}
                    title="Next.js Preview"
                />
            ) : (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-950 to-black text-white">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mb-6"></div>
                    <h2 className="text-2xl font-semibold">Loading Next.js app inside WebContainer...</h2>
                    <p className="mt-2 text-gray-400">This may take a few min ⏳</p>
                </div>
            )}
        </div>
    );
};
