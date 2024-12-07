 import mongoose from "mongoose";
 import { ApiError } from "../utils/ApiError.js";

 export const errorHandler = (err, req, res, next) => {
   let error = err;

   // Wrap non-ApiError errors into ApiError
   if (!(error instanceof ApiError)) {
     const statusCode =
       error.statusCode || (error instanceof mongoose.Error ? 400 : 500);
     const message = error.message || "Something went wrong";
     error = new ApiError(
       statusCode,
       message,
       error?.errors || [],
       error.stack
     );
   }

   // Build the response object
   const response = {
     success: false,
     statusCode: error.statusCode,
     message: error.message,
     errors: error.errors || [],
     ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
   };

   // Send the response
   return res.status(error.statusCode).json(response);
 };
