import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RequestCard = ({ picture, bio, name, skills, rating, username }) => {
  return (
    <div className="bg-zinc-900 text-white rounded-xl p-6 shadow-md w-full max-w-md space-y-4 border border-teal-500">
      <img
        src={picture}
        alt="user"
        className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-teal-400"
      />
      <div className="text-center">
        <h3 className="text-xl font-semibold">{name}</h3>
        <h6 className="text-sm text-teal-300">Rating: {rating}</h6>
        <p className="text-gray-300 mt-2">{bio}</p>
      </div>

      <div className="flex justify-center">
        <Link to={`/profile/${username}`}>
          <Button variant="outline" className="text-white border-teal-500 hover:bg-teal-500">
            View Profile
          </Button>
        </Link>
      </div>

      <div>
        <h6 className="text-teal-300 font-medium mb-2">Skills</h6>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="px-3 py-1 bg-teal-500 text-sm text-white rounded-full"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
