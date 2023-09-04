import User from "../models/user"; // Import your User model

// Function to check if an email ID already exists in the database
async function isEmailIdExisting(emailId: string): Promise<boolean> {
  try {
    // Find a instance with the provided email_id
    const res = await User.exists({ email_id: emailId });

    // If instance exists return false otherwise return true.
    if (res === null) return false;
    else return true;
  } catch (err) {
    // Handle any errors that may occur during the existence check
    console.error("Email ID existence check failed:", err);
    return true;
  }
}

export default isEmailIdExisting;
