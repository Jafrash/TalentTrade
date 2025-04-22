import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUser } from "../../util/UserContext";
import { toast } from "react-toastify";
import axios from "axios";
import Box from "./Box";

// Import shadcn components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Github, Linkedin, ExternalLink, Edit, Star, AlertTriangle, ThumbsUp } from "lucide-react";

const Profile = () => {
  const { user, setUser } = useUser();
  const [profileUser, setProfileUser] = useState(null);
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [connectLoading, setConnectLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/user/registered/getDetails/${username}`);
        console.log(data.data);
        setProfileUser(data.data);
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
        setLoading(false);
      }
    };
    getUser();
  }, []);

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
      });

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
    <div className="min-h-screen bg-slate-900 text-slate-50 p-4 md:p-8">
      <div className="container mx-auto max-w-5xl">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        ) : (
          <>
            <Card className="bg-slate-800 border-slate-700 shadow-lg mb-8">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-start md:items-center">
                  {/* Left side with avatar */}
                  <div className="relative bg-gradient-to-br from-slate-700 to-slate-800 p-6 md:p-8 flex flex-col items-center md:items-start rounded-t-lg md:rounded-l-lg md:rounded-tr-none w-full md:w-1/3">
                    <Avatar className="h-32 w-32 border-4 border-primary shadow-xl">
                      <AvatarImage src={profileUser?.picture} alt={profileUser?.name} />
                      <AvatarFallback className="bg-primary text-4xl font-bold">
                        {getInitials(profileUser?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="mt-4 text-2xl font-bold text-center md:text-left">{profileUser?.name}</h1>
                    
                    <div className="flex items-center mt-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`h-5 w-5 ${
                            index < (profileUser?.rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-slate-600"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium">{profileUser?.rating || 5}/5</span>
                    </div>
                    
                    {user?.username !== username && (
                      <div className="flex flex-wrap gap-2 mt-4 w-full">
                        <Button
                          className={`flex-1 ${profileUser?.status === "Connect" ? "bg-primary hover:bg-primary/90" : "bg-slate-600"}`}
                          disabled={profileUser?.status !== "Connect" || connectLoading}
                          onClick={profileUser?.status === "Connect" ? connectHandler : undefined}
                        >
                          {connectLoading ? (
                            <>
                              <div className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin mr-2" />
                              Loading...
                            </>
                          ) : (
                            profileUser?.status
                          )}
                        </Button>
                        <Button asChild variant="destructive" size="icon" className="flex-shrink-0">
                          <Link to={`/report/${profileUser.username}`}>
                            <AlertTriangle className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="success" size="icon" className="bg-green-600 hover:bg-green-700 flex-shrink-0">
                          <Link to={`/rating/${profileUser.username}`}>
                            <ThumbsUp className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Right side with links */}
                  <div className="p-6 md:p-8 w-full md:w-2/3 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="w-full">
                      <h2 className="text-xl font-semibold text-primary mb-2">Bio</h2>
                      <p className="text-slate-300 mb-6">{profileUser?.bio || "No bio available"}</p>
                      
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-slate-400 mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {profileUser?.skillsProficientAt?.map((skill, index) => (
                            <Badge key={index} variant="outline" className="bg-primary/10 hover:bg-primary/20 text-primary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-start md:items-end mt-4 md:mt-0 gap-4">
                      {user?.username === username && (
                        <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
                          <Link to="/edit_profile">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Link>
                        </Button>
                      )}
                      
                      <div className="flex gap-4">
                        {profileUser?.githubLink && (
                          <a
                            href={profileUser.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-50 transition-colors"
                          >
                            <Github className="h-6 w-6" />
                          </a>
                        )}
                        {profileUser?.linkedinLink && (
                          <a
                            href={profileUser.linkedinLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-50 transition-colors"
                          >
                            <Linkedin className="h-6 w-6" />
                          </a>
                        )}
                        {profileUser?.portfolioLink && (
                          <a
                            href={profileUser.portfolioLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-50 transition-colors"
                          >
                            <ExternalLink className="h-6 w-6" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="education" className="w-full">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>
              
              <TabsContent value="education" className="space-y-4">
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
                  <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="p-8 text-center text-slate-400">
                      No education information available
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="projects" className="space-y-4">
                {profileUser?.projects?.length > 0 ? (
                  profileUser.projects.map((project, index) => (
                    <Box
                      key={index}
                      head={project?.title}
                      date={convertDate(project?.startDate) + " - " + convertDate(project?.endDate)}
                      desc={project?.description}
                      skills={project?.techStack}
                    />
                  ))
                ) : (
                  <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="p-8 text-center text-slate-400">
                      No project information available
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;