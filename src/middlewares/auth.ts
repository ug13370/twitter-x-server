import { Response, NextFunction, RequestHandler } from "express";

const userAuthCheck: RequestHandler = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.session) {
      console.error("Normal user auth middleware passed.");
      next();
    } else {
      console.error("Normal user auth middleware failed.");
      res
        .status(422)
        .json({
          status: "error",
          message: "User authentication failed",
          details: "Login again",
        })
        .redirect("/Auth");
    }
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: "An error occurred in user auth check middleware.",
      details: err.details,
    });
    res.redirect("/Auth");
  }
};

export { userAuthCheck };
