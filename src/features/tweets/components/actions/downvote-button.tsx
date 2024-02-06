import { useSession } from "next-auth/react";

import { DownArrowIcon, DownArrowIconActive } from "@/assets/down-arrow-icon";
import { useJoinTwitter } from "@/features/auth";

import { useVote } from "../../hooks/use-vote";
import { ITweet } from "../../types";

import styles from "./styles/actions.module.scss";

export const DownVoteButton = ({
  tweet,
  smallIcons = true,
}: {
  tweet?: ITweet;
  smallIcons?: boolean;
}) => {
  const { data: session } = useSession();
  const hasDownvoted = tweet?.votes?.some(
    (votes) =>
      votes.user_id === session?.user?.id && votes.vote_status === "down",
  );

  const setJoinTwitterData = useJoinTwitter((state) => state.setData);

  const mutation = useVote();

  return (
    <div className={styles.voteContainer}>
      <button
        aria-label={hasDownvoted ? "Undownvote" : "Downvote"}
        data-title={hasDownvoted ? "Undownvote" : "Downvote"}
        tabIndex={0}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!session) {
            setJoinTwitterData({
              isModalOpen: true,
              action: "downvote",
              user: tweet?.author?.screen_name || "user",
            });
          }
          mutation.mutate({
            tweetId: tweet?.id,
            userId: session?.user?.id,
            vote_status: "down",
          });
        }}
        className={`${styles.container} ${styles.downvote}`}
      >
        <span
          className={`${styles.icon} ${
            smallIcons ? styles.smallIcon : styles.bigIcons
          }`}
        >
          {hasDownvoted ? <DownArrowIconActive /> : <DownArrowIcon />}
        </span>
      </button>
    </div>
  );
};
