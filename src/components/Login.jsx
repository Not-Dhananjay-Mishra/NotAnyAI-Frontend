import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import susLogo from '../assets/sus.svg';


function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const LoginAPI = async (formData) => {
    const res = await fetch("https://notanyai-backend.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });
    return res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const stat = await LoginAPI(formData);
    setStatus(stat.status);
    if (stat.status === "done") {
      localStorage.setItem("Authorization", stat.token);
      navigate("/app");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50  to-blue-200 text-white text-center px-4 relativ overflow-hidden">
      <div className="relative p-8 rounded-3xl bg-gradient-to-r from-white/70 to-blue-50 backdrop-blur-xl border border-blue-100 shadow-2xl hover:shadow-3xl transition-all duration-300 ">
        <div className="flex justify-center items-center mb-2">
          <img src={susLogo} alt="sus" height={64} width={64} />
        </div>
              <div className="space-y-2">
                <h1 className="text-3xl text-gray-800">Welcome back</h1>
                <p className="text-gray-600">Sign in to your NotAny AI account</p>
              </div>
        <form onSubmit={handleSubmit}>
          <h1 className=" mb-6 text-gray-700">(Beta User ONLY)</h1>

          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="w-full p-2 mb-4 rounded-xl bg-white/50 border border-gray-200 focus:border-blue-300 focus:ring-blue-300/20 text-gray-700 hover:border-gray-400 duration-150"
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full p-2 mb-4 rounded-xl bg-white/50 border border-gray-200 focus:border-blue-300 focus:ring-blue-300/20 relative text-gray-700 hover:border-gray-400 duration-150"
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
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 transform hover:scale-[1.02] transition-all duration-200"
          />

          {status && (
            <p className="mt-4 text-center text-sm text-gray-400">{status}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
