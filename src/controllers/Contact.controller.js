import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { userContactValidationSchema } from "../validations/user.validation.js";
import { User } from "../models/user.model.js";
import { Contacts } from "../models/user.contact.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const userContactController = asyncHandler(async (req, res) => {
  const contactDataValidation =
    await userContactValidationSchema.safeParseAsync(req.body);

  if (contactDataValidation.error) {
    throw new ApiError(
      400,
      contactDataValidation.error.format(),
      "User Validation Failed"
    );
  }

  const { name, email, phone, message } = contactDataValidation.data;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new ApiError(401, [], "Sign Up first to send mesage");
  }

  const userMessage = await Contacts.create({
    name,
    email,
    phone,
    message,
  });

  return res.status(201).json(
    new ApiResponse(201, "Message Sent Successfully", {
      userMessage: {
        id: userMessage._id,
        name: userMessage.name,
        email: userMessage.email,
        phone: userMessage.phone,
        message: userMessage.message,
        timing: userMessage.submittedAt.toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Asia/Kolkata",
        }),
      },
    })
  ); 
});

export const allUserMessage = asyncHandler(async (req, res) => {
  const getAllData = await Contacts.find({}).lean();

  if (getAllData.length === 0) {
    return res.status(200).json(new ApiResponse(200, "No Messages Found"));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Messages Retrieved", {
        totalMessages: getAllData.length,
        messages: getAllData,
      })
    );
});
