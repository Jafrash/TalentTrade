import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../util/userContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { Search as SearchIcon, Sparkles, Code, Brain, Users, Loader2 } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import SearchComponent from "./Search.jsx";

// Enhanced Profile Card Component
const ProfileCard = ({ profileImageUrl, name, rating, bio, skills, username, userId }) => {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    console.log("[ProfileCard] Current user in context:", user);
    console.log("[ProfileCard] userInfo in localStorage:", localStorage.getItem("userInfo"));
  }, [user]);

  const handleProfileClick = () => {
    navigate(`/profile/${username}`);
  };

  const handleMessageClick = (e) => {
    e.stopPropagation();
    console.log(`[ProfileCard] Message button clicked for username: ${username}`);
    console.log("[ProfileCard] Current user in context:", user);
    console.log("[ProfileCard] userInfo in localStorage:", localStorage.getItem("userInfo"));
    navigate(`/messages/${username}`);
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
    <Card className="w-full max-w-sm transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-green-950 border-none">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-14 w-14 ring-2 ring-green-300 dark:ring-green-600">
          {profileImageUrl ? (
            <AvatarImage src={profileImageUrl} alt={name} />
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white font-medium">
              {getInitials(name)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-lg font-bold text-green-900 dark:text-green-300">{name}</CardTitle>
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
                  fill="#10B981"
                  className="mr-1"
                >
                  <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
                </svg>
              ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{bio}</p>
        <div className="flex flex-wrap gap-2">
          {skills && skills.slice(0, 4).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
              {skill}
            </Badge>
          ))}
          {skills && skills.length > 4 && (
            <Badge variant="outline" className="text-xs border-green-200 text-green-600 dark:border-green-700 dark:text-green-300">
              +{skills.length - 4} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-300 shadow-md hover:shadow-lg"
          onClick={handleProfileClick}
        >
          View Profile
        </Button>
        {user?.username !== username && (
          <Button 
            variant="outline" 
            className="flex-1 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900"
            onClick={handleMessageClick}
          >
            Message
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

const Discover = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("for-you");
  const [searchValue, setSearchValue] = useState("");

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
        const { data } = await axios.get(`/user/registered/getDetails`, { withCredentials: true });
        setUser(data.data);
        localStorage.setItem("userInfo", JSON.stringify(data.data));
      } catch (error) {
        console.log(error);
        if (error?.response?.status === 401 || error?.response?.data?.message === "Please Login") {
          toast.error(error.response.data.message);
          localStorage.removeItem("userInfo");
          setUser(null);
          await axios.get("/auth/logout");
          navigate("/login");
        } else {
          toast.error(error.response?.data?.message || "Failed to fetch user details");
        }
      }
    };

    const getDiscoverUsers = async () => {
      try {
        const { data } = await axios.get("/user/discover", { withCredentials: true });
        setUserData({
          forYou: data.data.forYou || [],
          webDev: data.data.webDev || [],
          ml: data.data.ml || [],
          others: data.data.others || []
        });
      } catch (error) {
        console.log(error);
        if (error?.response?.status === 401 || error?.response?.data?.message === "Please Login") {
          toast.error(error.response.data.message);
          localStorage.removeItem("userInfo");
          setUser(null);
          await axios.get("/auth/logout");
          navigate("/login");
        } else {
          toast.error(error.response?.data?.message || "Failed to fetch discover users");
        }
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

  // Helper function to filter users by search value
  const filterUsers = (users) => {
    if (!searchValue.trim()) return users;
    const lower = searchValue.toLowerCase();
    return users.filter(user => {
      const name = user?.name?.toLowerCase() || "";
      const username = user?.username?.toLowerCase() || "";
      const bio = user?.bio?.toLowerCase() || "";
      const skills = (user?.skillsProficientAt || []).join(" ").toLowerCase();
      return (
        name.includes(lower) ||
        username.includes(lower) ||
        bio.includes(lower) ||
        skills.includes(lower)
      );
    });
  };

  // Helper function to get all unique users from all categories
  const getAllUsers = () => {
    const all = [
      ...userData.forYou,
      ...userData.webDev,
      ...userData.ml,
      ...userData.others
    ];
    // Remove duplicates by username
    const seen = new Set();
    return all.filter(user => {
      if (!user?.username) return false;
      if (seen.has(user.username)) return false;
      seen.add(user.username);
      return true;
    });
  };

  const renderUserCards = (users) => {
    if (!users || users.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center h-60 bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-950 rounded-lg p-8">
          <Users className="h-12 w-12 text-green-300 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-center">No users to show yet</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm text-center mt-2">Check back later or try another category</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user, index) => (
          <ProfileCard
            key={index}
            profileImageUrl={user?.picture}
            name={user?.name}
            rating={user?.rating || 4}
            bio={user?.bio}
            skills={user?.skillsProficientAt}
            username={user?.username}
            userId={user?._id}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="h-12 w-12 animate-spin text-green-600 dark:text-green-400 mb-4" />
        <p className="text-green-600 dark:text-green-400 font-medium">Discovering talent for you...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Sidebar navigation */}
      <div className="hidden md:block w-56 border-r border-green-100 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 shadow-md">
        <div className="sticky top-20">
          <h3 className="text-xl font-bold mb-6 text-green-700 dark:text-green-400 pl-2">Discover</h3>
          <div className="space-y-1">
            <Button 
              variant={activeTab === "for-you" ? "secondary" : "ghost"} 
              className={`w-full justify-start text-left pl-4 ${activeTab === "for-you" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "text-gray-700 dark:text-gray-300"}`}
              onClick={() => handleTabChange("for-you")}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              For You
            </Button>
            <Button 
              variant={activeTab === "popular" ? "secondary" : "ghost"} 
              className={`w-full justify-start text-left pl-4 ${activeTab === "popular" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "text-gray-700 dark:text-gray-300"}`}
              onClick={() => handleTabChange("popular")}
            >
              <Users className="h-4 w-4 mr-2" />
              Popular
            </Button>
            <Button 
              variant={activeTab === "web-development" ? "secondary" : "ghost"} 
              className={`w-full justify-start text-left pl-4 ${activeTab === "web-development" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "text-gray-700 dark:text-gray-300"}`}
              onClick={() => handleTabChange("web-development")}
            >
              <Code className="h-4 w-4 mr-2" />
              Web Development
            </Button>
            <Button 
              variant={activeTab === "machine-learning" ? "secondary" : "ghost"} 
              className={`w-full justify-start text-left pl-4 ${activeTab === "machine-learning" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "text-gray-700 dark:text-gray-300"}`}
              onClick={() => handleTabChange("machine-learning")}
            >
              <Brain className="h-4 w-4 mr-2" />
              Machine Learning
            </Button>
            <Button 
              variant={activeTab === "others" ? "secondary" : "ghost"} 
              className={`w-full justify-start text-left pl-4 ${activeTab === "others" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "text-gray-700 dark:text-gray-300"}`}
              onClick={() => handleTabChange("others")}
            >
              <Users className="h-4 w-4 mr-2" />
              Others
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile tabs (visible on small screens) */}
        <div className="md:hidden w-full p-4 bg-white dark:bg-gray-900 shadow-md">
          <Tabs defaultValue="for-you" onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full bg-green-50 dark:bg-gray-800 p-1">
              <TabsTrigger 
                value="for-you" 
                className="flex-1 data-[state=active]:bg-green-500 data-[state=active]:text-white dark:data-[state=active]:bg-green-700"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                For You
              </TabsTrigger>
              <TabsTrigger 
                value="popular" 
                className="flex-1 data-[state=active]:bg-green-500 data-[state=active]:text-white dark:data-[state=active]:bg-green-700"
              >
                <Users className="h-4 w-4 mr-1" />
                Popular
              </TabsTrigger>
              <TabsTrigger 
                value="web-development" 
                className="flex-1 data-[state=active]:bg-green-500 data-[state=active]:text-white dark:data-[state=active]:bg-green-700"
              >
                <Code className="h-4 w-4 mr-1" />
                Web
              </TabsTrigger>
              <TabsTrigger 
                value="machine-learning" 
                className="flex-1 data-[state=active]:bg-green-500 data-[state=active]:text-white dark:data-[state=active]:bg-green-700"
              >
                <Brain className="h-4 w-4 mr-1" />
                ML
              </TabsTrigger>
              <TabsTrigger 
                value="others" 
                className="flex-1 data-[state=active]:bg-green-500 data-[state=active]:text-white dark:data-[state=active]:bg-green-700"
              >
                <Users className="h-4 w-4 mr-1" />
                Others
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="p-4 md:p-6 h-full">
          <div className="max-w-6xl mx-auto">
            {/* Search component */}
            <SearchComponent value={searchValue} onChange={setSearchValue} />
            
            {searchValue.trim() ? (
              <section className="py-4">
                <h1 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-400 flex items-center">
                  <SearchIcon className="h-6 w-6 mr-2" />
                  Search Results
                </h1>
                {renderUserCards(filterUsers(getAllUsers()))}
              </section>
            ) : (
              <>
                <section id="for-you" className="py-4">
                  <h1 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-400 flex items-center">
                    <Sparkles className="h-6 w-6 mr-2" />
                    For You
                  </h1>
                  {renderUserCards(filterUsers(userData.forYou))}
                </section>
                <Separator className="my-8 bg-green-100 dark:bg-gray-700" />
                <section id="popular" className="py-4">
                  <h1 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-400 flex items-center">
                    <Users className="h-6 w-6 mr-2" />
                    Popular
                  </h1>
                  <h2 id="web-development" className="text-xl font-semibold mb-4 text-green-600 dark:text-green-300 flex items-center">
                    <Code className="h-5 w-5 mr-2" />
                    Web Development
                  </h2>
                  {renderUserCards(filterUsers(userData.webDev))}
                  <h2 id="machine-learning" className="text-xl font-semibold mt-8 mb-4 text-green-600 dark:text-green-300 flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Machine Learning
                  </h2>
                  {renderUserCards(filterUsers(userData.ml))}
                  <h2 id="others" className="text-xl font-semibold mt-8 mb-4 text-green-600 dark:text-green-300 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Others
                  </h2>
                  {renderUserCards(filterUsers(userData.others))}
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;