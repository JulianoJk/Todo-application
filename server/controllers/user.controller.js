const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Folder = require("../models/folder.model");

exports.testRoute = (_, res) => res.send("Test route");

exports.getProfile = (req, res) => {
  res.json(req.user);
};

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Define newUser here
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Create only the "Important" folder
    const importantFolder = new Folder({
      name: "Important",
      color: "bg-yellow-500",
      icon: "⭐",
      systemType: "important",
      isSystem: true,
      userId: savedUser._id.toString(),
    });

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
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
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
