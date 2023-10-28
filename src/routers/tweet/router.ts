/** Express Imports */
import express from "express";
import { Request, Response } from "express";

/** Model Imports */
import UserUserRelationship from "../../models/User/user-user-relationship";

/** Helper Imports */
import {
  handleCreateNewTweet,
  handleFeedbackForATweet,
  handleRegisterTweetMedias,
  handleFetchAllTweetsForAUser,
} from "./helpers";

/** Middleware Imports */
import {
  createNewTweet,
  fetchAllTweets,
  giveFeedbackToATweet,
} from "../../middlewares/tweet_route";
import { userAuthCheck } from "../../middlewares/auth";

const router = express.Router();

// Create a tweet (post/comment)
router.post(
  "/tweet",
  [userAuthCheck, createNewTweet],
  async (req: any, res: Response) => {
    try {
      // Fetch Session details
      const user_id = req.session.user_id;
      const user_name = req.session.user_name;

      // Destructure request body.
      const { medias = [], text_content, parent_tweet_id = "" } = req.body;

      // Create a new user with user details
      const tweetCreationRes = await handleCreateNewTweet({
        user_name,
        user_id,
        text_content,
        parent_tweet_id,
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
            createdAt: tweetCreationRes.details.createdAt,
            user_name: tweetCreationRes.details.user_name,
            no_of_likes: tweetCreationRes.details.no_of_likes,
            text_content: tweetCreationRes.details.text_content,
            no_of_comments: tweetCreationRes.details.no_of_comments,
            parent_tweet_id: tweetCreationRes.details.parent_tweet_id,
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
  }
);

// Like/Dislike a tweet
router.patch(
  "/tweet/feedback",
  [userAuthCheck, giveFeedbackToATweet],
  async (req: any, res: Response) => {
    try {
      // Fetch Session details
      const user_id = req.session.user_id;

      // Destructure request body.
      const { tweet_id, feedback } = req.body;

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

// Fetch timeline
router.get(
  "/tweets",
  [userAuthCheck, fetchAllTweets],
  async (req: any, res: Response) => {
    try {
      const tweetsToFetchForUserId = [
        req.session["user_id"],
        ...(
          await UserUserRelationship.find({
            follower_user_id: req.session["user_id"],
          })
        ).map((relationship: any) => {
          return relationship.followee_user_id;
        }),
      ];

      let tweets: any = [];

      for (let i = 0; i < tweetsToFetchForUserId.length; i++) {
        const tweetsFetchRes = await handleFetchAllTweetsForAUser(
          tweetsToFetchForUserId[i]
        );

        tweets = [
          ...tweets,
          ...tweetsFetchRes.details.filter(
            (post: any) => post.parent_tweet_id === ""
          ),
        ];

        if (tweetsFetchRes.status === "error") {
          res.status(422).json(tweetsFetchRes);
          break;
        }
      }

      tweets.sort((a: any, b: any) => b.createdAt - a.createdAt);

      // Returning tweet details.
      console.info("All tweets fetched successfully");
      res.status(200).send({
        status: "success",
        message: "All tweets fetched successfully",
        details: tweets,
      });
    } catch (err: any) {
      console.error("All tweets fetching failed:", err);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        details: err.message,
      });
    }
  }
);

// Fetch all posts for a particular user.
router.get(
  "/my_tweets/:user_id",
  fetchAllTweets,
  async (req: Request, res: Response) => {
    try {
      const tweetsFetchRes = await handleFetchAllTweetsForAUser(
        req.params.user_id
      );

      if (tweetsFetchRes.status === "success") {
        // Returning tweet details.
        console.info("My tweets fetched successfully :- " + req.params.user_id);
        res.status(200).send({
          status: "success",
          message: "My tweets fetched successfully :- " + req.params.user_id,
          details: tweetsFetchRes.details,
        });
      } else {
        // Tweets fetching failed.
        res.status(422).json(tweetsFetchRes);
      }
    } catch (err: any) {
      console.error("My tweets fetching failed:", err);
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

export default router;
