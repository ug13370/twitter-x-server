import User from "../../models/User/user";
import Password from "../../models/User/password";
import UserRelationship from "../../models/User/user-relationship";

/** Helper Functions */
const handleCreateNewUser = async (userDetails: {
  user_id: String;
  name: String;
  email_id: String;
  dob: Date;
}) => {
  try {
    // Create a new user instance.
    const userInstance = new User(userDetails);

    // Save it in database.
    let savedRes: any = await userInstance.save();
    let { user_id, name, email_id, dob } = savedRes._doc;

    // Returning user details.
    console.info("User creation successfull");
    return {
      status: "success",
      message: "User created successfully",
      details: { user_id, name, email_id, dob },
    };
  } catch (err: any) {
    console.info("User creation failed");
    console.log(err);
    return { status: "error", message: err._message, details: err.message };
  }
};

const handleRegisterNewPassword = async (passwordDetails: {
  user_id: string;
  password: string;
}) => {
  try {
    // Create a new password instance.
    const passwordInstance = new Password(passwordDetails);

    // Save it in database.
    let savedRes: any = await passwordInstance.save();
    let { user_id, password } = savedRes._doc;

    // Returning password details.
    console.info("Password registration successfull");
    return {
      status: "success",
      message: "Password registered successfully",
      details: { user_id, password },
    };
  } catch (err: any) {
    console.error("Password registration failed");
    return { status: "error", message: err._message, details: err.message };
  }
};

const handleUserToFollow = async (relationshipDetails: {
  follower_user_id: string;
  followee_user_id: string;
}) => {
  try {
    // Create a new user relationship instance.
    const userRelnInstance = new UserRelationship(relationshipDetails);

    // Save it in database.
    let savedRes: any = await userRelnInstance.save();
    let { follower_user_id, followee_user_id } = savedRes._doc;

    // Returning password details.
    console.info(
      `${follower_user_id} followed ${followee_user_id} successfully!`
    );
    return {
      status: "success",
      message: "User followed successfully!",
      details: `${follower_user_id} followed ${followee_user_id} successfully!`,
    };
  } catch (err: any) {
    console.error("User relationship registration failed");
    return { status: "error", message: err._message, details: err.message };
  }
};

const handleUserToUnfollow = async (relationshipDetails: {
  follower_user_id: string;
  followee_user_id: string;
}) => {
  try {
    // Delete relationship.
    const deleteRes = await UserRelationship.deleteOne(relationshipDetails);

    // Check if the relationship was successfully deleted
    if (deleteRes.deletedCount === 1) {
      // User relationship deleted successfully
      console.info(
        "User unfollowed " +
          relationshipDetails.followee_user_id +
          " successfully!"
      );
      return {
        status: "success",
        message:
          "User unfollowed " +
          relationshipDetails.followee_user_id +
          " successfully!",
        details: deleteRes,
      };
    } else {
      // User not found with the provided user_id
      console.error(
        "User can't unfollow " + relationshipDetails.followee_user_id
      );
      return {
        status: "error",
        message: "User can't unfollow " + relationshipDetails.followee_user_id,
        details: "User does not follow " + relationshipDetails.followee_user_id,
      };
    }
  } catch (err: any) {
    console.error("User relationship deregistration failed");
    return { status: "error", message: err._message, details: err.message };
  }
};

export {
  handleUserToFollow,
  handleCreateNewUser,
  handleUserToUnfollow,
  handleRegisterNewPassword,
};
