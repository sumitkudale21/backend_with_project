import { asynHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js"; // ✅ named export
import uploadToCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asynHandler(async (req, res) => {

  const { fullname, email, username, password } = req.body;
  //console.log("email:", email);

  // ✅ 1. Basic field validation
  if ([fullname, email, username, password].some(field => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // ✅ 2. Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists with this email or username");
  }
  //console.log("req.files:", req.files);
  // ✅ 3. Check file existence
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar and cover image are required");
  }

  // ✅ 4. Upload to Cloudinary
  const avatarUpload = await uploadToCloudinary(avatarLocalPath);
  const coverImageUpload = await uploadToCloudinary(coverImageLocalPath);
  
  // ✅ 5. Create user in DB
  const user = await User.create({
    fullname,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatarUpload.url,
    coverImage: coverImageUpload.url,
  });

  // ✅ 6. Fetch created user without sensitive fields
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "User creation failed");
  }

  // ✅ 7. Return success response
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export { registerUser };
