import React from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    username: "",
    password: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      // Using the backend server URL (running on port 8000)
      const response = await axios.post("http://localhost:8000/auth/register", form);
      if (response.data.success) {
        toast.success("Registration successful! Please complete your profile.");
        navigate("/profile-setup", { state: { userId: response.data.user.id } });
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Failed to connect to server. Please check if the backend server is running.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2D2D2D] p-4 md:p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-[#3BB4A1] text-center mb-8"
      >
        Create Account
      </motion.h1>

      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[#3BB4A1] mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
              />
            </div>

            <div>
              <label className="block text-[#3BB4A1] mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
              />
            </div>

            <div>
              <label className="block text-[#3BB4A1] mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleInputChange}
                placeholder="Enter a username"
                className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
              />
            </div>

            <div>
              <label className="block text-[#3BB4A1] mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleInputChange}
                placeholder="Enter a password"
                className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={saveLoading}
              className="bg-[#2D2D2D] text-[#3BB4A1] px-6 py-2 rounded-lg hover:bg-[#3BB4A1] hover:text-white transition-colors flex items-center gap-2"
            >
              {saveLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;