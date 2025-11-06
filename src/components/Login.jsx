import React, { useEffect, useRef, useState } from 'react'

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Call backend login
  const LoginAPI = async (formData) => {
    const res = await fetch("https://notanyai-backend.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    return res.json();
  };
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const stat = await LoginAPI(formData);
    setStatus(stat.status);

    if (stat.status === "done") {
      etStatus("Login Done Redirecting...");
      window.location.href = "/app"; // Redirect after successful login
      localStorage.setItem("Authorization", stat.token);
    } else {
      setStatus("Login failed Please enter valid crediantials");
      console.log("Login failed");
    }
    setIsSubmitting(false);
  };

  const handleGoogleLogin = () => {
    // ✅ Redirects to backend Google login (cookie will be set after callback)
    window.location.href = "https://notanyai-backend.onrender.com/google/login";
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#161616] text-white text-center px-4 relative overflow-hidden font-sans">
          {status && (
            <div className='absolute z-50 left-10 bottom-10'>
              <p className="mt-4 text-center text-sm text-black bg-white px-4 py-3 rounded-xl transition-all duration-300 ease-in">{status}</p>
            </div>
          )}
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`
        }}
      />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative p-8 rounded-3xl bg-[#222222] backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-300">
        <div className="flex justify-center items-center mb-2">
        <h1 className="text-3xl md:text-6xl font-instrument font-extrabold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-lg animate-gradient bg-[length:200%_auto]">
          NotAnyAI
        </h1>
        </div>
        <div className="space-y-2 mb-8">
          <h1 className="text-2xl text-white">Welcome back</h1>
          <p className="text-white">Sign in to your NotAnyAI account</p>
        </div>

        <form onSubmit={handleManualSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            autoComplete="off"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full p-3 mb-4 rounded-2xl bg-[#333333] text-white duration-150 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="off"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-3 mb-4 rounded-2xl bg-[#333333] text-white duration-150 outline-none"
          />
          <div className="flex items-center justify-between mb-10">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-white">Remember me</span>
            </label>
          </div>
          <input
            type="submit"
            value={isSubmitting ? "Loading..." : "Login"}
            disabled={isSubmitting}
            className="bg-white text-black px-8 py-3 mx-auto rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-white/20 hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          />
        </form>

        <div className="relative my-6">
        </div>

      </div>
    </div>
  );
};

export default Login;
