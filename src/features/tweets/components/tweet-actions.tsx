import { ITweet } from "../types";

import { CommentButton } from "./actions/comment-button";
import { DownVoteButton } from "./actions/downvote-button";
import { RetweetButton } from "./actions/retweet-button";
import { ShareButton } from "./actions/share-button";
import { UpvoteButton } from "./actions/upvote-button";
import styles from "./styles/tweet-actions.module.scss";

export const TweetActions = ({
  tweet,
  showStats = false,
}: {
  tweet: ITweet;
  showStats?: boolean | undefined;
}) => {
  return (
    <div
      aria-label={`${tweet?.comments?.length} replies, ${tweet?.quotes?.length} Retweets, ${tweet?.likes?.length} Likes`}
      role="group"
      className={`${styles.container} ${
        showStats ? styles.tweet : styles.tweetDetails
      }`}
    >
      <CommentButton tweet={tweet} showStats={showStats} />
      <UpvoteButton tweet={tweet} smallIcons={false} />
      <DownVoteButton tweet={tweet} smallIcons={false} />
      <RetweetButton tweet={tweet} showStats={showStats} />
      <ShareButton tweet={tweet} />
    </div>
  );
};
