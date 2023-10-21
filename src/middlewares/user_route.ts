import Joi, { CustomHelpers, ValidationResult } from "joi";
import { Request, Response, NextFunction, RequestHandler } from "express";
import isEmailIdExisting from "../validators/isEmailExisting";
import isUserIdExisting from "../validators/isUserIdExisting";
import isPassword from "../validators/isPassword";

const createNewUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Define the request schema using Joi inside the function
    const reqSchema = Joi.object({
      user_id: Joi.string()
        .min(2)
        .regex(/^@/)
        .required()
        .external(isUserIdNotExistingInDB),
      name: Joi.string().required(),
      email_id: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .external(isEmailIdExistingInDB),
      password: Joi.string().min(5).required().custom(hasTwoSpecialChars),
      dob: Joi.date().iso().required(),
    }).options({ abortEarly: false });

    try {
      // Validate the request body against the schema
      await reqSchema.validateAsync(req.body);

      // If validation passes, continue with the request handling.
      console.info("User creation route middleware passed.");
      next();
    } catch (err: any) {
      // If there's a validation error, respond with a 422 status and error message.
      console.error("User creation route middleware failed.");
      res.status(422).json({
        status: "error",
        message: "Incorrect payload",
        details: err.details,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while running user creation middleware.",
      details: err.details,
    });
  }
};

const updateSingleUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Define the request schema using Joi inside the function
    const reqSchema = Joi.object({
      user_id: Joi.string()
        .min(2)
        .regex(/^@/)
        .required()
        .external(isUserIdExistingInDB),
      name: Joi.string().optional(),
      dob: Joi.date().iso().optional(),
      bio: Joi.string().optional(),
      location: Joi.string().optional(),
    }).options({ abortEarly: false });

    try {
      // Validate the request body against the schema
      await reqSchema.validateAsync(req.body);

      // If validation passes, continue with the request handling.
      console.info("User updation route middleware passed.");
      next();
    } catch (err: any) {
      // If there's a validation error, respond with a 422 status and error message.
      console.error("User updation route middleware failed.");
      res.status(422).json({
        status: "error",
        message: "Incorrect payload",
        details: err.details,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while running user updation middleware.",
      details: err.details,
    });
  }
};

const updateUserPassword: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Define the request schema using Joi inside the function
    const reqSchema = Joi.object({
      user_id: Joi.string()
        .min(2)
        .regex(/^@/)
        .required()
        .external(isUserIdExistingInDB),
      new_password: Joi.string().required().external(isPasswordValid),
    }).options({ abortEarly: false });

    try {
      // Validate the request body against the schema
      await reqSchema.validateAsync(req.body);

      // If validation passes, continue with the request handling.
      console.info("User's password updation route middleware passed.");
      next();
    } catch (err: any) {
      // If there's a validation error, respond with a 422 status and error message.
      console.error("User's password updation route middleware failed.");
      res.status(422).json({
        status: "error",
        message: "Incorrect payload",
        details: err.details,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message:
        "An error occurred while running user's password updation middleware.",
      details: err.details,
    });
  }
};

const deleteSingleUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Define the request schema using Joi inside the function
    const reqSchema = Joi.object({
      user_id: Joi.string()
        .min(2)
        .regex(/^@/)
        .required()
        .external(isUserIdExistingInDB),
    }).options({ abortEarly: false });

    try {
      // Validate the request param against the schema
      await reqSchema.validateAsync(req.params);

      // If validation passes, continue with the request handling.
      console.info("Delete single user route middleware passed.");
      next();
    } catch (err: any) {
      // If there's a validation error, respond with a 422 status and error message.
      console.error("Delete single user route middleware failed.");
      res.status(422).json({
        status: "error",
        message: "Incorrect params",
        details: err.details,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message:
        "An error occurred while running single user deletion middleware.",
      details: err.details,
    });
  }
};

const followOrUnfollowUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Define the request schema using Joi inside the function
    const reqSchema = Joi.object({
      follower_user_id: Joi.string()
        .min(2)
        .regex(/^@/)
        .required()
        .external(isUserIdExistingInDB),
      followee_user_id: Joi.string()
        .min(2)
        .regex(/^@/)
        .required()
        .external(isUserIdExistingInDB),
    }).options({ abortEarly: false });

    try {
      // Validate the request param against the schema
      await reqSchema.validateAsync(req.body);

      // If validation passes, continue with the request handling.
      console.info("follow/unfollow user route middleware passed.");
      next();
    } catch (err: any) {
      // If there's a validation error, respond with a 422 status and error message.
      console.error("follow/unfollow user route middleware failed.");
      res.status(422).json({
        status: "error",
        message: "Incorrect payload",
        details: err.details,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while follow/unfollow user middleware.",
      details: err.details,
    });
  }
};

const login: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Define the request schema using Joi inside the function
    const reqSchema = Joi.object({
      email_id: Joi.string().required(),
      password: Joi.string().required(),
    }).options({ abortEarly: false });

    try {
      // Validate the request param against the schema
      await reqSchema.validateAsync(req.body);

      // If validation passes, continue with the request handling.
      console.info("Login user route middleware passed.");
      next();
    } catch (err: any) {
      // If there's a validation error, respond with a 422 status and error message.
      console.error("Login user route middleware failed.");
      res.status(422).json({
        status: "error",
        message: "Incorrect payload",
        details: err.details,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: "An error occurred in login user middleware.",
      details: err.details,
    });
  }
};

/** Helper functions */
const hasTwoSpecialChars = (value: string, helpers: CustomHelpers<string>) => {
  const specialChars = value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\]/g) || [];

  if (specialChars.length >= 2) {
    return value; // Validation passed
  }

  return helpers.message({
    custom: "must contain at least 2 special characters",
  });
};

const isEmailIdExistingInDB = async (
  value: string,
  helpers: CustomHelpers<string>
): Promise<any> => {
  try {
    let res = await isEmailIdExisting(value);
    if (!res) return value;
    else
      return helpers.message({
        external: "email_id already exists",
      });
  } catch (error) {
    return helpers.message({
      external: "An error occurred while checking email_id existence",
    });
  }
};

const isUserIdNotExistingInDB = async (
  value: string,
  helpers: CustomHelpers<string>
): Promise<any> => {
  try {
    let res = await isUserIdExisting(value);
    if (!res) return value;
    else
      return helpers.message({
        external: "user_id already exists",
      });
  } catch (error) {
    return helpers.message({
      external: "An error occurred while checking user_id existence",
    });
  }
};

const isUserIdExistingInDB = async (
  value: string,
  helpers: CustomHelpers<string>
): Promise<any> => {
  try {
    let res = await isUserIdExisting(value);
    if (res) return value;
    else
      return helpers.message({
        external: "user_id does not exists",
      });
  } catch (error) {
    return helpers.message({
      external: "An error occurred while checking user_id existence",
    });
  }
};

const isPasswordValid = async (
  value: string,
  helpers: CustomHelpers<string>
): Promise<any> => {
  try {
    let res = isPassword(value);

    if (res) return value;
    else return helpers.message({ external: "Invalid Password" });
  } catch (error) {
    return helpers.message({
      external: "An error occurred while checking password validity",
    });
  }
};

export {
  login,
  createNewUser,
  updateSingleUser,
  deleteSingleUser,
  updateUserPassword,
  followOrUnfollowUser,
};
