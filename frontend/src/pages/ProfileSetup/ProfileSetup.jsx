import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Plus, Trash2, Save, Check, AlertCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { skills } from "./Skills";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [skillsProficientAt, setSkillsProficientAt] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [form, setForm] = useState({
    picture: "",
    linkedinLink: "",
    githubLink: "",
    portfolioLink: "",
    skillsProficientAt: [],
    skillsToLearn: [],
    education: [
      {
        id: uuidv4(),
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
        score: "",
        description: "",
      },
    ],
    bio: "",
    projects: []
  });

  useEffect(() => {
    if (!location.state?.userId) {
      navigate("/login");
      return;
    }
    setLoading(false);
  }, [location.state, navigate]);

  const steps = [
    { title: "Basic Info", icon: "" },
    { title: "Education", icon: "" },
    { title: "Additional", icon: "" },
    { title: "Preview", icon: "" },
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaveLoading(true);
    try {
      await axios.post(`/user/${location.state.userId}/profile`, form, { withCredentials: true });
      toast.success("Profile completed successfully!"); 
      navigate("/discover");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to complete profile");
    } finally {
      setSaveLoading(false);
    }
  };

  const validateForm = () => {
    if (form.skillsProficientAt.length === 0) {
      toast.error("Please add at least one skill you're proficient at");
      return false;
    }

    if (form.skillsToLearn.length === 0) {
      toast.error("Please add at least one skill you want to learn");
      return false;
    }

    // Link validation
    const hasAnyLink = form.portfolioLink || form.githubLink || form.linkedinLink;
    if (!hasAnyLink) {
      toast.error("Please add at least one profile link");
      return false;
    }

    // URL validation
    const githubRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+(?:\/)?$/;
    const linkedinRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/;
    const portfolioRegex = /^(?:http(?:s)?:\/\/)?[\w.-]+(?:\/[\w.-]*)?\/?(?:#.*)?(?:\?.*)?$/;

    if (form.githubLink && !githubRegex.test(form.githubLink)) {
      toast.error("Invalid GitHub link. Please use format: https://github.com/username");
      return false;
    }

    if (form.linkedinLink && !linkedinRegex.test(form.linkedinLink)) {
      toast.error("Invalid LinkedIn link. Please use format: https://linkedin.com/in/profile");
      return false;
    }

    if (form.portfolioLink && !portfolioRegex.test(form.portfolioLink)) {
      toast.error("Invalid portfolio link. Please use a valid URL format");
      return false;
    }

    return true;
  };

  return (
    <div className="min-h-screen bg-[#2D2D2D] p-4 md:p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-[#3BB4A1] text-center mb-8"
      >
        Complete Your Profile
      </motion.h1>

      {/* Stepper */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className={`flex flex-col items-center ${
                index <= activeStep ? "text-[#3BB4A1]" : "text-gray-500"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-2
                ${
                  index <= activeStep
                    ? "bg-[#3BB4A1] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.icon}
              </div>
              <span className="text-sm">{step.title}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto">
        {/* Add your form content here based on activeStep */}
        <div className="space-y-6">
          {/* Step 1: Basic Info */}
          {activeStep === 0 && (
            <div>
              <div className="space-y-4">
                {/* Add your form fields here */}
              </div>
            </div>
          )}

          {/* Step 2: Education */}
          {activeStep === 1 && (
            <div>
              {/* Education form fields */}
            </div>
          )}

          {/* Step 3: Additional Info */}
          {activeStep === 2 && (
            <div>
              {/* Additional info form fields */}
            </div>
          )}

          {/* Step 4: Preview */}
          {activeStep === 3 && (
            <div>
              {/* Preview form data */}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={handleBack}
            disabled={activeStep === 0}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeStep === 0
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-[#2D2D2D] text-[#3BB4A1] hover:bg-[#3BB4A1] hover:text-white"
            }`}
          >
            Back
          </button>

          <div className="flex gap-4">
            {activeStep !== steps.length - 1 && (
              <button
                onClick={handleNext}
                className="bg-[#2D2D2D] text-[#3BB4A1] px-6 py-2 rounded-lg hover:bg-[#3BB4A1] hover:text-white transition-colors flex items-center gap-2"
              >
                Next
              </button>
            )}
            {activeStep === steps.length - 1 && (
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
                Complete Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
