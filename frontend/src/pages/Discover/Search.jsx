import React, { useState } from 'react';
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const Search = ({ value, onChange }) => {
  const [isActive, setIsActive] = useState(false);
  
  const handleFocus = () => {
    setIsActive(true);
  };
  
  const handleBlur = () => {
    if (!value || value.length === 0) {
      setIsActive(false);
    }
  };
  
  return (
    <div className={`relative flex items-center bg-white dark:bg-gray-800 rounded-full px-4 py-2 transition-all duration-300 shadow-md ${
      isActive ? "shadow-lg ring-2 ring-green-300 dark:ring-green-600 w-full" : "w-[90%]"
    } mx-auto mb-6`}>
      <SearchIcon 
        className={`w-5 h-5 mr-2 transition-colors duration-200 ${
          isActive ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"
        }`}
      />
      <Input
        type="text"
        placeholder="Search for skills, expertise or users..."
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="flex-1 border-none bg-transparent shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
      />
      {value && value.length > 0 && (
        <button 
          className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4 py-1 ml-2 text-sm font-medium transition-all duration-200"
          onClick={() => onChange("")}
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default Search;