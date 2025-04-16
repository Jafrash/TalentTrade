import React from "react";
import { motion } from "framer-motion";
import { Chrome } from "lucide-react";

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/auth/google";
  };

  return (
    <div className="min-h-screen bg-[#2D2D2D] flex items-center justify-center relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3BB4A1]/10 to-transparent pointer-events-none" />
      
      {/* Decorative circles */}
      <motion.div 
        className="absolute -left-32 -top-32 w-64 h-64 bg-[#3BB4A1]/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute -right-32 -bottom-32 w-64 h-64 bg-[#3BB4A1]/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Login container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#1a1a1a]/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-[#3BB4A1]/20">
          <motion.h1 
            className="text-5xl font-bold text-center text-[#3BB4A1] mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            LOGIN
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex justify-center"
          >
            <motion.button
              className="flex items-center gap-2 bg-[#3BB4A1] text-white px-6 py-3 rounded-lg 
                         font-medium transition-all hover:bg-[#028477] active:scale-95"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoogleLogin}
            >
              <Chrome className="w-5 h-5" />
              Login with Google
            </motion.button>
          </motion.div>

          {/* Decorative elements */}
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#3BB4A1]/20" />
            <span className="text-sm text-gray-400">or</span>
            <div className="h-px flex-1 bg-[#3BB4A1]/20" />
          </div>

          {/* Additional login options or information */}
          <motion.p 
            className="mt-6 text-center text-gray-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            By logging in, you agree to our Terms of Service and Privacy Policy
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;