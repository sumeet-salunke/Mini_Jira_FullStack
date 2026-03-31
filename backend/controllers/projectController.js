import User from '../models/User.js';
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import Comment from "../models/Comment.js";

export const createProject = async (req, res) => {
  try {

    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      })
    }
    const newProject = await Project.create({
      title,
      description,
      owner: userId,
      members: [userId]
    });

    // await newProject.save(); no need because create already saves that so need of .save()
    return res.status(201).json({
      message: "Project created Successfully",
      project: newProject
    })

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    })
  }
}

export const getSingleProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;
    const project = await Project.findById(projectId)
      .populate("owner", "name email")
      .populate("members", "name email");
    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      })
    }
    //check if user is the ownwe or member
    const isOwner = project.owner?._id?.toString() === userId;
    const isMember = project.members.some(
      (member) => member._id?.toString() === userId,
    );
    if (!isOwner && !isMember) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }
    res.status(200).json(project);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    })
  }
}

export const addProjectMember = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Member email is required"
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    if (project.owner.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const member = await User.findOne({ email: email.trim().toLowerCase() });
    if (!member) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const alreadyMember = project.members.some(
      (memberId) => memberId.toString() === member._id.toString(),
    );

    if (alreadyMember) {
      return res.status(409).json({
        message: "User is already a project member"
      });
    }

    project.members.push(member._id);
    await project.save();

    const updatedProject = await Project.findById(projectId)
      .populate("owner", "name email")
      .populate("members", "name email");

    return res.status(200).json({
      message: "Member added successfully",
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const removeProjectMember = async (req, res) => {
  try {
    const projectId = req.params.id;
    const memberId = req.params.memberId;
    const userId = req.user.id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    if (project.owner.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    if (project.owner.toString() === memberId) {
      return res.status(400).json({
        message: "Project owner cannot be removed"
      });
    }

    project.members = project.members.filter(
      (currentMemberId) => currentMemberId.toString() !== memberId,
    );
    await project.save();

    await Task.updateMany(
      { project: projectId, assignedTo: memberId },
      { $unset: { assignedTo: "" } },
    );

    const updatedProject = await Project.findById(projectId)
      .populate("owner", "name email")
      .populate("members", "name email");

    return res.status(200).json({
      message: "Member removed successfully",
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};



export const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Project.find({
      $or: [
        { owner: userId },
        { members: userId }
      ]
    });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


export const updateProjects = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }
    if (project.owner.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }
    //update project fields
    const { title, description } = req.body;
    if (title) project.title = title;
    if (description) project.description = description;
    //save project
    await project.save();
    //return updated project
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    })
  }
}

export const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }
    if (project.owner.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized",
      })
    }
    const tasks = await Task.find({ project: projectId }).select("_id");
    const taskIds = tasks.map((task) => task._id);

    if (taskIds.length > 0) {
      await Comment.deleteMany({ task: { $in: taskIds } });
      await Task.deleteMany({ project: projectId });
    }

    await Project.findByIdAndDelete(projectId);
    res.status(200).json({
      message: "Project deleted successfully"
    })
  } catch (error) {
    res.status(500).json({
      message: "server error",
      message: error.message,
    })
  }
}


/*
pseudocodes
//create project
FUNCTION createProject(req, res)

    Get title, description from request body

    Get userId from req.user.id

    Create new project object:
        title
        description
        owner = userId
        members = [userId]

    Save project to database

    Return project response

END FUNCTION
// get all peojects
FUNCTION getProjects(req, res)

    Get userId from req.user.id

    Find projects where:
        owner = userId
        OR members include userId

    Return projects list

END FUNCTION
//update project
FUNCTION updateProject(req, res)

    Get projectId from params
    Get userId from req.user.id

    Find project by projectId

    If project.owner != userId:
        Return unauthorized

    Update project fields

    Save project

    Return updated project

END FUNCTION
//delete project
FUNCTION deleteProject(req, res)

    Get projectId from params
    Get userId from req.user.id

    Find project

    If owner != userId:
        Return unauthorized

    Delete project

    Return success message

END FUNCTION
//get single project
1. Get projectId
2. Find project from DB
3. If project not found → 404
4. Check if user is owner OR member
5. If not → 403 Unauthorized
6. Return project
*/
