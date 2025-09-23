import User from "../models/User.js";

// Get all users except the logged-in one
export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.userId; // we'll get from middleware later
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
