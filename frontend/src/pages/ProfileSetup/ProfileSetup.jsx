import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Plus, Trash2, Save, Check, AlertCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { skills } from "../Register/Skills";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [saveLoading, setSaveLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("registration");
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
  const [skillsProficientAt, setSkillsProficientAt] = useState("");
  const [skillsToLearn, setSkillsToLearn] = useState("");
  const [techStack, setTechStack] = useState([]);

  useEffect(() => {
    if (!location.state?.userId) {
      navigate("/login");
      return;
    }
  }, [location.state, navigate]);

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (type) => {
    if (type === "toLearn") {
      if (!skillsToLearn || form.skillsToLearn.includes(skillsToLearn) || form.skillsProficientAt.includes(skillsToLearn)) {
        return;
      }
      setForm((prev) => ({ ...prev, skillsToLearn: [...prev.skillsToLearn, skillsToLearn] }));
      setSkillsToLearn("");
    } else {
      if (!skillsProficientAt || form.skillsProficientAt.includes(skillsProficientAt) || form.skillsToLearn.includes(skillsProficientAt)) {
        return;
      }
      setForm((prev) => ({ ...prev, skillsProficientAt: [...prev.skillsProficientAt, skillsProficientAt] }));
      setSkillsProficientAt("");
    }
  };

  const handleRemoveSkill = (skill, type) => {
    setForm((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item !== skill),
    }));
  };

  const handleEducationChange = (e, index) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      education: prev.education.map((item, i) => (i === index ? { ...item, [name]: value } : item)),
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
      education: prev.education.filter((item) => item.id !== id),
    }));
  };

  const handleProjectChange = (e, index) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      projects: prev.projects.map((item, i) => (i === index ? { ...item, [name]: value } : item)),
    }));
  };

  const handleAddProject = () => {
    setTechStack((prev) => [...prev, ""]);
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
      projects: prev.projects.filter((item) => item.id !== id),
    }));
    setTechStack((prev) => prev.slice(0, -1));
  };

  const handleAddTechStack = (index, value) => {
    if (!value) return;
    setForm((prev) => ({
      ...prev,
      projects: prev.projects.map((item, i) =>
        i === index && !item.techStack.includes(value)
          ? { ...item, techStack: [...item.techStack, value] }
          : item
      ),
    }));
    setTechStack((prev) => prev.map((item, i) => (i === index ? "" : item)));
  };

  const handleRemoveTechStack = (index, skill) => {
    setForm((prev) => ({
      ...prev,
      projects: prev.projects.map((item, i) =>
        i === index
          ? { ...item, techStack: item.techStack.filter((s) => s !== skill) }
          : item
      ),
    }));
  };

  // --- Validation ---
  const validateForm = () => {
    if (!form.username) {
      toast.error("Username is empty");
      return false;
    }
    if (!form.skillsProficientAt.length) {
      toast.error("Enter at least one Skill you are proficient at");
      return false;
    }
    if (!form.skillsToLearn.length) {
      toast.error("Enter at least one Skill you want to learn");
      return false;
    }
    if (!form.portfolioLink && !form.githubLink && !form.linkedinLink) {
      toast.error("Enter at least one link among portfolio, github and linkedin");
      return false;
    }
    if (form.githubLink && !/^(?:http(?:s)?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+(?:\/)?$/.test(form.githubLink)) {
      toast.error("Enter a valid github link");
      return false;
    }
    if (form.linkedinLink && !/^(?:http(?:s)?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/.test(form.linkedinLink)) {
      toast.error("Enter a valid linkedin link");
      return false;
    }
    if (form.portfolioLink && !form.portfolioLink.includes("http")) {
      toast.error("Enter a valid portfolio link");
      return false;
    }
    // Education validation
    for (const edu of form.education) {
      if (!edu.institution || !edu.degree || !edu.startDate || !edu.endDate || !edu.score) {
        toast.error("Fill all education fields");
        return false;
      }
    }
    // Projects validation
    for (const project of form.projects) {
      if (!project.title || !project.techStack.length || !project.startDate || !project.endDate || !project.projectLink || !project.description) {
        toast.error("Fill all project fields");
        return false;
      }
      if (project.startDate > project.endDate) {
        toast.error("Project start date must be before end date");
        return false;
      }
      if (!project.projectLink.match(/^(http|https):\/\/[^ "']+$/)) {
        toast.error("Please provide valid project link");
        return false;
      }
    }
    if (!form.bio) {
      toast.error("Bio is empty");
      return false;
    }
    if (form.bio.length > 500) {
      toast.error("Bio should be less than 500 characters");
      return false;
    }
    return true;
  };

  // --- Submit ---
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSaveLoading(true);
    try {
      await axios.post('/user/registered/saveRegDetails', form, { withCredentials: true });
      toast.success("Profile completed successfully!");
      navigate("/discover");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to complete profile");
    } finally {
      setSaveLoading(false);
    }
  };

  // --- UI ---
  return (
    <div className="min-h-screen bg-[#2D2D2D] p-4 md:p-8">
      <h1 className="text-4xl md:text-5xl font-bold text-[#3BB4A1] text-center mb-8">Complete Your Profile</h1>
      <div className="max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full flex justify-between">
            <TabsTrigger value="registration">Registration</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="bio">Bio</TabsTrigger>
          </TabsList>
          <TabsContent value="registration">
            <div className="space-y-4">
              <Input label="Full Name" name="name" value={form.name} onChange={handleInputChange} placeholder="Enter your full name" required />
              <Input label="Email" name="email" value={form.email} onChange={handleInputChange} placeholder="Enter your email" required />
              <Input label="Username" name="username" value={form.username} onChange={handleInputChange} placeholder="Enter your username" required />
              <Input label="Linkedin Link" name="linkedinLink" value={form.linkedinLink} onChange={handleInputChange} placeholder="Enter your Linkedin link" />
              <Input label="Github Link" name="githubLink" value={form.githubLink} onChange={handleInputChange} placeholder="Enter your Github link" />
              <Input label="Portfolio Link" name="portfolioLink" value={form.portfolioLink} onChange={handleInputChange} placeholder="Enter your portfolio link" />
              <div>
                <label className="block text-[#3BB4A1] mb-2">Skills Proficient At</label>
                <div className="flex gap-2 mb-2">
                  <select
                    value={skillsProficientAt}
                    onChange={e => setSkillsProficientAt(e.target.value)}
                    className="rounded-md border border-gray-300 bg-slate-900 text-white p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select a skill</option>
                    {skills.map((skill, idx) => (
                      <option key={idx} value={skill}>{skill}</option>
                    ))}
                  </select>
                  <Button type="button" onClick={() => handleAddSkill("proficientAt")}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.skillsProficientAt.map((skill, idx) => (
                    <Badge key={idx} className="cursor-pointer" onClick={() => handleRemoveSkill(skill, "skillsProficientAt")}>{skill} &times;</Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[#3BB4A1] mb-2">Skills To Learn</label>
                <div className="flex gap-2 mb-2">
                  <select
                    value={skillsToLearn}
                    onChange={e => setSkillsToLearn(e.target.value)}
                    className="rounded-md border border-gray-300 bg-slate-900 text-white p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select a skill</option>
                    {skills.map((skill, idx) => (
                      <option key={idx} value={skill}>{skill}</option>
                    ))}
                  </select>
                  <Button type="button" onClick={() => handleAddSkill("toLearn")}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.skillsToLearn.map((skill, idx) => (
                    <Badge key={idx} className="cursor-pointer" onClick={() => handleRemoveSkill(skill, "skillsToLearn")}>{skill} &times;</Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <Button type="button" onClick={() => setActiveTab("education")}>Next</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="education">
            <div className="space-y-4">
              {form.education.map((edu, idx) => (
                <div key={edu.id} className="border border-[#3BB4A1] rounded-lg p-4 mb-2">
                  <Input label="Institution" name="institution" value={edu.institution} onChange={e => handleEducationChange(e, idx)} placeholder="Institution name" />
                  <Input label="Degree" name="degree" value={edu.degree} onChange={e => handleEducationChange(e, idx)} placeholder="Degree" />
                  <Input label="Score" name="score" value={edu.score} onChange={e => handleEducationChange(e, idx)} placeholder="Grade/Percentage" />
                  <div className="flex gap-4">
                    <Input label="Start Date" name="startDate" type="date" value={edu.startDate} onChange={e => handleEducationChange(e, idx)} />
                    <Input label="End Date" name="endDate" type="date" value={edu.endDate} onChange={e => handleEducationChange(e, idx)} />
                  </div>
                  <Input label="Description" name="description" value={edu.description} onChange={e => handleEducationChange(e, idx)} placeholder="Description" />
                  {form.education.length > 1 && (
                    <Button type="button" variant="destructive" onClick={() => handleRemoveEducation(edu.id)} className="mt-2">Remove</Button>
                  )}
                </div>
              ))}
              <Button type="button" onClick={handleAddEducation}>Add Education</Button>
              <div className="flex justify-between gap-4 mt-4">
                <Button type="button" onClick={() => setActiveTab("registration")}>Back</Button>
                <Button type="button" onClick={() => setActiveTab("projects")}>Next</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="projects">
            <div className="space-y-4">
              {form.projects.map((project, idx) => (
                <div key={project.id} className="border border-[#3BB4A1] rounded-lg p-4 mb-2">
                  <Input label="Title" name="title" value={project.title} onChange={e => handleProjectChange(e, idx)} placeholder="Project title" />
                  <div>
                    <label className="block text-[#3BB4A1] mb-2">Tech Stack</label>
                    <div className="flex gap-2 mb-2">
                      <Input value={techStack[idx] || ""} onChange={e => setTechStack(prev => prev.map((item, i) => i === idx ? e.target.value : item))} placeholder="Add tech stack" />
                      <Button type="button" onClick={() => handleAddTechStack(idx, techStack[idx])}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack && project.techStack.map((skill, i) => (
                        <Badge key={i} className="cursor-pointer" onClick={() => handleRemoveTechStack(idx, skill)}>{skill} &times;</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Input label="Start Date" name="startDate" type="date" value={project.startDate} onChange={e => handleProjectChange(e, idx)} />
                    <Input label="End Date" name="endDate" type="date" value={project.endDate} onChange={e => handleProjectChange(e, idx)} />
                  </div>
                  <Input label="Project Link" name="projectLink" value={project.projectLink} onChange={e => handleProjectChange(e, idx)} placeholder="Project link" />
                  <Input label="Description" name="description" value={project.description} onChange={e => handleProjectChange(e, idx)} placeholder="Description" />
                  <Button type="button" variant="destructive" onClick={() => handleRemoveProject(project.id)} className="mt-2">Remove</Button>
                </div>
              ))}
              <Button type="button" onClick={handleAddProject}>Add Project</Button>
              <div className="flex justify-between gap-4 mt-4">
                <Button type="button" onClick={() => setActiveTab("education")}>Back</Button>
                <Button type="button" onClick={() => setActiveTab("bio")}>Next</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="bio">
            <div className="space-y-4">
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleInputChange}
                placeholder="Enter your bio (max 500 characters)"
                maxLength={500}
                className="w-full min-h-[120px] rounded-md border border-gray-300 bg-slate-900 text-white p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <div className="flex justify-between gap-4 mt-4">
                <Button type="button" onClick={() => setActiveTab("projects")}>Back</Button>
                <Button type="button" onClick={handleSubmit} disabled={saveLoading}>{saveLoading ? "Saving..." : "Submit"}</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileSetup;
