import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { CalendarIcon, Briefcase } from "lucide-react";

const Box = ({ head, date, spec, desc, skills, score }) => {
  return (
    <Card className="w-full mb-6 shadow-md transition-all hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{head}</CardTitle>
        <CardDescription className="flex justify-between items-center text-sm text-muted-foreground mt-1">
          <div className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4" />
            <span>{spec}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>{date}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{desc}</p>
        
        {skills && (
          <>
            <CardDescription className="mb-2 text-sm text-muted-foreground">Skills Used:</CardDescription>
            <div className="flex flex-wrap gap-2">
              {skills?.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary">
                  {skill}
                </Badge>
              ))}
            </div>
          </>
        )}
        
        {score && (
          <div className="mt-4 flex items-center text-sm text-muted-foreground">
            <span>Grade / Percentage:</span>
            <Badge variant="outline" className="ml-2">
              {score}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Box;