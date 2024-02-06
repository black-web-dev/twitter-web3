import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { EllipsisWrapper } from "@/components/elements/ellipsis-wrapper";
import { FollowButton } from "@/components/elements/follow-button";
import {
  Avatar,
  following,
  IUser,
  LinkToProfile,
  UserModalWrapper,
  UserName,
  UserScreenName,
} from "@/features/profile";
import { getAllowedUsername } from "@/functions";

import styles from "./styles/person-details.module.scss";

export const PersonDetails = ({ author }: { author: IUser }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const { allowedName } = getAllowedUsername(author);

  const isFollowing = following({
    user: author,
    session_owner_id: session?.user?.id,
  });

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          router.push(`/${author?.id}`);
        }
      }}
      onClick={() => {
        router.push(`/${author?.id}`);
      }}
      className={styles.container}
    >
      <div className={styles.avatar}>
        <UserModalWrapper userId={author?.id}>
          <Avatar userImage={author?.profile_image_url} />
        </UserModalWrapper>
      </div>

      <div className={styles.info}>
        <div className={styles.user_details}>
          <div className={styles.name}>
            <UserModalWrapper userId={author?.id}>
              <LinkToProfile userId={author?.id}>
                <EllipsisWrapper>
                  <UserName
                    name={allowedName}
                    isVerified={author?.verified}
                    hover={true}
                  />
                </EllipsisWrapper>
              </LinkToProfile>
            </UserModalWrapper>

            <UserModalWrapper userId={author?.id}>
              <EllipsisWrapper>
                <UserScreenName screenName={author?.email?.split("@")[0]} />
              </EllipsisWrapper>
            </UserModalWrapper>
          </div>
          {author.id !== session?.user.id && (
            <FollowButton
              user_id={author?.id}
              session_owner_id={session?.user?.id}
              isFollowing={isFollowing}
              username={author?.email?.split("@")[0]}
            />
          )}
        </div>

        {author?.description && (
          <div className={styles.secondary}>
            <span className={styles.description}>{author?.description}</span>
          </div>
        )}
      </div>
    </div>
  );
};
