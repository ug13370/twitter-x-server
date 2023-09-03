import Joi, { CustomHelpers, ValidationResult } from "joi";
import { Request, Response, NextFunction, RequestHandler } from "express";

const createNewUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Define the request schema using Joi inside the function
    const reqSchema = Joi.object({
      name: Joi.string().required(),
      email_id: Joi.string().required(),
      password: Joi.string().min(5).required().custom(hasTwoSpecialChars),
      dob: Joi.date().iso().required(),
    });

    // Validate the request body against the schema
    const { value, error, warning }: ValidationResult = reqSchema.validate(
      req.body
    );

    if (error) {
      // If there's a validation error, respond with a 422 status and error message.
      console.error("User creation route middleware failed.");
      res.status(422).json({
        status: "error",
        message: "Incorrect payload",
        details: error.details,
      });
    } else {
      // If validation passes, continue with the request handling.
      console.info("User creation route middleware passed.");
      next();
    }
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while running user creation middleware.",
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
      user_id: Joi.string().regex(/^@/).required(),
    });

    // Validate the request param against the schema
    const { value, error, warning }: ValidationResult = reqSchema.validate(
      req.params
    );

    if (error) {
      // If there's a validation error, respond with a 422 status and error message.
      console.error("Delete single user route middleware failed.");
      res.status(422).json({
        status: "error",
        message: "Incorrect params",
        details: error.details,
      });
    } else {
      // If validation passes, continue with the request handling.
      console.info("Delete single user route middleware passed.");
      next();
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

export { createNewUser, deleteSingleUser };
