import Joi, { CustomHelpers } from "joi";
import Reaction from "../models/Other/reaction";
import isUserIdExisting from "../validators/isUserIdExisting";
import isTweetIdExisting from "../validators/isTweetIdExisting";
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

const fetchAllTweets: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqSchema = Joi.object({
    user_id: Joi.string().regex(/^@/).required().external(isUserIdExistingInDB),
  }).options({ abortEarly: false });

  try {
    // Validate the request param against the schema
    await reqSchema.validateAsync(req.params);

    // If validation passes, continue with the request handling.
    console.info("Fetch all tweets route middleware passed.");
    next();
  } catch (err: any) {
    // If there's a validation error, respond with a 422 status and error message.
    console.error("Fetch all tweets route middleware failed.");
    res.status(422).json({
      status: "error",
      message: "Incorrect payload",
      details: err.details,
    });
  }
};

const giveFeedbackToATweet: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqSchema = Joi.object({
    user_id: Joi.string().regex(/^@/).required().external(isUserIdExistingInDB),
    tweet_id: Joi.string().required().external(isTweetIdExistingInDB),
    feedback: Joi.boolean().required(),
  })
    .options({ abortEarly: false })
    .external(async (value, helpers) => {
      const { user_id, tweet_id, feedback } = value;
      const foundDocument = await Reaction.findOne({
        user_id: user_id,
        tweet_id: tweet_id,
      });

      if (foundDocument === null) {
        if (!feedback) {
          console.log(
            "User want to dislike a tweet which the user never liked."
          );
          return helpers.message({
            external:
              "User want to dislike a tweet which the user never liked.",
          });
        }
      } else {
        if (feedback) {
          console.log(
            "User want to like a tweet which the user already liked."
          );
          return helpers.message({
            external: "User want to like a tweet which the user already liked.",
          });
        }
      }

      return value;
    });

  try {
    // Validate the request param against the schema
    await reqSchema.validateAsync(req.body);

    // If validation passes, continue with the request handling.
    console.info("Give feedback to a tweet route middleware passed.");
    next();
  } catch (err: any) {
    // If there's a validation error, respond with a 422 status and error message.
    console.error("Give feedback to a tweet route middleware failed.");
    res.status(422).json({
      status: "error",
      message: "Incorrect payload",
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

const isTweetIdExistingInDB = async (
  value: string,
  helpers: CustomHelpers<string>
): Promise<any> => {
  try {
    let res = await isTweetIdExisting(value);
    if (res) return value;
    else
      return helpers.message({
        external: "tweet_id does not exists",
      });
  } catch (error) {
    return helpers.message({
      external: "An error occurred while checking tweet_id existence",
    });
  }
};

export { createNewTweet, fetchAllTweets, giveFeedbackToATweet };
