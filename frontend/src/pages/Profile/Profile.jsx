import React, { useEffect, useState } from "react";
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
    console.error('Error:', error);
    toast.error('Failed to load profile. Please try again.');
    setLoading(false);
    // Don't clear user state or redirect to login unless it's a specific auth error
    if (error?.response?.status === 401 || error?.response?.data?.message === "Please Login") {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    }
  };

  const convertDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString("en-US", { month: "2-digit", year: "numeric" }).replace("/", "-");
    return formattedDate;
  };

  const connectHandler = async () => {
    console.log("Connect");
    try {
      setConnectLoading(true);
      const { data } = await axios.post(`/request/create`, {
        receiverID: profileUser._id,
      }, { withCredentials: true });

      console.log(data);
      toast.success(data.message);
      setProfileUser((prevState) => {
        return {
          ...prevState,
          status: "Pending",
        };
      });
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
        if (error.response.data.message === "Please Login") {
          localStorage.removeItem("userInfo");
          setUser(null);
          await axios.get("/auth/logout");
          navigate("/login");
        }
      }
    } finally {
      setConnectLoading(false);
    }
  };

  // Get initial letter for Avatar fallback
  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="container mx-auto py-8">
      {loading || userContextLoading ? (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      ) : !profileUser ? (
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-gray-500">User profile not found</p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Info */}
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader className="flex flex-col items-center">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profileUser?.picture} alt="Profile" />
                    <AvatarFallback>{profileUser?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-2xl mt-4">{profileUser?.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{profileUser?.rating ? Array.from({ length: profileUser.rating }, (_, index) => <Star key={index} className="h-4 w-4 fill-yellow-400 text-yellow-400" />) : <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}</span>
                    <span className="text-lg">{profileUser?.rating || "5"}</span>
                  </div>
                </CardHeader>
              </Card>

              {/* Connect and Report Buttons */}
              {user && user.username !== username && (
                <div className="flex gap-4">
                  <Button
                    onClick={profileUser?.status === "Connect" ? connectHandler : undefined}
                    disabled={connectLoading}
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
                    <Button variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to={`/rating/${profileUser.username}`}>
                    <Button variant="success">
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}

              {/* Edit Button */}
              {user && user.username === username && (
                <Link to="/profile-setup" state={{ userId: user._id, isEditing: true }}>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              )}
            </div>

            {/* Portfolio Links */}
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Links</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                  {profileUser?.githubLink && (
                    <a
                      href={profileUser.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:opacity-80"
                    >
                      <Github className="h-6 w-6" />
                      GitHub
                    </a>
                  )}
                  {profileUser?.linkedinLink && (
                    <a
                      href={profileUser.linkedinLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:opacity-80"
                    >
                      <Linkedin className="h-6 w-6" />
                      LinkedIn
                    </a>
                  )}
                  {profileUser?.portfolioLink && (
                    <a
                      href={profileUser.portfolioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:opacity-80"
                    >
                      <ExternalLink className="h-6 w-6" />
                      Portfolio
                    </a>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bio */}
          <Card className="my-8">
            <CardHeader>
              <CardTitle>Bio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{profileUser?.bio || "No bio available"}</p>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="my-8">
            <CardHeader>
              <CardTitle>Skills Proficient At</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profileUser?.skillsProficientAt?.length > 0 ? (
                  profileUser.skillsProficientAt.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500">No skills listed</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="my-8">
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              {profileUser?.education?.length > 0 ? (
                profileUser.education.map((edu, index) => (
                  <Box
                    key={index}
                    head={edu?.institution}
                    date={convertDate(edu?.startDate) + " - " + convertDate(edu?.endDate)}
                    spec={edu?.degree}
                    desc={edu?.description}
                    score={edu?.score}
                  />
                ))
              ) : (
                <p className="text-gray-500">No education details available</p>
              )}
            </CardContent>
          </Card>

          {/* Projects */}
          {profileUser?.projects && profileUser?.projects.length > 0 && (
            <Card className="my-8">
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent>
                {profileUser.projects.map((project, index) => (
                  <Box
                    key={index}
                    head={project?.title}
                    date={convertDate(project?.startDate) + " - " + convertDate(project?.endDate)}
                    desc={project?.description}
                    skills={project?.techStack}
                  />
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
};

export default Profile;