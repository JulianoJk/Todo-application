const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Folder = require("../models/folder.model");

exports.testRoute = (_, res) => res.send("Test route");

exports.getProfile = (req, res) => {
  res.json(req.user);
};

exports.registerUser = async (req, res) => {
  const { email, password, confirmPassword, username } = req.body;
  console.log("Register attempt:", {
    email,
    password,
    confirmPassword,
    username,
  });
  if (!email || !password || !confirmPassword)
    return res.status(400).json({ message: "All fields are required." });

  if (password.length < 5)
    return res
      .status(400)
      .json({ message: "Password must be at least 5 characters." });

  if (password !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match." });

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(409).json({ message: "Email already in use." });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    email,
    password: hashedPassword,
    username: username || email,
  });

  const savedUser = await newUser.save();

  // 🆕 Create default folder
  const inboxFolder = new Folder({
    name: "Inbox",
    color: "bg-violet-500",
    userId: savedUser._id.toString(),
  });
  await inboxFolder.save();

  const token = jwt.sign(
    { id: savedUser._id, username: savedUser.username },
    process.env.JWT_KEY,
    { expiresIn: "1h" }
  );

  res.status(201).json({
    token,
    username: savedUser.username,
    id: savedUser._id,
  });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", { email, password });
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found." });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ message: "Invalid credentials." });

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_KEY,
    { expiresIn: "1h" }
  );

  res.json({
    email: user.email,
    id: user._id,
    token,
    username: user.username,
    createdAt: user.createdAt,
    message: `Welcome back ${user.username}!`,
    status: 200,
  });
};
