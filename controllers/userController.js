const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
};

// SIGN UP USER
const signupUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all field");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(401);
    throw new Error("Email already exist.");
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(200).json({ email });
  } else {
    res.status(400);
    throw new error("Invalid user data");
  }
});

// LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = createToken(user._id);
    const user_id = user._id;
    res.status(200).json({ user_id, email, token });
  } else {
    res.status(401);
    throw new Error("Invalid email or password.");
  }
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findOne(req.user.email);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("User not found.");
  }
});

module.exports = {
  loginUser,
  signupUser,
  getUser,
};
