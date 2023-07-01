const Blog = require("../models/blogpostModel");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const mongoose = require("mongoose");

// CREATE BLOG POST
const createBlogPost = asyncHandler(async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { title, summary, content } = req.body;

  const user_id = req.user._id;
  const author = req.user.name;

  const blogpost = await Blog.create({
    title,
    summary,
    content,
    cover: newPath,
    author,
    user_id,
  });

  if (!blogpost) {
    res.status(400);
    throw new Error("Cannot create blogpost");
  }

  res.status(200).json(blogpost);
});

// GET ALL BLOG POST
const getBlogPosts = asyncHandler(async (req, res) => {
  const blogposts = await Blog.find({}).sort({ createdAt: -1 });

  if (!blogposts) {
    res.status(400);
    throw new Error("There was an error");
  }

  res.status(200).json(blogposts);
});

// GET SINGLE BLOGPOST
const getBlogPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error("No such blogpost, invalid id");
  }

  const blogpost = await Blog.findById(id);

  if (!blogpost) {
    res.status(404);
    throw new Error("No such blogpost");
  }

  res.status(200).json(blogpost);
});

// GET USER BLOGPOSTS
const getUserBlogPosts = asyncHandler(async (req, res) => {
  const user_id = req.user._id;

  const blogposts = await Blog.find({ user_id }).sort({ createdAt: -1 });

  if (!blogposts) {
    res.status(400);
    throw new Error("There was an error");
  }

  res.status(200).json(blogposts);
});

// DELETE BLOG POST
const deleteBlogPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error("No such blogpost, invalid id");
  }

  const blogpost = await Blog.findByIdAndDelete({ _id: id });

  if (!blogpost) {
    res.status(404);
    throw new Error("Blogpost do not exist or already been deleted");
  }

  res.status(200).json(blogpost);
});

// UPDATE BLOG POST
const updateBlogPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error("No such blogpost, invalid id");
  }

  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { title, summary, content, author } = req.body;

  const blogpostDoc = await Blog.findById(id);
  const blogpost = await Blog.findByIdAndUpdate(
    { _id: id },
    {
      title,
      summary,
      content,
      author,
      cover: newPath ? newPath : blogpostDoc.cover,
    }
  );

  if (!blogpost) {
    res.status(404);
    throw new Error("Blogpost do not exist or already been deleted");
  }

  res.status(200).json(blogpost);
});

module.exports = {
  createBlogPost,
  getBlogPosts,
  getBlogPost,
  getUserBlogPosts,
  deleteBlogPost,
  updateBlogPost,
};
