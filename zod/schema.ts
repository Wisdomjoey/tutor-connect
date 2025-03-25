import * as z from "zod";

const zString = z.string().trim();

export const ClassSchema = z.object({
  title: zString.min(1, "Title is required"),
  description: zString.min(1, "Description is required"),
  faculty: zString.optional(),
  department: zString.optional(),
  max: zString.optional(),
  duration: zString.min(1, "Duration is required"),
  date: zString.min(1, "Date is required"),
  time: zString.min(1, "Time is required"),
});

export const CommunitySchema = z.object({
  name: zString.min(1, "Title is required"),
  description: zString.min(1, "Description is required"),
  faculty: zString.min(1, "Faculty is required"),
  department: zString.min(1, "Department is required"),
});

export const EmailSchema = z.object({
  email: zString.email("Enter a valid email address"),
});

export const LoginSchema = z.object({
  email: zString.min(1, "Email is required"),
  password: zString.min(1, "Password is required"),
});

export const PasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Minimum of 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!|%*_=+/\\}{.,><)(#^?&]{8,}$/,
      "At least 1 Uppercase & Lowercase letter, & Number"
    ),
  cPassword: zString.min(1, "Passwords do not match"),
});

export const PasswordCheckSchema = PasswordSchema.refine(
  ({ cPassword, password }) => cPassword === password,
  { message: "Passwords do not match", path: ["cPassword"] }
);

export const PasswordResetSchema = z
  .object({
    oldPassword: zString.min(1, "Old password is required"),
  })
  .merge(PasswordSchema)
  .refine(({ cPassword, password }) => cPassword === password, {
    message: "Passwords do not match",
    path: ["cPassword"],
  });

export const RegisterSchema = z
  .object({
    fullname: zString.min(1, "Fullname is required"),
    email: zString.min(1, "Email is required"),
    phone: zString.min(1, "Phone Number is required"),
    faculty: zString.min(1, "Faculty is required"),
    department: zString.min(1, "Department is required"),
    matric: zString.min(1, "Matric/Reg No. is required"),
  })
  .merge(PasswordSchema)
  .refine(({ cPassword, password }) => cPassword === password, {
    message: "Passwords do not match",
    path: ["cPassword"],
  });

export type UseClassSchema = z.infer<typeof ClassSchema>;
export type UseEmailSchema = z.infer<typeof EmailSchema>;
export type UseLoginSchema = z.infer<typeof LoginSchema>;
export type UseRegisterSchema = z.infer<typeof RegisterSchema>;
export type UseCommunitySchema = z.infer<typeof CommunitySchema>;
export type UsePasswordCheckSchema = z.infer<typeof PasswordCheckSchema>;
export type UsePasswordResetSchema = z.infer<typeof PasswordResetSchema>;
