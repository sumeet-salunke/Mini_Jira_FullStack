import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    //total projects owned by user
    const totalProjects = await Project.countDocuments({ owner: userId });

    //total tasks created by user..
    const totalTasks = await Task.countDocuments({ createdBy: userId });

    //tasks by status
    const todo = await Task.countDocuments({ status: "todo", createdBy: userId });
    const inProgress = await Task.countDocuments({ status: "in-progress", createdBy: userId });
    const done = await Task.countDocuments({ status: "done", createdBy: userId });
    //tasks assigned to user
    const myTasks = await Task.countDocuments({ assignedTo: userId });
    //Overdue tasks
    const overDueTasks = await Task.countDocuments({
      assignedTo: userId,
      dueDate: { $lt: new Date() },
      status: { $ne: "done" }
    });
    //recent tasks
    const recentTasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(5).populate("project", "title");
    res.status(200).json({
      totalProjects,
      totalTasks,
      todo,
      inProgress,
      done,
      myTasks,
      overDueTasks,
      recentTasks
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};