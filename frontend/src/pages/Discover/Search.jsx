import React, { useState } from 'react';
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"; // Assuming you have shadcn's utils

const Search = () => {
  const [isActive, setIsActive] = useState(false);
  
  const handleFocus = () => {
    setIsActive(true);
  };
  
  const handleBlur = () => {
    setIsActive(false);
  };
  
  return (
    <div className={cn(
      "relative flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 mt-12 mb-12 transition-all duration-300",
      isActive ? "w-[90%]" : "w-[80%]"
    )}>
      <Input
        type="text"
        placeholder="Search..."
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="flex-1 border-none bg-transparent shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
      />
      <SearchIcon 
        className={cn(
          "w-5 h-5 text-gray-400 transition-colors duration-300",
          isActive ? "text-gray-700 dark:text-gray-300" : "text-gray-400",
          "group-hover:text-gray-700 dark:group-hover:text-gray-300"
        )} 
      />
    </div>
  );
};

export default Search;