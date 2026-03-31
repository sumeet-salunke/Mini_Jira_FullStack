import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createProject,
  getProjects,
  updateProjects,
  deleteProject,
  getSingleProject,
  addProjectMember,
  removeProjectMember,
} from "../controllers/projectController.js";
const router = express.Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.post("/:id/members", authMiddleware, addProjectMember);
router.delete("/:id/members/:memberId", authMiddleware, removeProjectMember);
router.get("/:id", authMiddleware, getSingleProject);
router.put("/:id", authMiddleware, updateProjects);
router.delete("/:id", authMiddleware, deleteProject)




export default router;
