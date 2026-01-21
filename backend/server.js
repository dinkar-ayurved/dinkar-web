const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { protect } = require("./middleware/auth.middleware");


const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/admin", require("./routes/admin.routes"));


app.get("/", (req, res) => {
  res.send("API is running");
});


app.get("/api/test/protected", protect, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user,
  });
});


// Start server
const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
