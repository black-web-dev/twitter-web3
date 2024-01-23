import { IUser } from "../types";

export const following = ({
  user,
  session_owner_id,
}: {
  user: IUser | undefined;
  session_owner_id: string;
}): boolean => {
  return user
    ? user?.following?.some(
        (follower) => follower.follower_id === session_owner_id,
      )
    : false;
};

export const buying = ({
  user,
  session_owner_id,
}: {
  user: IUser | undefined;
  session_owner_id: string;
}): boolean => {
  return user
    ? user?.followers?.some(
        (follower) => follower.followed_id === session_owner_id,
      )
    : false;
};
