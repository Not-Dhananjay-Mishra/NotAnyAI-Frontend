import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const LoginAPI = async (formData) => {
    const res = await fetch("http://localhost:8000/login", {
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
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 text-white p-8 rounded-lg shadow-lg w-80">
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="w-full p-2 mb-4 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full p-2 mb-4 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-400"
          />

          <input
            type="submit"
            value={isSubmitting ? "Submitting..." : "Login"}
            disabled={isSubmitting}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-semibold cursor-pointer"
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
