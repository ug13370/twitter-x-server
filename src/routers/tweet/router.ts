import {
  handleCreateNewTweet,
  handleRegisterTweetMedias,
  handleFetchAllTweetsForAUser,
  handleFeedbackForATweet,
} from "./helpers";
import express from "express";
import { Request, Response } from "express";
import {
  createNewTweet,
  fetchAllTweets,
  giveFeedbackToATweet,
} from "../../middlewares/tweet_route";
import Tweet from "../../models/Tweet/tweet";

const router = express.Router();

// Create a tweet (post/comment)
router.post("/tweet", createNewTweet, async (req: Request, res: Response) => {
  try {
    // Destructure request body.
    const { user_id, text_content, type, medias = [] } = req.body;

    // Create a new user with user details
    const tweetCreationRes = await handleCreateNewTweet({
      user_id,
      text_content,
      type,
    });

    // Check if tweet creation was successfull
    if (tweetCreationRes.status === "success") {
      // Register medias
      const mediasRegistrationRes = await handleRegisterTweetMedias({
        tweet_id: tweetCreationRes.details.tweet_id,
        user_id,
        medias,
      });

      // Check if media registration was successful
      if (mediasRegistrationRes.status === "success") {
        // User and password creation successful
        res.status(201).json({
          user_id: tweetCreationRes.details.user_id,
          tweet_id: tweetCreationRes.details.tweet_id,
          medias: mediasRegistrationRes.details.medias,
          created_at: tweetCreationRes.details.createdAt,
          text_content: tweetCreationRes.details.text_content,
        });
      } else {
        // Media registrationn failed
        res.status(422).json(mediasRegistrationRes);
      }
    } else {
      // User creation failed
      res.status(422).json(tweetCreationRes);
    }
  } catch (err: any) {
    console.error("Tweet creation failed:", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      details: err.message,
    });
  }
});

// Edit a tweet
// Like/Dislike a tweet
router.patch(
  "/tweet/feedback",
  giveFeedbackToATweet,
  async (req: Request, res: Response) => {
    try {
      // Destructure request body.
      const { user_id, tweet_id, feedback } = req.body;

      // Register Feedback
      const feedbackRegRes = await handleFeedbackForATweet({
        user_id,
        tweet_id,
        feedback,
      });

      // Check if feedback registration was successfull
      if (feedbackRegRes.status === "success") {
        res.status(201).json(feedbackRegRes);
      } else {
        // Feedback registrationn failed
        res.status(422).json(feedbackRegRes);
      }
    } catch (err: any) {
      console.error("Tweet feedback reg. failed:", err);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        details: err.message,
      });
    }
  }
);
// Fetch timeline setwise.
// Fetch all posts for a particular user.
router.get(
  "/tweets/:user_id",
  fetchAllTweets,
  async (req: Request, res: Response) => {
    try {
      const tweetsFetchRes = await handleFetchAllTweetsForAUser(
        req.params.user_id
      );

      if (tweetsFetchRes.status === "success") {
        // Returning tweet details.
        console.info("Tweet fetched successfully");
        res.status(200).send({
          status: "success",
          message: "Tweet fetched successfully",
          details: tweetsFetchRes.details,
        });
      } else {
        // Tweets fetching failed.
        res.status(422).json(tweetsFetchRes);
      }
    } catch (err: any) {
      console.error("Tweets fetching failed:", err);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        details: err.message,
      });
    }
  }
);
// Fetch all replies for a particular user setwise.
// Fetch all medias.
// Fetch all like medias.
// Delete a tweet
// Delete all tweets for a specific user

module.exports = router;
