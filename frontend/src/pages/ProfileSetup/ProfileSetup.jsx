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
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [autoSaving, setAutoSaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("registration");
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

    // If editing, load existing profile data
    if (location.state?.isEditing) {
      loadExistingProfile();
    }
  }, [location.state, navigate]);

  const loadExistingProfile = async () => {
    try {
      const response = await axios.get('/user/registered/getDetails', { withCredentials: true });
      const userData = response.data.data;
      
      // Populate form with existing data
      setForm(prev => ({
        ...prev,
        name: userData.name || "",
        email: userData.email || "",
        username: userData.username || "",
        linkedinLink: userData.linkedinLink || "",
        githubLink: userData.githubLink || "",
        portfolioLink: userData.portfolioLink || "",
        skillsProficientAt: userData.skillsProficientAt || [],
        skillsToLearn: userData.skillsToLearn || [],
        education: userData.education && userData.education.length > 0 ? userData.education.map(edu => ({
          id: uuidv4(),
          institution: edu.institution || "",
          degree: edu.degree || "",
          startDate: edu.startDate || "",
          endDate: edu.endDate || "",
          score: edu.score || "",
          description: edu.description || ""
        })) : [{
          id: uuidv4(),
          institution: "",
          degree: "",
          startDate: "",
          endDate: "",
          score: "",
          description: "",
        }],
        bio: userData.bio || "",
        projects: userData.projects && userData.projects.length > 0 ? userData.projects.map(project => ({
          id: uuidv4(),
          title: project.title || "",
          techStack: project.techStack || [],
          startDate: project.startDate || "",
          endDate: project.endDate || "",
          projectLink: project.projectLink || "",
          description: project.description || ""
        })) : []
      }));
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load existing profile data');
    }
  };

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
    console.log('Validating form data:', form);
    
    // Basic validation - only require essential fields
    if (!form.name || !form.email || !form.username) {
      toast.error("Please fill in your name, email, and username");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Validate bio length if provided
    if (form.bio && form.bio.length > 500) {
      toast.error("Bio should be less than 500 characters");
      return false;
    }

    // Validate education entries if provided
    for (let edu of form.education) {
      if (edu.institution && edu.degree) {
        // If institution and degree are provided, validate dates
        if (edu.startDate && edu.endDate && new Date(edu.startDate) > new Date(edu.endDate)) {
          toast.error("Start date cannot be after end date");
      return false;
    }
      }
    }

    // Validate project entries if provided
    for (let project of form.projects) {
      if (project.title) {
        // If project title is provided, validate dates
        if (project.startDate && project.endDate && new Date(project.startDate) > new Date(project.endDate)) {
          toast.error("Project start date cannot be after end date");
        return false;
      }
        
        // Validate project link format if provided
        if (project.projectLink && !project.projectLink.match(/^(http|https):\/\/[^ "']+$/)) {
        toast.error("Please provide valid project link");
        return false;
      }
    }
    }

    console.log('Form validation passed');
    return true;
  };

  // --- Submit ---
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSaveLoading(true);
    
    try {
      console.log('Starting profile save process...');
      console.log('Form data to save:', form);

      // Save registration details (skills and links)
      console.log('Saving registration details...');
      const regResponse = await axios.post('/user/registered/saveRegDetails', {
        linkedinLink: form.linkedinLink || "",
        githubLink: form.githubLink || "",
        portfolioLink: form.portfolioLink || "",
        skillsProficientAt: form.skillsProficientAt || [],
        skillsToLearn: form.skillsToLearn || []
      }, { withCredentials: true });
      console.log('Registration details saved:', regResponse.data);

      // Save education details
      console.log('Saving education details...');
      console.log('Education data:', form.education);
      const eduResponse = await axios.post('/user/registered/saveEduDetail', {
        education: form.education.filter(edu => edu.institution && edu.degree) // Only save valid education entries
      }, { withCredentials: true });
      console.log('Education details saved:', eduResponse.data);

      // Save bio and projects
      console.log('Saving bio and projects...');
      console.log('Bio data:', form.bio);
      console.log('Projects data:', form.projects);
      const bioResponse = await axios.post('/user/registered/saveAddDetail', {
        bio: form.bio || "",
        projects: form.projects.filter(project => project.title) // Only save valid project entries
      }, { withCredentials: true });
      console.log('Bio and projects saved:', bioResponse.data);

      toast.success("Profile completed successfully!");
      console.log('Profile save completed successfully');
      navigate("/discover");
    } catch (error) {
      console.error('Error saving profile:', error);
      console.error('Error response:', error.response?.data);
      
      // Provide more specific error messages
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
        navigate("/login");
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || "Invalid data provided");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(error?.response?.data?.message || "Failed to complete profile. Please try again.");
      }
    } finally {
      setSaveLoading(false);
    }
  };

  // Auto-save function to save data as user progresses
  const autoSave = async (section) => {
    try {
      setAutoSaving(true);
      console.log(`Auto-saving ${section} data...`);
      
      switch (section) {
        case 'registration':
          await axios.post('/user/registered/saveRegDetails', {
            linkedinLink: form.linkedinLink || "",
            githubLink: form.githubLink || "",
            portfolioLink: form.portfolioLink || "",
            skillsProficientAt: form.skillsProficientAt || [],
            skillsToLearn: form.skillsToLearn || []
          }, { withCredentials: true });
          break;
          
        case 'education':
          await axios.post('/user/registered/saveEduDetail', {
            education: form.education.filter(edu => edu.institution && edu.degree)
          }, { withCredentials: true });
          break;
          
        case 'projects':
          await axios.post('/user/registered/saveAddDetail', {
            bio: form.bio || "",
            projects: form.projects.filter(project => project.title)
          }, { withCredentials: true });
          break;
          
        case 'bio':
          await axios.post('/user/registered/saveAddDetail', {
            bio: form.bio || "",
            projects: form.projects.filter(project => project.title)
          }, { withCredentials: true });
          break;
      }
      
      console.log(`${section} data auto-saved successfully`);
    } catch (error) {
      console.error(`Error auto-saving ${section} data:`, error);
      // Don't show error toast for auto-save to avoid interrupting user flow
    } finally {
      setAutoSaving(false);
    }
  };

  // Enhanced tab change handler with auto-save
  const handleTabChange = (newTab) => {
    // Auto-save current tab data before switching
    if (activeTab === 'registration') {
      autoSave('registration');
    } else if (activeTab === 'education') {
      autoSave('education');
    } else if (activeTab === 'projects') {
      autoSave('projects');
    } else if (activeTab === 'bio') {
      autoSave('bio');
    }
    
    setActiveTab(newTab);
  };

  // --- UI ---
  return (
    <div className="min-h-screen bg-[#2D2D2D] p-4 md:p-8">
      <h1 className="text-4xl md:text-5xl font-bold text-[#3BB4A1] text-center mb-8">Complete Your Profile</h1>
      
      {/* Auto-save indicator */}
      {autoSaving && (
        <div className="fixed top-4 right-4 bg-[#3BB4A1] text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          <span className="text-sm">Auto-saving...</span>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
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
                <Button type="button" onClick={() => handleTabChange("education")}>Next</Button>
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
                <Button type="button" onClick={() => handleTabChange("registration")}>Back</Button>
                <Button type="button" onClick={() => handleTabChange("projects")}>Next</Button>
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
                <Button type="button" onClick={() => handleTabChange("education")}>Back</Button>
                <Button type="button" onClick={() => handleTabChange("bio")}>Next</Button>
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
                <Button type="button" onClick={() => handleTabChange("projects")}>Back</Button>
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
