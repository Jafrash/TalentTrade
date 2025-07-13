import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { skills } from "./Skills";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "../../util/userContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  Eye, 
  Plus, 
  X, 
  Save,
  ArrowLeft,
  ExternalLink,
  Github,
  Linkedin
} from "lucide-react";

const EditProfile = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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

  // Load current user's profile data
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        console.log('Loading profile data for user:', user);
        const response = await axios.get(`http://localhost:8000/user/registered/getDetails`, {
          withCredentials: true
        });
        
        console.log('Profile data loaded:', response.data);
        const profileData = response.data.data;
        
        // Populate form with existing data
        setForm({
          name: profileData?.name || "",
          email: profileData?.email || "",
          username: profileData?.username || "",
          portfolioLink: profileData?.portfolioLink || "",
          githubLink: profileData?.githubLink || "",
          linkedinLink: profileData?.linkedinLink || "",
          skillsProficientAt: profileData?.skillsProficientAt || [],
          skillsToLearn: profileData?.skillsToLearn || [],
          education: profileData?.education?.length > 0 ? profileData.education.map(edu => ({
            id: uuidv4(),
            ...edu
          })) : [{
            id: uuidv4(),
            institution: "",
            degree: "",
            startDate: "",
            endDate: "",
            score: "",
            description: "",
          }],
          bio: profileData?.bio || "",
          projects: profileData?.projects?.length > 0 ? profileData.projects.map(proj => ({
            id: uuidv4(),
            ...proj
          })) : [],
        });
      } catch (error) {
        console.error('Error loading profile data:', error);
        toast.error('Failed to load profile data');
        if (error?.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user, navigate]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (type) => {
    if (type === "toLearn") {
      if (!skillsToLearn || form.skillsToLearn.includes(skillsToLearn) || form.skillsProficientAt.includes(skillsToLearn)) return;
      setForm((prev) => ({ ...prev, skillsToLearn: [...prev.skillsToLearn, skillsToLearn] }));
      setSkillsToLearn("");
    } else {
      if (!skillsProficientAt || form.skillsProficientAt.includes(skillsProficientAt) || form.skillsToLearn.includes(skillsProficientAt)) return;
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

  // Save function
  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Save registration details (skills and links)
      await axios.post('/user/registered/saveRegDetails', {
        linkedinLink: form.linkedinLink,
        githubLink: form.githubLink,
        portfolioLink: form.portfolioLink,
        skillsProficientAt: form.skillsProficientAt,
        skillsToLearn: form.skillsToLearn
      }, { withCredentials: true });

      // Save education details
      await axios.post('/user/registered/saveEduDetail', {
        education: form.education
      }, { withCredentials: true });

      // Save bio and projects
      await axios.post('/user/registered/saveAddDetail', {
        bio: form.bio,
        projects: form.projects
      }, { withCredentials: true });

      toast.success("Profile updated successfully!");
      navigate("/profile/me");
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // --- UI ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/profile/me")}
            className="bg-white/80 backdrop-blur-sm border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Edit Profile</h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-gray-800 text-center">
              Update Your Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="registration" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Basic Info</span>
                </TabsTrigger>
                <TabsTrigger value="education" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <GraduationCap className="h-4 w-4" />
                  <span className="hidden sm:inline">Education</span>
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Projects</span>
                </TabsTrigger>
                <TabsTrigger value="bio" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Bio</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Preview</span>
                </TabsTrigger>
              </TabsList>

              {/* Registration Tab */}
              <TabsContent value="registration" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <User className="h-5 w-5 text-emerald-600" />
                      Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={form.name} 
                          onChange={handleInputChange} 
                          placeholder="Enter your full name" 
                          className="mt-1 bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          value={form.email} 
                          onChange={handleInputChange} 
                          placeholder="Enter your email" 
                          className="mt-1 bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
                        <Input 
                          id="username" 
                          name="username" 
                          value={form.username} 
                          onChange={handleInputChange} 
                          placeholder="Enter your username" 
                          className="mt-1 bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <ExternalLink className="h-5 w-5 text-emerald-600" />
                      Social Links
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="linkedinLink" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Linkedin className="h-4 w-4 text-blue-600" />
                          LinkedIn
                        </Label>
                        <Input 
                          id="linkedinLink" 
                          name="linkedinLink" 
                          value={form.linkedinLink} 
                          onChange={handleInputChange} 
                          placeholder="https://linkedin.com/in/yourprofile" 
                          className="mt-1 bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="githubLink" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Github className="h-4 w-4 text-gray-800" />
                          GitHub
                        </Label>
                        <Input 
                          id="githubLink" 
                          name="githubLink" 
                          value={form.githubLink} 
                          onChange={handleInputChange} 
                          placeholder="https://github.com/yourusername" 
                          className="mt-1 bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="portfolioLink" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-emerald-600" />
                          Portfolio
                        </Label>
                        <Input 
                          id="portfolioLink" 
                          name="portfolioLink" 
                          value={form.portfolioLink} 
                          onChange={handleInputChange} 
                          placeholder="https://yourportfolio.com" 
                          className="mt-1 bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Skills Proficient At */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">Skills Proficient At</Label>
                      <div className="flex gap-2">
                        <select
                          value={skillsProficientAt}
                          onChange={e => setSkillsProficientAt(e.target.value)}
                          className="flex-1 rounded-md border border-gray-300 bg-gray-50 text-gray-900 p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="">Select a skill</option>
                          {skills.map((skill, idx) => (
                            <option key={idx} value={skill}>{skill}</option>
                          ))}
                        </select>
                        <Button 
                          type="button" 
                          onClick={() => handleAddSkill("proficient")}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form.skillsProficientAt.map((skill, index) => (
                          <Badge 
                            key={index} 
                            className="bg-emerald-100 text-emerald-800 border-emerald-200 px-3 py-1"
                          >
                            {skill}
                            <button
                              onClick={() => handleRemoveSkill(skill, "skillsProficientAt")}
                              className="ml-2 hover:text-emerald-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Skills To Learn */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">Skills To Learn</Label>
                      <div className="flex gap-2">
                        <select
                          value={skillsToLearn}
                          onChange={e => setSkillsToLearn(e.target.value)}
                          className="flex-1 rounded-md border border-gray-300 bg-gray-50 text-gray-900 p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="">Select a skill</option>
                          {skills.map((skill, idx) => (
                            <option key={idx} value={skill}>{skill}</option>
                          ))}
                        </select>
                        <Button 
                          type="button" 
                          onClick={() => handleAddSkill("toLearn")}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form.skillsToLearn.map((skill, index) => (
                          <Badge 
                            key={index} 
                            className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1"
                          >
                            {skill}
                            <button
                              onClick={() => handleRemoveSkill(skill, "skillsToLearn")}
                              className="ml-2 hover:text-blue-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between gap-4 pt-4">
                  <div></div>
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab("education")}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    Next: Education
                  </Button>
                </div>
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education" className="space-y-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-emerald-600" />
                    Education Details
                  </h3>
                  {form.education.map((edu, idx) => (
                    <Card key={edu.id} className="bg-gray-50 border-gray-200">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Institution</Label>
                            <Input 
                              name="institution" 
                              value={edu.institution} 
                              onChange={e => handleEducationChange(e, idx)} 
                              placeholder="University/College name" 
                              className="mt-1 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500" 
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Degree</Label>
                            <Input 
                              name="degree" 
                              value={edu.degree} 
                              onChange={e => handleEducationChange(e, idx)} 
                              placeholder="e.g., Bachelor of Science" 
                              className="mt-1 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500" 
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Start Date</Label>
                            <Input 
                              name="startDate" 
                              type="date" 
                              value={edu.startDate} 
                              onChange={e => handleEducationChange(e, idx)} 
                              className="mt-1 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500" 
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">End Date</Label>
                            <Input 
                              name="endDate" 
                              type="date" 
                              value={edu.endDate} 
                              onChange={e => handleEducationChange(e, idx)} 
                              className="mt-1 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500" 
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Score/GPA</Label>
                            <Input 
                              name="score" 
                              value={edu.score} 
                              onChange={e => handleEducationChange(e, idx)} 
                              placeholder="e.g., 3.8 GPA" 
                              className="mt-1 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500" 
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label className="text-sm font-medium text-gray-700">Description</Label>
                            <textarea
                              name="description" 
                              value={edu.description} 
                              onChange={e => handleEducationChange(e, idx)} 
                              placeholder="Brief description of your studies" 
                              className="mt-1 w-full rounded-md border border-gray-300 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              rows="3"
                            />
                          </div>
                        </div>
                        {form.education.length > 1 && (
                          <Button 
                            type="button" 
                            variant="destructive" 
                            onClick={() => handleRemoveEducation(edu.id)} 
                            className="mt-4"
                          >
                            Remove Education
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  <Button type="button" onClick={handleAddEducation} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </div>

                <div className="flex justify-between gap-4 pt-4">
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab("registration")}
                    variant="outline"
                  >
                    Back: Basic Info
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab("projects")}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    Next: Projects
                  </Button>
                </div>
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-emerald-600" />
                    Project Details
                  </h3>
                  {form.projects.map((project, idx) => (
                    <Card key={project.id} className="bg-gray-50 border-gray-200">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Project Title</Label>
                            <Input 
                              name="title" 
                              value={project.title} 
                              onChange={e => handleProjectChange(e, idx)} 
                              placeholder="Project name" 
                              className="mt-1 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500" 
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Project Link</Label>
                            <Input 
                              name="projectLink" 
                              value={project.projectLink} 
                              onChange={e => handleProjectChange(e, idx)} 
                              placeholder="https://project-link.com" 
                              className="mt-1 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500" 
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Start Date</Label>
                            <Input 
                              name="startDate" 
                              type="date" 
                              value={project.startDate} 
                              onChange={e => handleProjectChange(e, idx)} 
                              className="mt-1 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500" 
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">End Date</Label>
                            <Input 
                              name="endDate" 
                              type="date" 
                              value={project.endDate} 
                              onChange={e => handleProjectChange(e, idx)} 
                              className="mt-1 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500" 
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label className="text-sm font-medium text-gray-700">Description</Label>
                            <textarea
                              name="description" 
                              value={project.description} 
                              onChange={e => handleProjectChange(e, idx)} 
                              placeholder="Describe your project" 
                              className="mt-1 w-full rounded-md border border-gray-300 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              rows="3"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label className="text-sm font-medium text-gray-700">Tech Stack</Label>
                            <div className="flex gap-2 mt-1">
                              <Input 
                                value={techStack[idx] || ""} 
                                onChange={e => setTechStack(prev => prev.map((item, i) => i === idx ? e.target.value : item))} 
                                placeholder="Add technology" 
                                className="bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500" 
                              />
                              <Button 
                                type="button" 
                                onClick={() => handleAddTechStack(idx, techStack[idx])}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {project.techStack.map((tech, techIdx) => (
                                <Badge 
                                  key={techIdx} 
                                  className="bg-emerald-100 text-emerald-800 border-emerald-200 px-3 py-1"
                                >
                                  {tech}
                                  <button
                                    onClick={() => handleRemoveTechStack(idx, tech)}
                                    className="ml-2 hover:text-emerald-600"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button 
                          type="button" 
                          variant="destructive" 
                          onClick={() => handleRemoveProject(project.id)} 
                          className="mt-4"
                        >
                          Remove Project
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  <Button type="button" onClick={handleAddProject} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </div>

                <div className="flex justify-between gap-4 pt-4">
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab("education")}
                    variant="outline"
                  >
                    Back: Education
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab("bio")}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    Next: Bio
                  </Button>
                </div>
              </TabsContent>

              {/* Bio Tab */}
              <TabsContent value="bio" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    About Me
                  </h3>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Bio</Label>
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                      maxLength={500}
                      className="mt-1 w-full min-h-[200px] rounded-md border border-gray-300 bg-gray-50 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      {form.bio.length}/500 characters
                    </p>
                  </div>
                </div>

                <div className="flex justify-between gap-4 pt-4">
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab("projects")}
                    variant="outline"
                  >
                    Back: Projects
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab("preview")}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    Preview Profile
                  </Button>
                </div>
              </TabsContent>

              {/* Preview Tab */}
              <TabsContent value="preview" className="space-y-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-emerald-600" />
                    Profile Preview
                  </h3>
                  <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <span className="font-bold text-emerald-600">Name:</span> {form.name}
                        </div>
                        <div>
                          <span className="font-bold text-emerald-600">Email:</span> {form.email}
                        </div>
                        <div>
                          <span className="font-bold text-emerald-600">Username:</span> {form.username}
                        </div>
                        <div>
                          <span className="font-bold text-emerald-600">Bio:</span> {form.bio}
                        </div>
                        <div>
                          <span className="font-bold text-emerald-600">Skills Proficient At:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {form.skillsProficientAt.map((skill, idx) => (
                              <Badge key={idx} className="bg-emerald-100 text-emerald-800">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-bold text-emerald-600">Skills To Learn:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {form.skillsToLearn.map((skill, idx) => (
                              <Badge key={idx} className="bg-blue-100 text-blue-800">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-bold text-emerald-600">Education:</span>
                          {form.education.map((edu, idx) => (
                            <div key={idx} className="ml-4 mt-2 p-3 bg-white rounded-lg">
                              <div className="font-semibold">{edu.institution}</div>
                              <div className="text-sm text-gray-600">{edu.degree}</div>
                              <div className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</div>
                              {edu.score && <div className="text-sm text-gray-500">Score: {edu.score}</div>}
                              {edu.description && <div className="text-sm mt-1">{edu.description}</div>}
                            </div>
                          ))}
                        </div>
                        <div>
                          <span className="font-bold text-emerald-600">Projects:</span>
                          {form.projects.map((project, idx) => (
                            <div key={idx} className="ml-4 mt-2 p-3 bg-white rounded-lg">
                              <div className="font-semibold">{project.title}</div>
                              <div className="text-sm text-gray-600">{project.startDate} - {project.endDate}</div>
                              {project.techStack.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {project.techStack.map((tech, techIdx) => (
                                    <Badge key={techIdx} className="bg-gray-100 text-gray-800 text-xs">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              {project.description && <div className="text-sm mt-1">{project.description}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-between gap-4 pt-4">
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab("bio")}
                    variant="outline"
                  >
                    Back: Bio
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleSave} 
                    disabled={loading}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
