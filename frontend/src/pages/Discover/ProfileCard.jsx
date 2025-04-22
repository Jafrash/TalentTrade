import React from 'react';
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const ProfileCard = ({ profileImageUrl, name, rating, bio, skills, username }) => {
  const navigate = useNavigate();
  
  const handleProfileClick = () => {
    navigate(`/profile/${username}`);
  };

  const handleMessageClick = (e) => {
    e.stopPropagation();
    navigate(`/messages/${username}`);
  };

  // Get initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word?.[0] || '')
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-green-950 border-none relative overflow-hidden group">
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 opacity-20 dark:opacity-30 rounded-bl-full transform transition-all duration-300 group-hover:scale-125"></div>
      
      <CardHeader className="flex flex-row items-center gap-4 pb-2 relative z-10">
        <Avatar className="h-12 w-12 ring-2 ring-green-300 dark:ring-green-600 transition-all duration-300 group-hover:ring-green-500 dark:group-hover:ring-green-400">
          {profileImageUrl ? (
            <AvatarImage src={profileImageUrl} alt={name} />
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white font-medium">
              {getInitials(name)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-base font-bold text-green-900 dark:text-green-300 transition-colors duration-300 group-hover:text-green-700 dark:group-hover:text-green-200">{name}</CardTitle>
          <div className="flex items-center mt-1">
            {Array(rating)
              .fill()
              .map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
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
      <CardContent className="relative z-10 py-2">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{bio}</p>
        <div className="flex flex-wrap gap-1">
          {skills && skills.slice(0, 3).map((skill, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800 transition-colors duration-300 group-hover:bg-green-200 dark:group-hover:bg-green-800 group-hover:border-green-300 dark:group-hover:border-green-700"
            >
              {skill}
            </Badge>
          ))}
          {skills && skills.length > 3 && (
            <Badge 
              variant="outline" 
              className="text-xs border-green-200 text-green-600 dark:border-green-700 dark:text-green-300 transition-colors duration-300 group-hover:border-green-300 dark:group-hover:border-green-600"
            >
              +{skills.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 relative z-10 pt-2">
        <Button 
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-300 shadow-md hover:shadow-lg text-sm py-1 h-8"
          onClick={handleProfileClick}
        >
          View Profile
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900 transition-colors duration-300 h-8 w-8"
          onClick={handleMessageClick}
        >
          <MessageSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;