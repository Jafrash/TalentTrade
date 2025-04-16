import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const ProfileCard = ({ profileImageUrl, bio, name, skills, rating, username }) => {
  // Get initials for avatar fallback
  const getInitials = () => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="w-[300px] h-[450px] flex flex-col justify-between text-center rounded-3xl shadow-lg bg-black/30 border-none overflow-hidden text-emerald-50">
      <CardHeader className="flex flex-col items-center pt-6 pb-2">
        <Avatar className="w-24 h-24 border-2 border-yellow-100 p-1">
          {profileImageUrl ? (
            <AvatarImage src={profileImageUrl} alt={name} />
          ) : (
            <AvatarFallback className="text-lg bg-emerald-700 text-emerald-50">
              {getInitials()}
            </AvatarFallback>
          )}
        </Avatar>
        <h3 className="font-medium text-xl mt-4 mb-2 font-['Montserrat']">{name}</h3>
        <div className="flex items-center mb-2">
          <span className="text-sm font-['Montserrat'] text-yellow-100">Rating: {rating} ⭐</span>
        </div>
        <p className="text-sm truncate w-[200px] font-['Montserrat']">{bio}</p>
      </CardHeader>
      
      <CardContent className="px-4 flex-1 flex flex-col items-center">
        <div className="w-full">
          <Link to={`/profile/${username}`}>
            <Button 
              className="w-full bg-transparent text-emerald-400 border border-emerald-400 hover:bg-white/10 hover:text-emerald-300 transition duration-300 font-['Montserrat'] font-medium"
              variant="outline"
            >
              View Profile
            </Button>
          </Link>
        </div>
      </CardContent>
      
      <CardFooter className="p-0 mt-4 w-full">
        <div className="w-full bg-teal-900/30 py-2 px-4 text-left">
          <h6 className="uppercase text-base font-medium mb-2 font-['Montserrat']">Skills</h6>
          <ScrollArea className="h-[100px] w-full">
            <div className="flex flex-wrap gap-2 mb-4">
              {skills && skills.map((skill, index) => (
                <Badge 
                  key={index}
                  className="bg-[#809c5c] hover:bg-[#809c5c]/90 text-white border-none px-3 py-1.5 rounded"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;