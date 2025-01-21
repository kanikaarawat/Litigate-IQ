"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp, signIn } from "@/lib/api/auth";

export default function AuthPage({ onLogin }: { onLogin: () => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const taglines = [
    "Empowering legal professionals with cutting-edge technology.",
    "Streamline your legal workflows efficiently.",
    "Transforming the legal industry one step at a time.",
    "Your legal partner in technology innovation.",
  ];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = isSignUp
        ? await signUp({ name: formData.name, email: formData.email, password: formData.password })
        : await signIn({ email: formData.email, password: formData.password });

      if (response.error) {
        alert(response.error);
      } else {
        alert(`${isSignUp ? "Sign-up" : "Login"} successful!`);
        onLogin();
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col md:flex-row items-center justify-center overflow-hidden">
      <motion.div
        className="flex-1 h-full flex flex-col items-center justify-center text-white p-6 md:p-12 space-y-4"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">LitigateIQ</h1>
        <p className="text-base md:text-lg text-gray-200">
          <Typewriter words={taglines} loop={true} cursor cursorStyle="|" typeSpeed={70} deleteSpeed={50} />
        </p>
      </motion.div>

      <motion.div
        className="flex-1 bg-white flex flex-col justify-center p-4 md:p-6 rounded-lg shadow-xl space-y-3 md:max-w-md md:mr-[8%] h-auto"
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-800">
          {isSignUp ? "Create an Account" : "Login to Your Account"}
        </h2>

        <form onSubmit={handleFormSubmit} className="space-y-3">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-gray-700">
                Name
              </label>
              <Input type="text" id="name" value={formData.name} onChange={handleChange} required />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-700">Email Address</label>
            <Input type="email" id="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-700">Password</label>
            <Input type="password" id="password" value={formData.password} onChange={handleChange} required />
          </div>
          {isSignUp && (
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700">Confirm Password</label>
              <Input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          )}

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 text-sm">
            {isSignUp ? "Sign Up" : "Login"}
          </Button>
        </form>

        <div className="relative flex items-center justify-center py-3">
          <div className="absolute inset-0 border-t border-gray-300"></div>
          <span className="bg-white px-3 text-gray-500 text-xs">OR</span>
        </div>

        <Button
          className="w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-2 text-sm"
        >
          <FaGoogle className="mr-2" /> Continue with Google
        </Button>

        <p className="text-xs text-center text-gray-600">
          {isSignUp ? "Already have an account?" : "Don't have an account?"} {" "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-indigo-600 font-medium hover:underline">
            {isSignUp ? "Login here" : "Sign up here"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
