import { asynHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js"; // Assuming you have a utility to handle Cloudinary uploads
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asynHandler(async (req, res) => {
  // get user detail from frontend
  // valisation = not empty
  // check if user already exists: usernama. email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response

  const { fullname, email, username, password } = req.body;
  console.log("email:", email);

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists with this email or username");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar and cover image are required");
  }
  
  const avatarUrl = await uploadToCloudinary(avatarLocalPath);
  const coverImageUrl = await uploadToCloudinary(coverImageLocalPath);

if (!avatar) {
    throw new ApiError(400, "All fields are required");
}

const user = await User.crate({
  fullname,
  avatar: avatar.url,
  coverImage: coverImage?.url || "",
  email,
  password,
  username: username.toLowerCase(),
})

 const createdUser = await User.findById(user._id).select(
   "-password -refreshToken"
  )

  if (!createdUser) {
    throw new ApiError(500, "User creation failed");
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User created successfully")
  );
  
});
export { registerUser };
