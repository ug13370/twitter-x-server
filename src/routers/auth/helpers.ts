import User from "../../models/User/user";
import Password from "../../models/User/password";

const handleLogin = async (loginDetails: {
  email_id: string;
  password: string;
}) => {
  try {
    // Fetching user with this particular email address.
    const fetchedUser = await User.findOne({ email_id: loginDetails.email_id });

    if (fetchedUser === null) {
      console.error("Wrong email id");
      return {
        status: "error",
        message: "No user exists with this email address",
        details: `${loginDetails.email_id} is not registered in DB.`,
      };
    } else {
      const fetchedPassword: any = await Password.findOne({
        user_id: fetchedUser.user_id,
      });

      if (fetchedPassword.password !== loginDetails.password) {
        console.error("Wrong password");
        return {
          status: "error",
          message: "Wrong password",
          details: "Wrong Password",
        };
      } else {
        return {
          status: "success",
          message: "Login successfull",
          details: { user_id: fetchedUser.user_id },
        };
      }
    }
  } catch (err: any) {
    console.error("User login check failed");
    return { status: "error", message: err._message, details: err.message };
  }
};

export { handleLogin };
