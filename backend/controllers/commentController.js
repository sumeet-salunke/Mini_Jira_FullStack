import Comment from "../models/Comment.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

//1.add comment
export const addComment = async (req, res) => {
  try {
    //1.get taskId, text from body
    const { taskId, text } = req.body;
    //2.get userId from token
    const userId = req.user.id;
    //3.check if task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }
    //4.create comment(instance)
    const comment = await Comment.create({
      user: userId,
      task: taskId,
      text
    });
    // //5.save comment(if using new comment.craate)
    // await comment.save()
    //6.return comment
    res.status(201).json({
      message: "Comment created successfully",
      comment
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
}

//2.get comments
export const getComments = async (req, res) => {
  try {
    //1.get task Id from params
    const taskId = req.params.taskId;
    //2.find commnets where task=taskId and populate user
    const comments = await Comment.find({ task: taskId }).populate("user", "name email").sort({ createdAt: -1 });
    //3.return comments
    res.status(200).json(comments);


  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
}

//3.delete comments
export const deleteComment = async (req, res) => {
  try {
    //1.get commentId
    const commentId = req.params.commentId;
    //2.find comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }
    //3.get loggedin user
    const userId = req.user.id;
    //4.if comment.user != loggedin->unauthorized
    if (comment.user.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }
    //5 delete comment
    await Comment.findByIdAndDelete(commentId);
    //6 return success message
    res.status(200).json({
      message: "Comment deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error.message
    })
  }
}