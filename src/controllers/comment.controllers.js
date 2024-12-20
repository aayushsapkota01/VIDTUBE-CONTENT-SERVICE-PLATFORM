import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const comments = await Comment.find({ videoId });
  return res.status(200).json(new ApiResponse(200, comments));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { comment } = req.body;
  const newComment = await Comment.create({ videoId, comment });
  return res.status(201).json(new ApiResponse(201, newComment));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { comment } = req.body;
  const updatedComment = await Comment.findOneAndUpdate(
    { _id: commentId },
    { comment },
    { new: true }
  );
  return res.status(200).json(new ApiResponse(200, updatedComment));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  const deletedComment = await Comment.findOneAndDelete({ _id: commentId });
  return res.status(200).json(new ApiResponse(200, deletedComment));
});

export { getVideoComments, addComment, updateComment, deleteComment };
