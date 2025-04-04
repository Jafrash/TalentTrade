import React from "react";
import { cn } from "@/lib/utils.js"; // Assuming you have a utility function for conditional class names

const Footer = () => {
  return (
    <footer className="bg-[#3BB4A1] py-4 w-full"> 
      <div className="container mx-auto flex justify-center">
        <div className="text-center text-white font-sans">
          Copyright &copy; 2024 TalentTrade. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;