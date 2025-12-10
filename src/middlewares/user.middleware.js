import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

export const userAuthenticationMiddleware = asyncHandler(
  async (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      throw new ApiError(401, [], "no access token found");
    }

    let decoded;

    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new ApiError(401, [], "Access Token Expired");
      }
      if (error.name === "JsonWebTokenError") {
        throw new ApiError(401, [], "Invalid Access Token");
      }
      throw new ApiError(401, [], "Token Verification Failed");
    }

    const checkExistingUser = await User.findById(decoded._id);

    if (!checkExistingUser) {
      throw new ApiError(
        401,
        [],
        "unauthenticated access - invalid access token"
      );
    }

    req.user = decoded;
    next();
  }
);

export const userAuthorization = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, [], "Authentication Required");
  }

  if (req.user.role !== "admin") {
    throw new ApiError(403, [], "Access Denied - Admin Only");
  }

  next();
});
