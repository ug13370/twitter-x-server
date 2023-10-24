import Tweet from "../models/Tweet/tweet";

// Function to check if an user ID already exists in the database
async function isTweetIdExisting(tweetId: string): Promise<boolean> {
  try {
    // Find a instance with the provided tweet_id
    const res = await Tweet.exists({ tweet_id: tweetId });

    // If instance exists return false otherwise return true.
    if (res === null) {
      console.log("Tweet ID does not exists.");
      return false;
    } else {
      console.log("Tweet ID exists.");
      return true;
    }
  } catch (err) {
    // Handle any errors that may occur during the existence check
    console.error("Tweet ID existence check failed:", err);
    return false;
  }
}

export default isTweetIdExisting;
