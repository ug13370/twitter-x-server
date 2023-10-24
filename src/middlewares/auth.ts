import { Response, NextFunction, RequestHandler } from "express";

const userAuthCheck: RequestHandler = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.session && req.session.user_id) {
      console.error("Normal user auth middleware passed.");
      next();
    } else {
      console.error("Normal user auth middleware failed.");
      res.status(401).json({
        status: "error",
        message: "User authentication failed",
        details: "Login again",
      });
    }
  } catch (err: any) {
    console.error("An error occurred in user auth check middleware.");
    res.status(500).json({
      status: "error",
      message: "An error occurred in user auth check middleware.",
      details: err.details,
    });
  }
};

export { userAuthCheck };
