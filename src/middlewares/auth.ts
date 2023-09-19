import { Response, NextFunction, RequestHandler } from "express";

const isNormalUserAuthCheck: RequestHandler = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.session.userId) {
      next(); // Normal User is authenticated, continue to next middleware
    } else {
      // If there's a validation error, respond with a 422 status and error message.
      console.error("Normal user auth middleware failed.");
      res.status(422).json({
        status: "error",
        message: "User authentication failed",
        details: "Login again",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while normal user auth check middleware.",
      details: err.details,
    });
  }
};

export { isNormalUserAuthCheck };
