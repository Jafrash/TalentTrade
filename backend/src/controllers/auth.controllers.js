import { generateJWTToken_email, generateJWTToken_username } from "../utils/generateJWTtoken.js"
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";
import { UnRegisteredUser } from "../models/unRegisteredUser.model.js";
import dotenv from "dotenv";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

export const googleAuthHandler = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallBack = passport.authenticate("google", {
  failureRedirect: "http://localhost:5173/login",
  session: false,
});

export const handleGoogleLoginCallBack = asyncHandler(async (req, res) => {
  console.log("\n******** Inside handleGoogleLoginCallback function ********");
  // console.log("User Google Info", req.user);

  const existingUser = await User.findOne({ email: req.user._json.email });

  if (existingUser) {
    const jwtToken = generateJWTToken_username(existingUser);
    const expiryDate = new Date(Date.now() + 1 * 60 * 60 * 1000);
    res.cookie("accessToken", jwtToken, { httpOnly: true, expires: expiryDate, secure: false });
    return res.redirect(`http://localhost:5173/`);
  }

  let unregisteredUser = await UnRegisteredUser.findOne({ email: req.user._json.email });
  if (!unregisteredUser) {
    unregisteredUser = new UnRegisteredUser({
      email: req.user._json.email,
      name: req.user._json.name,
      picture: req.user._json.picture
    });
    await unregisteredUser.save();
  }
  const jwtToken = generateJWTToken_email(unregisteredUser);
  const expiryDate = new Date(Date.now() + 0.5 * 60 * 60 * 1000);
  res.cookie("accessTokenRegistration", jwtToken, { httpOnly: true, expires: expiryDate, secure: false });
  return res.redirect("http://localhost:5173/register");
});

export const handleLogout = (req, res) => {
  console.log("\n******** Inside handleLogout function ********");
  res.clearCookie("accessToken");
  return res.status(200).json(new ApiResponse(200, null, "User logged out successfully"));
};

export const manualLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json(new ApiResponse(400, null, "Email and password are required"));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json(new ApiResponse(401, null, "Invalid email or password"));
  }

  // Check if user has a password (for users who might have registered via OAuth)
  if (!user.password) {
    return res.status(401).json(new ApiResponse(401, null, "This account was created with Google. Please use Google login."));
  }

  try {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json(new ApiResponse(401, null, "Invalid email or password"));
    }
  } catch (error) {
    console.error("Password comparison error:", error);
    return res.status(500).json(new ApiResponse(500, null, "Authentication error occurred"));
  }

  const jwtToken = generateJWTToken_username(user);
  const expiryDate = new Date(Date.now() + 1 * 60 * 60 * 1000);
  res.cookie("accessToken", jwtToken, { httpOnly: true, expires: expiryDate, secure: false });

  // Return user with default picture for navbar compatibility
  const userWithPicture = {
    ...user.toObject(),
    picture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToK4qEfbnd-RN82wdL2awn_PMviy_pelocqQ"
  };

  return res.status(200).json(new ApiResponse(200, userWithPicture, "Login successful"));
});

export const refreshToken = asyncHandler(async (req, res) => {
  // Get the token from cookies
  const token = req.cookies.accessToken;
  
  if (!token) {
    console.log("No access token found in cookies");
    // Instead of returning 401, redirect to login
    res.clearCookie('accessToken');
    return res.redirect('http://localhost:5173/login');
  }

  try {
    console.log("Attempting to verify token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID from decoded token
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log("User not found");
      // Instead of returning 401, redirect to login
      res.clearCookie('accessToken');
      return res.redirect('http://localhost:5173/login');
    }

    // Generate new token
    const newToken = generateJWTToken_username(user);
    const expiryDate = new Date(Date.now() + 1 * 60 * 60 * 1000);
    
    // Set new token in cookie
    res.cookie("accessToken", newToken, {
      httpOnly: true,
      expires: expiryDate,
      secure: false
    });
    
    // Return success response
    return res.status(200).json(new ApiResponse(200, {
      success: true,
      data: {
        token: newToken
      }
    }, "Token refreshed successfully"));
  } catch (error) {
    return res.status(401).json(new ApiResponse(401, null, "Invalid token"));
  }
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, username, password } = req.body;

  // Validate password
  if (!password || password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = new User({
    name,
    email,
    username,
    password: hashedPassword
  });

  await user.save();

  // Generate JWT token
  const jwtToken = generateJWTToken_username(user);
  const expiryDate = new Date(Date.now() + 1 * 60 * 60 * 1000);
  res.cookie("accessToken", jwtToken, { httpOnly: true, expires: expiryDate, secure: false });

  return res.status(201).json({
    success: true,
    message: "Registration successful",
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email
    }
  });
});

export const completeProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { picture, linkedinLink, githubLink, portfolioLink, 
          skillsProficientAt, skillsToLearn, education, bio, projects } = req.body;

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Create or update user profile
  let userProfile = await UserProfile.findOne({ userId });
  if (!userProfile) {
    userProfile = new UserProfile({
      userId,
      picture,
      linkedinLink,
      githubLink,
      portfolioLink,
      skillsProficientAt,
      skillsToLearn,
      education,
      bio,
      projects
    });
  } else {
    userProfile.set({
      picture,
      linkedinLink,
      githubLink,
      portfolioLink,
      skillsProficientAt,
      skillsToLearn,
      education,
      bio,
      projects
    });
  }

  await userProfile.save();
  user.isProfileComplete = true;
  user.profile = userProfile._id;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile completed successfully",
    profile: userProfile
  });
});