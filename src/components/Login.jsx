import React, { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

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

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const stat = await LoginAPI(formData);
    setStatus(stat.status);

    if (stat.status === "done") {
      console.log("Login successful via cookie");
      window.location.href = "/app"; // Redirect after successful login
      localStorage.setItem("Authorization", stat.token);
    } else {
      console.log("Login failed");
    }
    setIsSubmitting(false);
  };

  const handleGoogleLogin = () => {
    // ✅ Redirects to backend Google login (cookie will be set after callback)
    window.location.href = "https://notanyai-backend.onrender.com/google/login";
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-blue-200 text-white text-center px-4 relative overflow-hidden font-sans">
      <div className="relative p-8 rounded-3xl bg-gradient-to-r from-white/70 to-blue-50 backdrop-blur-xl border border-blue-100 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <div className="flex justify-center items-center mb-2">
          <span className="text-blue-500 text-5xl font-bold">sus</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl text-gray-800">Welcome back</h1>
          <p className="text-gray-600">Sign in to your NotAny AI account</p>
        </div>

        <form onSubmit={handleManualSubmit}>
          <h1 className="mt-6 mb-6 text-gray-700">(Beta User ONLY)</h1>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full p-3 mb-4 rounded-xl bg-white/50 border border-gray-200 focus:border-blue-300 focus:ring-blue-300/20 text-gray-700 hover:border-gray-400 duration-150 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-3 mb-4 rounded-xl bg-white/50 border border-gray-200 focus:border-blue-300 focus:ring-blue-300/20 text-gray-700 hover:border-gray-400 duration-150 outline-none"
          />
          <div className="flex items-center justify-between mb-10">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
          </div>
          <input
            type="submit"
            value={isSubmitting ? "Submitting..." : "Login"}
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 transform hover:scale-[1.02] transition-all duration-200 font-medium cursor-pointer"
          />
          {status && (
            <p className="mt-4 text-center text-sm text-gray-400">{status}</p>
          )}
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white/70 px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 rounded-2xl bg-white hover:bg-gray-100 text-gray-700 shadow-md transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 font-medium border border-gray-300"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
