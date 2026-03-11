"use client";

import React from "react";
import { Button } from "./ui/button";
import { registerUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Mail, User, Lock, Loader2 } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await registerUser(username, email, password);
      console.log("🧐 Register response: ", response);

      router.push("/email-verification");
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8 space-y-6 border border-gray-100">
        
        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">
            Create Account 🚀
          </h1>
          <p className="text-gray-500 text-sm">
            Join us and start your journey today
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                required
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}