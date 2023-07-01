const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  createBlogPost,
  getBlogPosts,
  getBlogPost,
  deleteBlogPost,
  updateBlogPost,
  getUserBlogPosts,
} = require("../controllers/blogpostController");
const requireAuth = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getBlogPosts);
router.get("/myposts", requireAuth, getUserBlogPosts);
router.get("/:id", getBlogPost);
router.post("/", upload.single("cover"), requireAuth, createBlogPost);
router.delete("/:id", requireAuth, deleteBlogPost);
router.put("/:id", upload.single("cover"), requireAuth, updateBlogPost);

module.exports = router;
