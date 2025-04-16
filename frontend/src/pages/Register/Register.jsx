import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Plus, Trash2, Save, Check, AlertCircle } from "lucide-react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { skills } from "./Skills";

const Register = () => {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [skillsProficientAt, setSkillsProficientAt] = useState("Select some skill");
  const [skillsToLearn, setSkillsToLearn] = useState("Select some skill");
  const [techStack, setTechStack] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    portfolioLink: "",
    githubLink: "",
    linkedinLink: "",
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
    projects: [],
  });

  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
      try {
        const { data } = await axios.get("/user/unregistered/getDetails");
        const edu = data?.data?.education || [];
        edu.forEach((ele) => {
          ele.id = uuidv4();
        });
        if (edu.length === 0) {
          edu.push({
            id: uuidv4(),
            institution: "",
            degree: "",
            startDate: "",
            endDate: "",
            score: "",
            description: "",
          });
        }
        const proj = data?.data?.projects || [];
        proj.forEach((ele) => {
          ele.id = uuidv4();
        });
        if (proj) {
          setTechStack(proj.map(() => "Select some Tech Stack"));
        }
        setForm((prevState) => ({
          ...prevState,
          name: data?.data?.name || "",
          email: data?.data?.email || "",
          username: data?.data?.username || "",
          skillsProficientAt: data?.data?.skillsProficientAt || [],
          skillsToLearn: data?.data?.skillsToLearn || [],
          linkedinLink: data?.data?.linkedinLink || "",
          githubLink: data?.data?.githubLink || "",
          portfolioLink: data?.data?.portfolioLink || "",
          education: edu,
          bio: data?.data?.bio || "",
          projects: proj || [],
        }));
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Failed to fetch user details");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const steps = [
    { title: "Basic Info", icon: "👤" },
    { title: "Education", icon: "🎓" },
    { title: "Additional", icon: "📝" },
    { title: "Preview", icon: "✨" },
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "bio" && value.length > 500) {
      toast.error("Bio should be less than 500 characters");
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (type) => {
    const skill = type === "learn" ? skillsToLearn : skillsProficientAt;
    const field = type === "learn" ? "skillsToLearn" : "skillsProficientAt";
    const otherField = type === "learn" ? "skillsProficientAt" : "skillsToLearn";

    if (skill === "Select some skill") {
      toast.error("Please select a skill");
      return;
    }

    if (form[field].includes(skill)) {
      toast.error("Skill already added");
      return;
    }

    if (form[otherField].includes(skill)) {
      toast.error(`Skill already added in ${type === "learn" ? "skills proficient at" : "skills to learn"}`);
      return;
    }

    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], skill],
    }));
  };

  const handleRemoveSkill = (skill, type) => {
    const field = type === "learn" ? "skillsToLearn" : "skillsProficientAt";
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((s) => s !== skill),
    }));
  };

  const handleEducationChange = (e, index) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [name]: value } : edu
      ),
    }));
  };

  const handleAddEducation = () => {
    setForm((prev) => ({
      ...prev,
      education: [
        ...prev.education,
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
    }));
  };

  const handleRemoveEducation = (id) => {
    setForm((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const handleProjectChange = (e, index) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === index ? { ...proj, [name]: value } : proj
      ),
    }));
  };

  const handleAddProject = () => {
    setTechStack((prev) => [...prev, "Select some Tech Stack"]);
    setForm((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: uuidv4(),
          title: "",
          techStack: [],
          startDate: "",
          endDate: "",
          projectLink: "",
          description: "",
        },
      ],
    }));
  };

  const handleRemoveProject = (id) => {
    setForm((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }));
  };

  const handleAddTechStack = (index) => {
    const tech = techStack[index];
    if (tech === "Select some Tech Stack") {
      toast.error("Please select a technology");
      return;
    }

    if (form.projects[index].techStack.includes(tech)) {
      toast.error("Technology already added");
      return;
    }

    setForm((prev) => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === index
          ? { ...proj, techStack: [...proj.techStack, tech] }
          : proj
      ),
    }));
  };

  const handleRemoveTechStack = (projectIndex, tech) => {
    setForm((prev) => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === projectIndex
          ? { ...proj, techStack: proj.techStack.filter((t) => t !== tech) }
          : proj
      ),
    }));
  };

  const validateForm = () => {
    // Basic validation
    if (!form.username) {
      toast.error("Username is required");
      return false;
    }

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

    if (form.githubLink && !githubRegex.test(form.githubLink)) {
      toast.error("Invalid GitHub link");
      return false;
    }

    if (form.linkedinLink && !linkedinRegex.test(form.linkedinLink)) {
      toast.error("Invalid LinkedIn link");
      return false;
    }

    if (form.portfolioLink && !form.portfolioLink.startsWith("http")) {
      toast.error("Invalid portfolio link");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaveLoading(true);
    try {
      let endpoint = "";
      switch (activeStep) {
        case 0:
          endpoint = "/user/unregistered/saveRegDetails";
          break;
        case 1:
          endpoint = "/user/unregistered/saveEduDetail";
          break;
        case 2:
          endpoint = "/user/unregistered/saveAddDetail";
          break;
        default:
          return;
      }

      await axios.post(endpoint, form);
      toast.success("Changes saved successfully");
      handleNext();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to save changes");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaveLoading(true);
    try {
      await axios.post("/user/registerUser", form);
      toast.success("Registration successful!");
      navigate("/discover");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2D2D2D] flex items-center justify-center">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-12 h-12 border-4 border-[#3BB4A1] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2D2D2D] p-4 md:p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-[#3BB4A1] text-center mb-8"
      >
        Registration Form
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
              <span className="text-sm hidden md:block">{step.title}</span>
            </motion.div>
          ))}
        </div>
        <div className="relative mt-4">
          <div className="absolute top-0 h-1 bg-gray-200 w-full rounded" />
          <motion.div
            className="absolute top-0 h-1 bg-[#3BB4A1] rounded"
            initial={{ width: "0%" }}
            animate={{
              width: `${(activeStep / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto bg-[#1a1a1a] rounded-xl p-6 shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeStep === 0 && (
              <div className="space-y-6">
                {/* Basic Info Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#3BB4A1] mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      disabled
                      className="w-full bg-[#2D2D2D] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#3BB4A1] mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      disabled
                      className="w-full bg-[#2D2D2D] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#3BB4A1] mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleInputChange}
                    placeholder="Choose a username"
                    className="w-full bg-[#2D2D2D] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
                  />
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#3BB4A1] mb-2">LinkedIn Profile</label>
                    <input
                      type="url"
                      name="linkedinLink"
                      value={form.linkedinLink}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full bg-[#2D2D2D] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#3BB4A1] mb-2">GitHub Profile</label>
                    <input
                      type="url"
                      name="githubLink"
                      value={form.githubLink}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username"
                      className="w-full bg-[#2D2D2D] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#3BB4A1] mb-2">Portfolio Website</label>
                    <input
                      type="url"
                      name="portfolioLink"
                      value={form.portfolioLink}
                      onChange={handleInputChange}
                      placeholder="https://yourportfolio.com"
                      className="w-full bg-[#2D2D2D] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-[#3BB4A1] mb-2">Skills Proficient At</label>
                    <div className="flex gap-2 mb-2">
                      <select
                        value={skillsProficientAt}
                        onChange={(e) => setSkillsProficientAt(e.target.value)}
                        className="flex-1 bg-[#2D2D2D] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
                      >
                        <option value="Select some skill">Select a skill</option>
                        {skills.map((skill) => (
                          <option key={skill} value={skill}>
                            {skill}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAddSkill("proficient")}
                        className="bg-[#3BB4A1] text-white px-4 py-2 rounded-lg hover:bg-[#2D9A8C] transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.skillsProficientAt.map((skill) => (
                        <motion.span
                          key={skill}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="bg-[#3BB4A1] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {skill}
                          <X
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => handleRemoveSkill(skill, "proficient")}
                          />
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#3BB4A1] mb-2">Skills to Learn</label>
                    <div className="flex gap-2 mb-2">
                      <select
                        value={skillsToLearn}
                        onChange={(e) => setSkillsToLearn(e.target.value)}
                        className="flex-1 bg-[#2D2D2D] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
                      >
                        <option value="Select some skill">Select a skill</option>
                        {skills.map((skill) => (
                          <option key={skill} value={skill}>
                            {skill}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAddSkill("learn")}
                        className="bg-[#3BB4A1] text-white px-4 py-2 rounded-lg hover:bg-[#2D9A8C] transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.skillsToLearn.map((skill) => (
                        <motion.span
                          key={skill}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="bg-[#3BB4A1] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {skill}
                          <X
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => handleRemoveSkill(skill, "learn")}
                          />
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-6">
                {form.education.map((edu, index) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#2D2D2D] p-6 rounded-lg relative"
                  >
                    {index > 0 && (
                      <button
                        onClick={() => handleRemoveEducation(edu.id)}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[#3BB4A1] mb-2">Institution</label>
                        <input
                          type="text"
                          name="institution"
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(e, index)}
                          placeholder="Enter institution name"
                          className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#3BB4A1] mb-2">Degree</label>
                        <input
                          type="text"
                          name="degree"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(e, index)}
                          placeholder="Enter degree name"
                          className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                      <div>
                        <label className="block text-[#3BB4A1] mb-2">Score</label>
                        <input
                          type="number"
                          name="score"
                          value={edu.score}
                          onChange={(e) => handleEducationChange(e, index)}
                          placeholder="Enter score"
                          className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#3BB4A1] mb-2">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          value={edu.startDate ? new Date(edu.startDate).toISOString().split("T")[0] : ""}
                          onChange={(e) => handleEducationChange(e, index)}
                          className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#3BB4A1] mb-2">End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          value={edu.endDate ? new Date(edu.endDate).toISOString().split("T")[0] : ""}
                          onChange={(e) => handleEducationChange(e, index)}
                          className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-[#3BB4A1] mb-2">Description</label>
                      <textarea
                        name="description"
                        value={edu.description}
                        onChange={(e) => handleEducationChange(e, index)}
                        placeholder="Enter description"
                        rows={3}
                        className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
                      />
                    </div>
                  </motion.div>
                ))}

                <motion.button
                  onClick={handleAddEducation}
                  className="w-full bg-[#2D2D2D] text-[#3BB4A1] px-4 py-3 rounded-lg border border-[#3BB4A1]/30 hover:bg-[#3BB4A1] hover:text-white transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Plus className="w-5 h-5" />
                  Add Education
                </motion.button>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-[#3BB4A1] mb-2">Bio (Max 500 characters)</label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    maxLength={500}
                    className="w-full bg-[#2D2D2D] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
                  />
                  <div className="text-right text-sm text-gray-400">
                    {form.bio.length}/500 characters
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl text-[#3BB4A1] font-semibold">Projects</h3>
                  
                  {form.projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-[#2D2D2D] p-6 rounded-lg relative"
                    >
                      <button
                        onClick={() => handleRemoveProject(project.id)}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[#3BB4A1] mb-2">Project Title</label>
                          <input
                            type="text"
                            name="title"
                            value={project.title}
                            onChange={(e) => handleProjectChange(e, index)}
                            placeholder="Enter project title"
                            className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#3BB4A1] mb-2">Project Link</label>
                          <input
                            type="url"
                            name="projectLink"
                            value={project.projectLink}
                            onChange={(e) => handleProjectChange(e, index)}
                            placeholder="https://github.com/username/project"
                            className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-[#3BB4A1] mb-2">Tech Stack</label>
                        <div className="flex gap-2 mb-2">
                          <select
                            value={techStack[index]}
                            onChange={(e) => {
                              setTechStack((prev) =>
                                prev.map((tech, i) => (i === index ? e.target.value : tech))
                              );
                            }}
                            className="flex-1 bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
                          >
                            <option value="Select some Tech Stack">Select technology</option>
                            {skills.map((skill) => (
                              <option key={skill} value={skill}>
                                {skill}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleAddTechStack(index)}
                            className="bg-[#3BB4A1] text-white px-4 py-2 rounded-lg hover:bg-[#2D9A8C] transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map((tech) => (
                            <motion.span
                              key={tech}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="bg-[#3BB4A1] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                            >
                              {tech}
                              <X
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => handleRemoveTechStack(index, tech)}
                              />
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <label className="block text-[#3BB4A1] mb-2">Start Date</label>
                          <input
                            type="date"
                            name="startDate"
                            value={project.startDate ? new Date(project.startDate).toISOString().split("T")[0] : ""}
                            onChange={(e) => handleProjectChange(e, index)}
                            className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#3BB4A1] mb-2">End Date</label>
                          <input
                            type="date"
                            name="endDate"
                            value={project.endDate ? new Date(project.endDate).toISOString().split("T")[0] : ""}
                            onChange={(e) => handleProjectChange(e, index)}
                            className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-[#3BB4A1] mb-2">Description</label>
                        <textarea
                          name="description"
                          value={project.description}
                          onChange={(e) => handleProjectChange(e, index)}
                          placeholder="Describe your project..."
                          rows={3}
                          className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#3BB4A1]/30 focus:outline-none focus:border-[#3BB4A1]"
                        />
                      </div>
                    </motion.div>
                  ))}

                  <motion.button
                    onClick={handleAddProject}
                    className="w-full bg-[#2D2D2D] text-[#3BB4A1] px-4 py-3 rounded-lg border border-[#3BB4A1]/30 hover:bg-[#3BB4A1] hover:text-white transition-colors flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Plus className="w-5 h-5" />
                    Add Project
                  </motion.button>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#2D2D2D] p-6 rounded-lg"
                >
                  <h3 className="text-xl text-[#3BB4A1] font-semibold mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Name</p>
                      <p className="text-white">{form.name || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Email</p>
                      <p className="text-white">{form.email || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Username</p>
                      <p className="text-white">{form.username || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-[#3BB4A1] font-semibold mb-2">Social Links</h4>
                    <div className="space-y-2">
                      <p className="text-gray-400">LinkedIn: <span className="text-white">{form.linkedinLink || "Not provided"}</span></p>
                      <p className="text-gray-400">GitHub: <span className="text-white">{form.githubLink || "Not provided"}</span></p>
                      <p className="text-gray-400">Portfolio: <span className="text-white">{form.portfolioLink || "Not provided"}</span></p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-[#3BB4A1] font-semibold mb-2">Skills</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-gray-400 mb-1">Proficient At:</p>
                        <div className="flex flex-wrap gap-2">
                          {form.skillsProficientAt.map((skill) => (
                            <span key={skill} className="bg-[#3BB4A1]/20 text-[#3BB4A1] px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Want to Learn:</p>
                        <div className="flex flex-wrap gap-2">
                          {form.skillsToLearn.map((skill) => (
                            <span key={skill} className="bg-[#3BB4A1]/20 text-[#3BB4A1] px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-[#2D2D2D] p-6 rounded-lg"
                >
                  <h3 className="text-xl text-[#3BB4A1] font-semibold mb-4">Education</h3>
                  <div className="space-y-4">
                    {form.education.map((edu) => (
                      <div key={edu.id} className="border-b border-gray-700 pb-4 last:border-0">
                        <h4 className="text-white font-semibold">{edu.institution}</h4>
                        <p className="text-gray-400">{edu.degree}</p>
                        <p className="text-gray-400 text-sm">
                          {edu.startDate && edu.endDate
                            ? `${new Date(edu.startDate).toLocaleDateString()} - ${new Date(edu.endDate).toLocaleDateString()}`
                            : "Dates not provided"}
                        </p>
                        <p className="text-gray-400">Score: {edu.score || "Not provided"}</p>
                        {edu.description && (
                          <p className="text-gray-400 mt-2">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#2D2D2D] p-6 rounded-lg"
                >
                  <h3 className="text-xl text-[#3BB4A1] font-semibold mb-4">Additional Information</h3>
                  
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-2">Bio</h4>
                    <p className="text-gray-400">{form.bio || "No bio provided"}</p>
                  </div>

                  <h4 className="text-white font-semibold mb-4">Projects</h4>
                  <div className="space-y-6">
                    {form.projects.map((project) => (
                      <div key={project.id} className="border-b border-gray-700 pb-4 last:border-0">
                        <h5 className="text-[#3BB4A1] font-semibold">{project.title}</h5>
                        <div className="flex flex-wrap gap-2 my-2">
                          {project.techStack.map((tech) => (
                            <span key={tech} className="bg-[#3BB4A1]/20 text-[#3BB4A1] px-2 py-1 rounded-full text-xs">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-400 text-sm">
                          {project.startDate && project.endDate
                            ? `${new Date(project.startDate).toLocaleDateString()} - ${new Date(project.endDate).toLocaleDateString()}`
                            : "Dates not provided"}
                        </p>
                        <a
                          href={project.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#3BB4A1] hover:underline text-sm"
                        >
                          View Project
                        </a>
                        {project.description && (
                          <p className="text-gray-400 mt-2">{project.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              activeStep === 0
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-[#2D2D2D] text-white hover:bg-[#3BB4A1]"
            }`}
            disabled={activeStep === 0}
          >
            Back
          </button>

          <div className="flex gap-4">
            {activeStep !== steps.length - 1 && (
              <button
                onClick={handleSave}
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
                  <>
                    <Save className="w-5 h-5" />
                    Save
                  </>
                )}
              </button>
            )}

            {activeStep === steps.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={saveLoading}
                className="bg-[#3BB4A1] text-white px-6 py-2 rounded-lg hover:bg-[#2D9A8C] transition-colors flex items-center gap-2"
              >
                {saveLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Submit
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-[#3BB4A1] text-white px-6 py-2 rounded-lg hover:bg-[#2D9A8C] transition-colors flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;