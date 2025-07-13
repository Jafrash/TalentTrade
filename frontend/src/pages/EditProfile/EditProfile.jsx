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
      <div className="min-h-screen bg-[#013e38] flex items-center justify-center">
        <div className="text-white text-xl">Loading profile data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#013e38] flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-4xl mb-4">
        <Button 
          variant="outline" 
          onClick={() => navigate("/profile/me")}
          className="text-white border-white hover:bg-white hover:text-[#013e38]"
        >
          ← Back to Profile
        </Button>
      </div>
      <Card className="w-full max-w-4xl mb-8">
        <CardHeader>
          <CardTitle className="text-3xl text-[#3bb4a1] text-center">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="w-full flex justify-between">
              <TabsTrigger value="registration">Registration</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="bio">Bio</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            {/* Registration Tab */}
            <TabsContent value="registration">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={form.name} onChange={handleInputChange} placeholder="Enter your full name" className="mb-4" />
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" value={form.email} onChange={handleInputChange} placeholder="Enter your email" className="mb-4" />
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" value={form.username} onChange={handleInputChange} placeholder="Enter your username" className="mb-4" />
                  <Label htmlFor="linkedinLink">Linkedin Link</Label>
                  <Input id="linkedinLink" name="linkedinLink" value={form.linkedinLink} onChange={handleInputChange} placeholder="Enter your Linkedin link" className="mb-4" />
                  <Label htmlFor="githubLink">Github Link</Label>
                  <Input id="githubLink" name="githubLink" value={form.githubLink} onChange={handleInputChange} placeholder="Enter your Github link" className="mb-4" />
                  <Label htmlFor="portfolioLink">Portfolio Link</Label>
                  <Input id="portfolioLink" name="portfolioLink" value={form.portfolioLink} onChange={handleInputChange} placeholder="Enter your portfolio link" className="mb-4" />
                </div>
                <div>
                  <Label>Skills Proficient At</Label>
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
                  <div className="flex flex-wrap gap-2 mb-4">
                    {form.skillsProficientAt.map((skill, idx) => (
                      <Badge key={idx} className="cursor-pointer" onClick={() => handleRemoveSkill(skill, "skillsProficientAt")}>{skill} &times;</Badge>
                    ))}
                  </div>
                  <Label>Skills To Learn</Label>
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
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button type="button" onClick={() => setActiveTab("education")}>Next</Button>
              </div>
            </TabsContent>
            {/* Education Tab */}
            <TabsContent value="education">
              <div className="space-y-4">
                {form.education.map((edu, idx) => (
                  <Card key={edu.id} className="p-4 mb-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Institution</Label>
                        <Input name="institution" value={edu.institution} onChange={e => handleEducationChange(e, idx)} placeholder="Institution name" className="mb-2" />
                        <Label>Degree</Label>
                        <Input name="degree" value={edu.degree} onChange={e => handleEducationChange(e, idx)} placeholder="Degree" className="mb-2" />
                        <Label>Score</Label>
                        <Input name="score" value={edu.score} onChange={e => handleEducationChange(e, idx)} placeholder="Grade/Percentage" className="mb-2" />
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <Input name="startDate" type="date" value={edu.startDate} onChange={e => handleEducationChange(e, idx)} className="mb-2" />
                        <Label>End Date</Label>
                        <Input name="endDate" type="date" value={edu.endDate} onChange={e => handleEducationChange(e, idx)} className="mb-2" />
                        <Label>Description</Label>
                        <Input name="description" value={edu.description} onChange={e => handleEducationChange(e, idx)} placeholder="Description" className="mb-2" />
                      </div>
                    </div>
                    {form.education.length > 1 && (
                      <Button type="button" variant="destructive" onClick={() => handleRemoveEducation(edu.id)} className="mt-2">Remove</Button>
                    )}
                  </Card>
                ))}
                <Button type="button" onClick={handleAddEducation}>Add Education</Button>
                <div className="flex justify-between gap-4 mt-4">
                  <Button type="button" onClick={() => setActiveTab("registration")}>Back</Button>
                  <Button type="button" onClick={() => setActiveTab("projects")}>Next</Button>
                </div>
              </div>
            </TabsContent>
            {/* Projects Tab */}
            <TabsContent value="projects">
              <div className="space-y-4">
                {form.projects.map((project, idx) => (
                  <Card key={project.id} className="p-4 mb-2">
                    <Label>Title</Label>
                    <Input name="title" value={project.title} onChange={e => handleProjectChange(e, idx)} placeholder="Project title" className="mb-2" />
                    <Label>Tech Stack</Label>
                    <div className="flex gap-2 mb-2">
                      <Input value={techStack[idx] || ""} onChange={e => setTechStack(prev => prev.map((item, i) => i === idx ? e.target.value : item))} placeholder="Add tech stack" />
                      <Button type="button" onClick={() => handleAddTechStack(idx, techStack[idx])}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.techStack && project.techStack.map((skill, i) => (
                        <Badge key={i} className="cursor-pointer" onClick={() => handleRemoveTechStack(idx, skill)}>{skill} &times;</Badge>
                      ))}
                    </div>
                    <Label>Start Date</Label>
                    <Input name="startDate" type="date" value={project.startDate} onChange={e => handleProjectChange(e, idx)} className="mb-2" />
                    <Label>End Date</Label>
                    <Input name="endDate" type="date" value={project.endDate} onChange={e => handleProjectChange(e, idx)} className="mb-2" />
                    <Label>Project Link</Label>
                    <Input name="projectLink" value={project.projectLink} onChange={e => handleProjectChange(e, idx)} placeholder="Project link" className="mb-2" />
                    <Label>Description</Label>
                    <Input name="description" value={project.description} onChange={e => handleProjectChange(e, idx)} placeholder="Description" className="mb-2" />
                    <Button type="button" variant="destructive" onClick={() => handleRemoveProject(project.id)} className="mt-2">Remove</Button>
                  </Card>
                ))}
                <Button type="button" onClick={handleAddProject}>Add Project</Button>
                <div className="flex justify-between gap-4 mt-4">
                  <Button type="button" onClick={() => setActiveTab("education")}>Back</Button>
                  <Button type="button" onClick={() => setActiveTab("bio")}>Next</Button>
                </div>
              </div>
            </TabsContent>
            {/* Bio Tab */}
            <TabsContent value="bio">
              <div className="space-y-4">
                <Label>Bio</Label>
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
                  <Button type="button" onClick={() => setActiveTab("preview")}>Preview</Button>
                </div>
              </div>
            </TabsContent>
            {/* Preview Tab */}
            <TabsContent value="preview">
              <Card className="p-6">
                <CardTitle className="mb-4 text-2xl">Profile Preview</CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-2"><span className="font-bold text-[#3bb4a1]">Name:</span> {form.name}</div>
                    <div className="mb-2"><span className="font-bold text-[#3bb4a1]">Email:</span> {form.email}</div>
                    <div className="mb-2"><span className="font-bold text-[#3bb4a1]">Username:</span> {form.username}</div>
                    <div className="mb-2"><span className="font-bold text-[#3bb4a1]">LinkedIn:</span> {form.linkedinLink}</div>
                    <div className="mb-2"><span className="font-bold text-[#3bb4a1]">GitHub:</span> {form.githubLink}</div>
                    <div className="mb-2"><span className="font-bold text-[#3bb4a1]">Portfolio:</span> {form.portfolioLink}</div>
                    <div className="mb-2"><span className="font-bold text-[#3bb4a1]">Skills Proficient At:</span> {form.skillsProficientAt.map((skill, idx) => <Badge key={idx} className="mx-1">{skill}</Badge>)}</div>
                    <div className="mb-2"><span className="font-bold text-[#3bb4a1]">Skills To Learn:</span> {form.skillsToLearn.map((skill, idx) => <Badge key={idx} className="mx-1">{skill}</Badge>)}</div>
                  </div>
                  <div>
                    <div className="mb-2"><span className="font-bold text-[#3bb4a1]">Bio:</span> {form.bio}</div>
                    <div className="mb-2"><span className="font-bold text-[#3bb4a1]">Education:</span>
                      {form.education.map((edu, idx) => (
                        <div key={idx} className="ml-2 mb-1">
                          <span className="font-semibold">{edu.institution}</span> - {edu.degree} ({edu.startDate} to {edu.endDate})<br />
                          <span className="text-sm">Score: {edu.score}</span><br />
                          <span className="text-sm">{edu.description}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mb-2"><span className="font-bold text-[#3bb4a1]">Projects:</span>
                      {form.projects.map((project, idx) => (
                        <div key={idx} className="ml-2 mb-1">
                          <span className="font-semibold">{project.title}</span> ({project.startDate} to {project.endDate})<br />
                          <span className="text-sm">Tech Stack: {project.techStack.join(", ")}</span><br />
                          <span className="text-sm">{project.description}</span><br />
                          <span className="text-sm">Link: {project.projectLink}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button type="button" onClick={() => setActiveTab("bio")}>Back</Button>
                  <Button className="ml-4" type="button" onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfile;
