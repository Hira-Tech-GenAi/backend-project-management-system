"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex flex-col">

      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-bold text-indigo-700">
          MyApp
        </h1>

        <div className="space-x-4">
          <Link href="/login">
            <Button variant="outline" className="rounded-xl">
              Sign In
            </Button>
          </Link>

          <Link href="/register">
            <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-4xl text-center space-y-8">

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight"
          >
            Build Smarter Projects <br />
            <span className="text-indigo-600">With Powerful Tools</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-gray-600 text-lg md:text-xl"
          >
            Manage your workflow, collaborate with your team, and
            boost productivity — all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center gap-6"
          >
            <Link href="/register">
              <Button className="px-8 py-3 text-lg rounded-2xl bg-indigo-600 hover:bg-indigo-700">
                Create Account
              </Button>
            </Link>

            <Link href="/login">
              <Button variant="outline" className="px-8 py-3 text-lg rounded-2xl">
                Login
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} MyApp. All rights reserved.
      </footer>
    </div>
  );
}