const express = require("express");
const router = express.Router();

const { createPost, getAllPosts, getPostsByAuthor, getPostById, updatePost, deletePost, likePost } = require("../controllers/posts.controller.cjs");
const { authMiddleware } = require("../middlewares/auth.middleware.cjs");

router.post("/create-post", authMiddleware, createPost);
router.get("/get-all-posts", getAllPosts);
router.get("/author-posts/:author_id", getPostsByAuthor);
router.post("/like-post/:id", authMiddleware, likePost);
router.delete("/delete-post/:id", authMiddleware, deletePost);
router.get("/get-post/:id", getPostById);
router.put("/update-post/:id", authMiddleware, updatePost);

module.exports = router;