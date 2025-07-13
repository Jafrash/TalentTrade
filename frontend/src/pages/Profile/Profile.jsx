import React, { useEffect, useState, Fragment } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUser } from "../../util/userContext";
import { toast } from "react-toastify";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, ExternalLink, Edit, Star, AlertTriangle, ThumbsUp } from "lucide-react";
import Box from "./Box";

const Profile = () => {
  const { user, setUser } = useUser();
  const [profileUser, setProfileUser] = useState(null);
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [connectLoading, setConnectLoading] = useState(false);
  const [userContextLoading, setUserContextLoading] = useState(true);
  const navigate = useNavigate();

  // Handle user context loading
  useEffect(() => {
    // Set a small delay to allow user context to initialize
    const timer = setTimeout(() => {
      setUserContextLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Don't fetch data if user context is still loading
    if (userContextLoading) return;

    // Debug logging
    console.log('Profile component - user context:', user);
    console.log('Profile component - username param:', username);
    console.log('Profile component - userContextLoading:', userContextLoading);

    // If viewing own profile but user is not authenticated, redirect to login
    if (username === "me" && !user) {
      navigate("/login");
      return;
    }

    const getUser = async () => {
      setLoading(true);
      try {
        let response;
        if (username === "me") {
          // Get current user's own profile details
          response = await axios.get(`http://localhost:8000/user/registered/getDetails`, {
            withCredentials: true
          });
        } else {
          // Get another user's profile details
          response = await axios.get(`http://localhost:8000/user/registered/getDetails/${username}`, {
            withCredentials: true
          });
        }
        console.log('Profile response:', response.data);
        console.log('Profile user data:', response.data.data);
        console.log('Education from response:', response.data.data?.education);
        console.log('Bio from response:', response.data.data?.bio);
        console.log('Has profile:', !!response.data.data?.profile);
        console.log('Profile object:', response.data.data?.profile);
        setProfileUser(response.data.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error?.response?.status === 401 || error?.response?.data?.message === "Please Login") {
          // Only clear user state and redirect for auth errors
          localStorage.removeItem("userInfo");
          setUser(null);
          navigate("/login");
        } else {
          // For other errors, just show toast and keep user logged in
          toast.error(error.response?.data?.message || 'Failed to fetch profile');
        }
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [username, user, setUser, navigate, userContextLoading]);

  // Handle errors gracefully
  const handleError = (error) => {
    console.error('Profile error:', error);
    if (error?.response?.status === 401) {
      localStorage.removeItem("userInfo");
      setUser(null);
      navigate("/login");
    } else {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  const convertDate = (dateTimeString) => {
    if (!dateTimeString) return "Present";
    return new Date(dateTimeString).getFullYear();
  };

  const connectHandler = async () => {
    setConnectLoading(true);
    try {
      const response = await axios.post(`/user/registered/connect/${profileUser.username}`, {}, {
        withCredentials: true
      });
      toast.success(response.data.message);
      // Refresh profile data
      window.location.reload();
    } catch (error) {
      handleError(error);
    } finally {
      setConnectLoading(false);
    }
  };

  // Get initial letter for Avatar fallback
  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  if (loading || userContextLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-[50vh]">
            <Card className="p-8 text-center">
              <p className="text-gray-500 text-lg">User profile not found</p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-8">
      <div className="container mx-auto px-4">
        <div className="space-y-8">
          {/* Profile Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-col items-center text-center pb-6">
                  <div className="relative">
                    <Avatar className="h-40 w-40 border-4 border-emerald-200 shadow-xl">
                      <AvatarImage src={profileUser?.picture} alt="Profile" />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-3xl font-bold">
                        {getInitials(profileUser?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-2 shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-800 mt-6 mb-2">
                    {profileUser?.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
                    <div className="flex">
                      {profileUser?.rating ? 
                        Array.from({ length: profileUser.rating }, (_, index) => 
                          <Star key={index} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ) : 
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      }
                    </div>
                    <span className="text-lg font-semibold text-yellow-700">
                      {profileUser?.rating || "5.0"}
                    </span>
                  </div>
                </CardHeader>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 w-full px-6 pb-6">
                  {/* Connect and Report Buttons */}
                  {user && user.username !== username && (
                    <div className="flex gap-3">
                      <Button
                        onClick={profileUser?.status === "Connect" ? connectHandler : undefined}
                        disabled={connectLoading}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-md"
                      >
                        {connectLoading ? (
                          <>
                            <span className="loading-spinner mr-2"></span>
                            Loading...
                          </>
                        ) : (
                          profileUser?.status
                        )}
                      </Button>
                      <Link to={`/report/${profileUser.username}`}>
                        <Button variant="destructive" className="shadow-md">
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to={`/rating/${profileUser.username}`}>
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-md">
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Edit Button */}
                  {user && (username === "me" || user.username === username) && (
                    <Link to="/edit-profile" state={{ userId: user._id, isEditing: true }}>
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-medium shadow-md">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            </div>

            {/* Portfolio Links */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-emerald-600" />
                    Portfolio Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {profileUser?.githubLink && (
                      <a
                        href={profileUser.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
                      >
                        <Github className="h-6 w-6 text-gray-800" />
                        <span className="font-medium text-gray-800">GitHub</span>
                      </a>
                    )}
                    {profileUser?.linkedinLink && (
                      <a
                        href={profileUser.linkedinLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 border border-blue-200"
                      >
                        <Linkedin className="h-6 w-6 text-blue-600" />
                        <span className="font-medium text-blue-800">LinkedIn</span>
                      </a>
                    )}
                    {profileUser?.portfolioLink && (
                      <a
                        href={profileUser.portfolioLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors duration-200 border border-emerald-200"
                      >
                        <ExternalLink className="h-6 w-6 text-emerald-600" />
                        <span className="font-medium text-emerald-800">Portfolio</span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Bio */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {profileUser?.bio || "No bio available"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Skills Proficient At
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {profileUser?.skillsProficientAt?.length > 0 ? (
                    profileUser.skillsProficientAt.map((skill, index) => (
                      <Badge 
                        key={index} 
                        className="bg-emerald-100 text-emerald-800 border-emerald-200 px-4 py-2 text-sm font-medium hover:bg-emerald-200 transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <div className="text-center w-full py-8">
                      <p className="text-gray-500 text-lg">No skills listed</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profileUser?.education?.length > 0 ? (
                  <div className="space-y-6">
                    {profileUser.education.map((edu, index) => (
                      <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                        <Box
                          head={edu?.institution}
                          date={convertDate(edu?.startDate) + " - " + convertDate(edu?.endDate)}
                          spec={edu?.degree}
                          desc={edu?.description}
                          score={edu?.score}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">No education details available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Projects */}
            {profileUser?.projects && profileUser?.projects.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {profileUser.projects.map((project, index) => (
                      <div key={index} className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-200">
                        <Box
                          head={project?.title}
                          date={convertDate(project?.startDate) + " - " + convertDate(project?.endDate)}
                          desc={project?.description}
                          skills={project?.techStack}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;