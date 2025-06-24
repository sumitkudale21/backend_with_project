import { asynHandler } from "../utils/asyncHandler.js";

const registerUser = asynHandler(async (req, res) => {
   res.status(200).json({
    success: true,
    message: "User registered successfully",
  });
});


export { registerUser };