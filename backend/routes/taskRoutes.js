import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

import { createTask, getTasksByProjects, getSingleTask, updateTask, deleteTask } from "../controllers/TaskController.js"


const router = express.Router();

router.post("/", authMiddleware, createTask);
router.get("/project/:id", authMiddleware, getTasksByProjects);
router.get("/:id", authMiddleware, getSingleTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);


export default router;