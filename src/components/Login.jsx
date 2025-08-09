import React from 'react';

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 text-white p-8 rounded-lg shadow-lg w-80">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-4 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-400"
        />
        <button
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-semibold"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
