import User from "../models/user"; // Import your User model

// Function to check if an user ID already exists in the database
async function isUserIdExisting(userId: string): Promise<boolean> {
  try {
    // Find a instance with the provided user_id
    const res = await User.exists({ user_id: userId });

    // If instance exists return false otherwise return true.
    if (res === null) return false;
    else return true;
  } catch (err) {
    // Handle any errors that may occur during the existence check
    console.error("User ID existence check failed:", err);
    return true;
  }
}

export default isUserIdExisting;
