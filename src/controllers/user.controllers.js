import {
  signupValidationSchema,
  loginValidationSchema,
} from "../validations/user.validation.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { redis } from "../utils/redis.js";
import { asyncHandler } from "../utils/asyncHandler.js";


///// User signup Route//////////////

export const signupController = asyncHandler(async (req, res) => {
  const userSignupRouteValidation = await signupValidationSchema.safeParseAsync(
    req.body
  );

  if (!userSignupRouteValidation.success) {
    throw new ApiError(
      400,
      userSignupRouteValidation.error.format(),
      "signup Validation Failed"
    );
  }

  const { name, email, password, phone } = userSignupRouteValidation.data;

  const checkingExistingUser = await User.findOne({
    email,
  });

  if (checkingExistingUser) {
    throw new ApiError(
      409,
      [], // Changed from checkingExistingUser.errors
      "User with this Email already Exist"
    );
  }

  const addNewUser = await User.create({
    name,
    email,
    password,
    phone,
  });

  return res.status(201).json(
    new ApiResponse(201, "New User Created Successfully", {
      newUser: {
        id: addNewUser._id,
        name: addNewUser.name,
        email: addNewUser.email,
        phone: addNewUser.phone,
      },
    })
  );
});

const storeRefreshToken = async (userId, refreshToken) => {
  try {
    await redis.set(
      `refreshtoken:${userId}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60
    );
  } catch (error) {
    throw new ApiError(500, [], "Failed to store refresh token");
  }
};

///// User Login Route//////////////

export const loginController = asyncHandler(async (req, res) => {
  const userloginRouteValidation = await loginValidationSchema.safeParseAsync(
    req.body
  );

  if (!userloginRouteValidation.success) {
    throw new ApiError(
      400,
      userloginRouteValidation.error.format(),
      "Login Validation Failed"
    );
  }

  const { email, password } = userloginRouteValidation.data;

  const doesUserExist = await User.findOne({
    email,
  });

  if (!doesUserExist) {
    throw new ApiError(401, "User does not exist");
  }

  const isPasswordTrue = await doesUserExist.isPasswordCorrect(password);

  if (!isPasswordTrue) {
    throw new ApiError(401, [], "Check Your Email Or Password Again");
  }

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  const accessToken = doesUserExist.generateAccessToken();
  const refreshToken = doesUserExist.generateRefreshToken();

  await storeRefreshToken(doesUserExist._id, refreshToken);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "User loggedIn Successful", {
        user: {
          id: doesUserExist._id,
          name: doesUserExist.name,
          email: doesUserExist.email,
          role: doesUserExist.role, // ✅ Include role
        },
      })
    );
});
