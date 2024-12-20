import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const existingLike = await Like.findOne({ videoId, userId });

  if (existingLike) {
    // User has already liked the video
    await existingLike.remove(); // Remove the like
  } else {
    await Like.create({ videoId, userId }); // Create a new like
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Like toggled successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;
  //TODO: toggle like on comment

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  const existingLike = await Like.findOne({ commentId, userId });

  if (existingLike) {
    await Like.deleteOne({ commentId, userId });
    return res.status(200).json(new ApiResponse(200, "Comment like removed"));
  } else {
    await Like.create({ commentId, userId });
    return res
      .status(201)
      .json(new ApiResponse(201, "Comment liked successfully"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const existingLike = await Like.findOne({ tweetId, userId });

  if (existingLike) {
    await Like.deleteOne({ tweetId, userId });
    return res.status(200).json(new ApiResponse(200, "Tweet like removed"));
  } else {
    await Like.create({ tweetId, userId });
    return res
      .status(201)
      .json(new ApiResponse(201, "Tweet liked successfully"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const likedVideos = await Like.find({
    userId,
    videoId: { $exists: true },
  }).populate("videoId");

  res
    .status(200)
    .json(
      new ApiResponse(200, "Liked videos fetched successfully", likedVideos)
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
