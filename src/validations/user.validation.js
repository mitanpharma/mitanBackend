import { z } from "zod";

export const signupValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),

  email: z.email("email is required"),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^[0-9+\s()-]*$/, "Invalid phone number format"),
});

export const loginValidationSchema = z.object({
  email: z.email("email is required"),
  password: z.string().min(1),
});
