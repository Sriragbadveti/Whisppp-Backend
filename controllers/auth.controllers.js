import User from "../database/user.schema.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmails } from "../emails/email.handlers.js";
import cloudinary from "../lib/cloudinary.js";


export async function signupController(req, res) {
  const { username, email, password, profilePic } = req.body;

  if (!username || !email || !password || !profilePic) {
    return res.status(400).json({ message: "Missing input fields" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    password: hashedPassword,
    email,
    profilePic,
  });

  try {
    await newUser.save();
    generateToken(newUser._id, res);

    // fire-and-forget email send but log any failure
    try {
      await sendWelcomeEmails(email, username, process.env.CLIENT_URL);
    } catch (emailErr) {
      console.error("Failed to send welcome email:", emailErr);
      // do not fail signup because email failed
    }

    return res
      .status(200)
      .json({ message: "User has been successfully signed up" });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function loginController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing input fields" });
  }

  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const validUser = await User.findOne({ email });
  if (!validUser) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const isMatch = await bcrypt.compare(password, validUser.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  generateToken(validUser._id, res);

  
  return res.status(200).json({ message: "User has successfully logged in" });
}

export async function logoutController(req, res) {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "User logged out successfully" });
}

export async function updateProfileController(req, res) {
  try {
    const { profilePic } = req.body;

    if (!profilePic) {
      res.status(400).json({ message: "Profile pic is missing" });
    }

    const user = req.user._id;

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      user, 
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: "Error in the upload profile controller" });
  }
}
