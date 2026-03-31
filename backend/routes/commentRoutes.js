import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { addComment, deleteComment, getComments } from "../controllers/commentController.js"

const router = express.Router();

router.post("/", authMiddleware, addComment);
router.get("/task/:taskId", authMiddleware, getComments);
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;