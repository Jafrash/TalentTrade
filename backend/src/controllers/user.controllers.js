import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Request } from "../models/request.model.js";
import { UnRegisteredUser } from "../models/unRegisteredUser.model.js";
import { generateJWTToken_username } from "../utils/generateJWTtoken.js";
import { sendMail } from "../utils/SendMail.js";
import { uploadOnCloudinary } from "../config/connectCloudinary.js";

export const userDetailsWithoutID=asyncHandler(async (req,res)=>{
    console.log("\n******** Inside UserDetailsWithoutID fucntion *********\n");

    return res.status(200).json(new ApiResponse(200,req.user,"User details fetched successfully"));
})

export const UserDetails=asyncHandler(async (req,res)=>{
    console.log("\n******** Inside UserDetails function *********\n");
    const username=req.paams.username;
    const user=await User.findOne({username:username});
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const receiverID=user._id
    const senderID=req.user._id;
    const request=await Request.find({
        $or:[
            {sender:senderID,receiver:receiverID},
            {sender:receiverID,receiver:senderID}
        ]
    })

    const status = request.length > 0 ? request[0].status : "Connect";
    
    return res.status(200).json(new ApiResponse(200, { ...user._doc, status: status }, "User details fetched successfully"));
})


export const UnRegisteredUserDetails = asyncHandler(async (req, res) => {
  console.log("\n******** Inside UnRegisteredUserDetails Controller function ********");

  // console.log(" UnRegisteredUserDetail: ", userDetail);
  return res.status(200).json(new ApiResponse(200, req.user, "User details fetched successfully"));
});


export const saveRegUnRegisteredUser=asyncHandler(async (req,res)=>{
    console.log("\n ********* Inside saveRegUnRegisteredUser function *********\n");

    const { linkedinLink, githubLink, portfolioLink, skillsProficientAt, skillsToLearn } = req.body;

    if (skillsProficientAt.length === 0 || skillsToLearn.length === 0) {
      throw new ApiError(400, "Please provide at least one skill you have and one skill you want to learn");
    }

    if (githubLink === "" && linkedinLink === "" && portfolioLink === "") {
      throw new ApiError(400, "Please provide at least one link");
    }

    const githubRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+(?:\/)?$/;
    const linkedinRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/;

    if ((linkedinLink && !linkedinLink.match(linkedinRegex)) || (githubLink && !githubLink.match(githubRegex))) {
      throw new ApiError(400, "Please provide valid GitHub and LinkedIn links");
    }

    // Find the user by session or token (not by email/username)
    const user = await UnRegisteredUser.findOneAndUpdate(
      { _id: req.user._id },
      {
        linkedinLink: linkedinLink,
        githubLink: githubLink,
        portfolioLink: portfolioLink,
        skillsProficientAt: skillsProficientAt,
        skillsToLearn: skillsToLearn,
      }
    );

    if (!user) {
      throw new ApiError(500, "Error in saving user details");
    }

    return res.status(200).json(new ApiResponse(200, user, "User details saved successfully"));
});

 
export const saveEduUnRegisteredUser=asyncHandler(async (req,res)=>{
    console.log("\n******* Inside saveEduUnRegisteredUser function ********\n");

    const {education,email}=req.body;

    if(education.length==0){
        throw new ApiError(400,"Education is required")
    }

    education.forEach((edu)=>{
        if(!edu.institution||!edu.degree){
            throw new ApiError(400,"Please provide all the details");
        }
        if(!edu.startDate||
        !edu.endDate||
        !edu.score||
        edu.score<0||
        edu.score>100||
        edu.startDate>edu.endDate){
            throw new ApiError(400,"Please provide valid score and dates")
        }
    })

    const user=await UnRegisteredUser.findOneAndUpdate({email:email},{education:education});
    if(!user){
        throw new ApiError(500,"Error in saving user details");
    }

    return res.status(200).json(new ApiResponse(200,user,"User details saved successfully"));
});

export const saveAddUnRegisteredUser=asyncHandler(async (req,res)=>{
    console.log("\n******* Inside saveAddRegisteredUser function ********\n");

    const{bio,projects}=req.body;
    if(!bio){
        throw new ApiError(400,"Bio is required");
    }
    if(bio.length>500){
        throw new ApiError(400,"Bio should be less than 500 characters");
    }
    if(projects.size>0){
        projects.forEach((project)=>{
            if(!project.title||!project.description||!project.link||!project.startDate||!project.endDate){
                throw new ApiError(400,"Pleasse provide all the details");
            }
            if (project.projectLink.match(/^(http|https):\/\/[^ "]+$/)) {
                throw new ApiError(400, "Please provide valid project link");
            }
            if(project.startDate>project.endDate){
                throw new ApiError(400,"Please provide valid dates")
            }
        })
    }
    const user = await UnRegisteredUser.findOneAndUpdate({email:email},{bio:bio,projects:projects});
    if(!user){
        throw new ApiError(500,"Error saving user details")
    }
    return res.status(200).json(new ApiResponse(200,user,"User detaisls saved successfully"))
});

export const registerUser = async (req, res) => {
  console.log("\n******** Inside registerUser function ********");
  // First check if the user is already registered
  // if the user is already registerd than send a message that the user is already registered
  // redirect him to the discover page
  // if the user is not registered than create a new user and redirect him to the discover page after generating the token and setting the cookie and also delete the user detail from unregistered user from the database
  console.log("User:", req.user);

  const {
    linkedinLink,
    githubLink,
    portfolioLink,
    skillsProficientAt,
    skillsToLearn,
    education,
    bio,
    projects,
  } = req.body;

  if (skillsProficientAt.length === 0 || skillsToLearn.length === 0) {
    throw new ApiError(400, "Please provide at least one skill you have and one skill you want to learn");
  }
  if (githubLink === "" && linkedinLink === "" && portfolioLink === "") {
    throw new ApiError(400, "Please provide at least one link");
  }
  const githubRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+(?:\/)?$/;
  const linkedinRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/;
  if ((linkedinLink && !linkedinLink.match(linkedinRegex)) || (githubLink && !githubLink.match(githubRegex))) {
    throw new ApiError(400, "Please provide valid github and linkedin links");
  }
  if (education.length === 0) {
    throw new ApiError(400, "Education is required");
  }
  education.forEach((edu) => {
    if (!edu.institution || !edu.degree) {
      throw new ApiError(400, "Please provide all the details");
    }
    if (
      !edu.startDate ||
      !edu.endDate ||
      !edu.score ||
      edu.score < 0 ||
      edu.score > 100 ||
      edu.startDate > edu.endDate
    ) {
      throw new ApiError(400, "Please provide valid score and dates");
    }
  });
  if (!bio) {
    throw new ApiError(400, "Bio is required");
  }
  if (bio.length > 500) {
    throw new ApiError(400, "Bio should be less than 500 characters");
  }
  if (projects.size > 0) {
    projects.forEach((project) => {
      if (!project.title || !project.description || !project.projectLink || !project.startDate || !project.endDate) {
        throw new ApiError(400, "Please provide all the details");
      }
      if (project.projectLink.match(/^(http|https):\/\/[^ "]+$/)) {
        throw new ApiError(400, "Please provide valid project link");
      }
      if (project.startDate > project.endDate) {
        throw new ApiError(400, "Please provide valid dates");
      }
    });
  }

  // Find the user by session or token (not by email/username)
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Update user profile fields
  user.linkedinLink = linkedinLink;
  user.githubLink = githubLink;
  user.portfolioLink = portfolioLink;
  user.skillsProficientAt = skillsProficientAt;
  user.skillsToLearn = skillsToLearn;
  user.education = education;
  user.bio = bio;
  user.projects = projects;
  await user.save();

  return res.status(200).json(new ApiResponse(200, user, "Profile completed successfully"));
};

export const saveRegRegisteredUser = asyncHandler(async (req, res) => {
  console.log("******** Inside saveRegRegisteredUser Function *******");

  const { linkedinLink, githubLink, portfolioLink, skillsProficientAt, skillsToLearn, picture } = req.body;

  if (skillsProficientAt.length === 0 || skillsToLearn.length === 0) {
    throw new ApiError(400, "Please provide at least one skill you have and one skill you want to learn");
  }

  if (githubLink === "" && linkedinLink === "" && portfolioLink === "") {
    throw new ApiError(400, "Please provide at least one link");
  }

  const githubRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+(?:\/)?$/;
  const linkedinRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/;
  if ((linkedinLink && !linkedinLink.match(linkedinRegex)) || (githubLink && !githubLink.match(githubRegex))) {
    throw new ApiError(400, "Please provide valid github and linkedin links");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      linkedinLink: linkedinLink,
      githubLink: githubLink,
      portfolioLink: portfolioLink,
      skillsProficientAt: skillsProficientAt,
      skillsToLearn: skillsToLearn,
      picture: picture,
    },
    { new: true }
  );

  if (!user) {
    throw new ApiError(500, "Error in saving user details");
  }

  return res.status(200).json(new ApiResponse(200, user, "User details saved successfully"));
});

export const saveEduRegisteredUser = asyncHandler(async (req, res) => {
  console.log("******** Inside saveEduRegisteredUser Function *******");

  const { education } = req.body;

  if (education.length === 0) {
    throw new ApiError(400, "Education is required");
  }

  education.forEach((edu) => {
    if (!edu.institution || !edu.degree) {
      throw new ApiError(400, "Please provide all the details");
    }
    if (
      !edu.startDate ||
      !edu.endDate ||
      !edu.score ||
      edu.score < 0 ||
      edu.score > 100 ||
      edu.startDate > edu.endDate
    ) {
      throw new ApiError(400, "Please provide valid score and dates");
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, { education: education }, { new: true });

  if (!user) {
    throw new ApiError(500, "Error in saving user details");
  }

  return res.status(200).json(new ApiResponse(200, user, "User details saved successfully"));
});

export const saveAddRegisteredUser = asyncHandler(async (req, res) => {
  console.log("******** Inside saveAddRegisteredUser Function *******");

  const { bio, projects } = req.body;

  if (!bio) {
    throw new ApiError(400, "Bio is required");
  }

  if (bio.length > 500) {
    throw new ApiError(400, "Bio should be less than 500 characters");
  }

  if (projects.size > 0) {
    projects.forEach((project) => {
      if (!project.title || !project.description || !project.projectLink || !project.startDate || !project.endDate) {
        throw new ApiError(400, "Please provide all the details");
      }
      if (project.projectLink.match(/^(http|https):\/\/[^ "']+$/)) {
        throw new ApiError(400, "Please provide valid project link");
      }
      if (project.startDate > project.endDate) {
        throw new ApiError(400, "Please provide valid dates");
      }
    });
  }

  const user = await User.findByIdAndUpdate(req.user._id, { bio: bio, projects: projects }, { new: true });

  if (!user) {
    throw new ApiError(500, "Error in saving user details");
  }

  return res.status(200).json(new ApiResponse(200, user, "User details saved successfully"));
});


export const uploadPic=asyncHandler(async (req,res)=>{
    const localPath=req.files?.picture[0]?.path;
    if(!localPath){
        throw new ApiError(400,"Avatar file is required")
    }
    const picture=await uploadOnCloudinary(localPath);
    if(!picture){
        throw new ApiError(500,"Error uploading picture")
    }
    return res.status(200).json(new ApiResponse(200,{url:picture.url},"Picture uploaded successfully"))
})

export const discoverUsers=asyncHandler(async (req,res)=>{
    console.log("\n******* Inside discoverUsers function ********\n")
      const webDevSkills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Angular",
    "Vue",
    "Node.js",
    "Express",
    "MongoDB",
    "SQL",
    "NoSQL",
  ];

    const machineLearningSkills = [
    "Python",
    "Natural Language Processing",
    "Deep Learning",
    "PyTorch",
    "Machine Learning",
  ];

  const users=await User.find({username:{$ne:req.user.username}});
  if(!users){
    throw new ApiError(500,"Error in fetching the users");
  }
  const usersToLearn=[];
  const webDevUsers=[];
  const mlUsers=[];
  const otherUsers=[];
  users.sort(()=>Math.random()-0.5);

    users.forEach((user) => {
    if (user.skillsProficientAt.some((skill) => req.user.skillsToLearn.includes(skill)) && usersToLearn.length < 5) {
      usersToLearn.push(user);
    } else if (user.skillsProficientAt.some((skill) => webDevSkills.includes(skill)) && webDevUsers.length < 5) {
      webDevUsers.push(user);
    } else if (user.skillsProficientAt.some((skill) => machineLearningSkills.includes(skill)) && mlUsers.length < 5) {
      mlUsers.push(user);
    } else {
      if (otherUsers.length < 5) otherUsers.push(user);
    }
  });

  return res.status(200).json(new ApiResponse(200,{forYou:usersToLearn,webDev:webDevUsers,
  ml:mlUsers,others:otherUsers},"Users fetched successfully"))
})

export const sendScheduleMeet = asyncHandler(async (req, res) => {
  console.log("******** Inside sendScheduleMeet Function *******");

  const { date, time, username } = req.body;
  if (!date || !time || !username) {
    throw new ApiError(400, "Please provide all the details");
  }

  const user = await User.findOne({ username: username });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const to = user.email;
  const subject = "Request for Scheduling a meeting";
  const message = `${req.user.name} has requested for a meet at ${time} time on ${date} date. Please respond to the request.`;

  await sendMail(to, subject, message);

  return res.status(200).json(new ApiResponse(200, null, "Email sent successfully"));
});