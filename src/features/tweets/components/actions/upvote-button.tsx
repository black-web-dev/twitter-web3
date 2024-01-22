import { useSession } from "next-auth/react";

import { UpArrowIcon, UpArrowIconActive } from "@/assets/up-arrow-icon";
import { useJoinTwitter } from "@/features/auth";

import { useVote } from "../../hooks/use-vote";
import { ITweet } from "../../types";

import styles from "./styles/actions.module.scss";

export const UpvoteButton = ({
  tweet,
  smallIcons = true,
}: {
  tweet?: ITweet;
  smallIcons?: boolean;
}) => {
  const { data: session } = useSession();

  const hasUpvoted = tweet?.votes?.some(
    (votes) =>
      votes.user_id === session?.user?.id && votes.vote_status === "up",
  );

  const setJoinTwitterData = useJoinTwitter((state) => state.setData);

  const mutation = useVote();

  return (
    <div className={styles.voteContainer}>
      <button
        aria-label={hasUpvoted ? "Unupvote" : "Upvote"}
        data-title={hasUpvoted ? "Unupvote" : "Upvote"}
        tabIndex={0}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!session) {
            setJoinTwitterData({
              isModalOpen: true,
              action: "upvote",
              user: tweet?.author?.name || "user",
            });
          }
          mutation.mutate({
            tweetId: tweet?.id,
            userId: session?.user?.id,
            vote_status: "up",
          });
        }}
        className={`${styles.container} ${styles.upvote}`}
      >
        <span
          className={`${styles.icon} ${
            smallIcons ? styles.smallIcon : styles.bigIcons
          }`}
        >
          {hasUpvoted ? <UpArrowIconActive /> : <UpArrowIcon />}
        </span>
      </button>
    </div>
  );
};
