import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.models.js";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }

  const totalViews = await Video.aggregate([
    { $match: { channelId } },
    { $group: { _id: null, totalViews: { $sum: "$views" } } },
  ]).then((result) => (result.length > 0 ? result[0].totalViews : 0));

  const totalSubscribers = await Subscription.aggregate([
    { $match: { channelId } },
    { $group: { _id: null, totalSubscribers: { $sum: 1 } } },
  ]).then((result) => (result.length > 0 ? result[0].totalSubscribers : 0));

  const totalLikes = await Like.aggregate([
    { $match: { channelId } },
    { $group: { _id: null, totalLikes: { $sum: 1 } } },
  ]).then((result) => (result.length > 0 ? result[0].totalLikes : 0));

  return res
    .status(200)
    .json(new ApiResponse(200, { totalViews, totalSubscribers, totalLikes }));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  // Fetch all videos uploaded by the channel
  const videos = await Video.find({ channelId });

  res
    .status(200)
    .json(new ApiResponse(200, "Channel videos fetched successfully", videos));
});

export { getChannelStats, getChannelVideos };
