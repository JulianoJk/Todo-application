require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const userRoutes = require("./routes/user.routes");
const taskRoutes = require("./routes/task.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/folders", require("./routes/folder.routes"));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
