import Project from "../models/Project.js";
import Task from "../models/Task.js";
import Comment from "../models/Comment.js";


//1.create task
export const createTask = async (req, res) => {
  try {
    //1/get all the fields from req.body
    const {
      title,
      description,
      projectId,
      assignedTo,
      priority,
      dueDate
    } = req.body

    //2.get userId from req.user.id(logged in userId)
    const userId = req.user.id;

    //3.check project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    if (assignedTo) {
      const isAssignable = project.members.some(
        (memberId) => memberId.toString() === assignedTo,
      ) || project.owner.toString() === assignedTo;

      if (!isAssignable) {
        return res.status(400).json({
          message: "Assignee must be a project member"
        });
      }
    }
    //4.create Task(it will save automatically)
    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo,
      createdBy: userId,
      status: "todo",
      priority,
      dueDate
    });
    //5. return created task
    res.status(201).json(task);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    })
  }
};

//2.get tasks by project
export const getTasksByProjects = async (req, res) => {
  try {
    //1 get projectId
    const projectId = req.params.id;
    //2.find tasks of that project
    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    //3.return tasks
    res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};
//getSingle task
export const getSingleTask = async (req, res) => {
  try {
    //get task id
    const taskId = req.params.id;
    //find task
    const task = await Task.findById(taskId)
      .populate("assignedTo", "name email")
      .populate("createdAt", "name email");

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }
    //return task
    res.status(200).json(task);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    })
  }
}

//update task
export const updateTask = async (req, res) => {
  try {
    //get task id
    const taskId = req.params.id;
    //get task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        message: "Task Not Found"
      });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }
    //update fields
    const { title, description, status,
      priority, assignedTo, dueDate } = req.body;
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (assignedTo !== undefined) {
      if (assignedTo === "") {
        task.assignedTo = undefined;
      } else {
        const isAssignable = project.members.some(
          (memberId) => memberId.toString() === assignedTo,
        ) || project.owner.toString() === assignedTo;

        if (!isAssignable) {
          return res.status(400).json({
            message: "Assignee must be a project member"
          });
        }

        task.assignedTo = assignedTo;
      }
    }
    if (dueDate) task.dueDate = dueDate;
    //save updated task
    await task.save();
    //return updated task
    res.status(200).json(task);
  }

  catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
}

//delete task
export const deleteTask = async (req, res) => {
  try {
    //get taskid
    const taskId = req.params.id;
    //get task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }
    //delete all comments for this task first so no orphaned records remain
    await Comment.deleteMany({ task: taskId });

    //delete task
    await Task.findByIdAndDelete(taskId);
    //return success message
    res.status(200).json({
      message: "Task Deleted Successfully"
    })

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    })
  }
}
