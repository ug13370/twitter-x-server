import Joi, { CustomHelpers } from "joi";
import isUserIdExisting from "../validators/isUserIdExisting";
import { Request, Response, NextFunction, RequestHandler } from "express";

const createNewTweet: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Define the request schema using Joi inside the function
    const mediaSchema = Joi.object({
      description: Joi.string().max(100).optional(),
      data: Joi.string().required(),
    });
    const reqSchema = Joi.object({
      user_id: Joi.string()
        .regex(/^@/)
        .required()
        .external(isUserIdExistingInDB),
      text_content: Joi.string().min(1).optional(),
      type: Joi.string().valid("post", "comment").required(),
      medias: Joi.array().items(mediaSchema).optional(),
    })
      .options({ abortEarly: false })
      .custom((value, helpers) => {
        // Ensure that either text_content or medias (or both) are present but not both
        const { text_content, medias } = value;
        if (!text_content && !medias) {
          return helpers.message({
            custom: "Either text_content or medias (or both) should be present",
          });
        }
        return value;
      });
    try {
      // Validate the request param against the schema
      await reqSchema.validateAsync(req.body);

      // If validation passes, continue with the request handling.
      console.info("Create new tweet route middleware passed.");
      next();
    } catch (err: any) {
      // If there's a validation error, respond with a 422 status and error message.
      console.error("Create new tweet route middleware failed.");
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

/** Helpers */
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

export { createNewTweet };
