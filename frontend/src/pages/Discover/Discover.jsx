import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../util/userContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

// Profile Card Component
const ProfileCard = ({ profileImageUrl, name, rating, bio, skills, username }) => {
  const navigate = useNavigate();
  
  const handleProfileClick = () => {
    navigate(`/profile/${username}`);
  };

  // Get initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="w-full max-w-sm transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          {profileImageUrl ? (
            <AvatarImage src={profileImageUrl} alt={name} />
          ) : (
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-lg">{name}</CardTitle>
          <div className="flex items-center mt-1">
            {Array(rating)
              .fill()
              .map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="gold"
                  className="mr-1"
                >
                  <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
                </svg>
              ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{bio}</p>
        <div className="flex flex-wrap gap-2">
          {skills && skills.slice(0, 4).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {skills && skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{skills.length - 4} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleProfileClick}
        >
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

const Discover = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("for-you");

  const [userData, setUserData] = useState({
    forYou: [],
    webDev: [],
    ml: [],
    others: []
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/user/registered/getDetails`);
        setUser(data.data);
        localStorage.setItem("userInfo", JSON.stringify(data.data));
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        }
        localStorage.removeItem("userInfo");
        setUser(null);
        await axios.get("/auth/logout");
        navigate("/login");
      }
    };

    const getDiscoverUsers = async () => {
      try {
        const { data } = await axios.get("/user/discover");
        setUserData({
          forYou: data.data.forYou || [],
          webDev: data.data.webDev || [],
          ml: data.data.ml || [],
          others: data.data.others || []
        });
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        }
        localStorage.removeItem("userInfo");
        setUser(null);
        await axios.get("/auth/logout");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    getUser();
    getDiscoverUsers();
  }, []);

  // Handle scroll to section when tab changes
  const handleTabChange = (value) => {
    setActiveTab(value);
    const element = document.getElementById(value);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderUserCards = (users) => {
    if (!users || users.length === 0) {
      return (
        <div className="flex justify-center items-center h-40">
          <p className="text-muted-foreground">No users to show</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user, index) => (
          <ProfileCard
            key={index}
            profileImageUrl={user?.picture}
            name={user?.name}
            rating={user?.rating || 4}
            bio={user?.bio}
            skills={user?.skillsProficientAt}
            username={user?.username}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar navigation */}
      <div className="hidden md:block w-64 border-r dark:border-gray-700 p-4">
        <div className="sticky top-20">
          <h3 className="text-lg font-medium mb-4">Categories</h3>
          <div className="space-y-1">
            <Button 
              variant={activeTab === "for-you" ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => handleTabChange("for-you")}
            >
              For You
            </Button>
            <Button 
              variant={activeTab === "popular" ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => handleTabChange("popular")}
            >
              Popular
            </Button>
            <Button 
              variant={activeTab === "web-development" ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => handleTabChange("web-development")}
            >
              Web Development
            </Button>
            <Button 
              variant={activeTab === "machine-learning" ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => handleTabChange("machine-learning")}
            >
              Machine Learning
            </Button>
            <Button 
              variant={activeTab === "others" ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => handleTabChange("others")}
            >
              Others
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile tabs (visible on small screens) */}
      <div className="md:hidden w-full p-4">
        <Tabs defaultValue="for-you" onValueChange={handleTabChange}>
          <TabsList className="w-full">
            <TabsTrigger value="for-you" className="flex-1">For You</TabsTrigger>
            <TabsTrigger value="popular" className="flex-1">Popular</TabsTrigger>
            <TabsTrigger value="web-development" className="flex-1">Web Dev</TabsTrigger>
            <TabsTrigger value="machine-learning" className="flex-1">ML</TabsTrigger>
            <TabsTrigger value="others" className="flex-1">Others</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main content */}
      <ScrollArea className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <section id="for-you" className="py-6">
            <h1 className="text-3xl font-bold mb-6 text-primary">For You</h1>
            {renderUserCards(userData.forYou)}
          </section>
          
          <Separator className="my-8" />

          <section id="popular" className="py-6">
            <h1 className="text-3xl font-bold mb-6 text-primary">Popular</h1>
            <h2 id="web-development" className="text-2xl font-semibold mb-4">Web Development</h2>
            {renderUserCards(userData.webDev)}
            
            <h2 id="machine-learning" className="text-2xl font-semibold mt-10 mb-4">Machine Learning</h2>
            {renderUserCards(userData.ml)}
            
            <h2 id="others" className="text-2xl font-semibold mt-10 mb-4">Others</h2>
            {renderUserCards(userData.others)}
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Discover;