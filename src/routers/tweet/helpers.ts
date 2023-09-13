import Media from "../../models/Other/media";
import Tweet from "../../models/Tweet/tweet";
import TweetMediaRelationship from "../../models/Tweet/tweet-media-relationship";

const handleCreateNewTweet = async (tweetDetails: {
  user_id: String;
  text_content: String;
  type: "post" | "comment";
}) => {
  try {
    // Create a new tweet instance.
    const tweetInstance = new Tweet(tweetDetails);

    // Save it in database.
    let savedRes: any = await tweetInstance.save();
    let { tweet_id, user_id, text_content, created_at } = savedRes._doc;

    // Returning tweet details.
    console.info("Tweet creation successfull");
    return {
      status: "success",
      message: "Tweet created successfully",
      details: { tweet_id, user_id, text_content, created_at },
    };
  } catch (err: any) {
    console.info("Tweet creation failed");
    console.log(err);
    return { status: "error", message: err._message, details: err.message };
  }
};

const handleRegisterTweetMedias = async (mediaDetails: {
  tweet_id: String;
  user_id: String;
  medias: { data: String; description: String }[];
}) => {
  try {
    let savedMedias: { media_id: String; data: String; description: String }[] =
      [];

    for (let i = 0; i < mediaDetails.medias.length; i++) {
      let media: { data: String; description: String } = mediaDetails.medias[i];

      // Create a new media instance.
      const tweetInstance = new Media({ type: "tweet", data: media.data });

      // Save it in database.
      let tweetSavedRes: any = await tweetInstance.save();
      let { media_id } = tweetSavedRes._doc;

      // Append into saved media.
      savedMedias.push({ ...media, media_id });

      // Create a new tweet-media relationship instance.
      const tweetMediaRelnInstance = new TweetMediaRelationship({
        tweet_id: mediaDetails.tweet_id,
        media_id,
        description: media.description,
      });

      // Save it in database.
      let tweetMediaRelnSavedRes: any = await tweetInstance.save();
    }

    // Returning tweet media details.
    console.info("Tweet media registration successfull");
    return {
      status: "success",
      message: "Tweet medias registration successfull",
      details: { medias: savedMedias },
    };
  } catch (err: any) {
    console.info("Media registration failed");
    console.log(err);
    return { status: "error", message: err._message, details: err.message };
  }
};

export { handleCreateNewTweet, handleRegisterTweetMedias };
