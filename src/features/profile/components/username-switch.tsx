import { formatDistanceToNowStrict } from "date-fns";
import { Dispatch, SetStateAction, useState } from "react";

import { RadioButton } from "@/components/elements/radio-button";
import { getAllowedReservation } from "@/functions";

import { IProfile, IUser } from "../types";

import styles from "./styles/username-switch.module.scss";

export const UsernameSwitch = ({
  user,
  setProfile,
}: {
  user: IUser;
  setProfile: Dispatch<SetStateAction<IProfile>>;
}) => {
  const [username, setUsername] = useState<string>(user.screen_name);

  return (
    <div className={styles.reservation}>
      <div className={styles.title}>Username</div>
      <RadioButton
        name={user.name}
        text={user.name}
        selected={username}
        onChange={() => {
          setUsername(user.name);
          setProfile((prev: IProfile) => ({
            ...prev,
            screen_name: user.name,
          }));
        }}
      />
      {user.reservations.map((reservation, index) => {
        const { isAllowed, expiredDate } = getAllowedReservation(
          reservation.created_at,
        );

        return (
          <RadioButton
            key={index}
            name={reservation.username}
            text={`${reservation.username} ( ${
              !isAllowed
                ? "Expired"
                : `Available ${formatDistanceToNowStrict(expiredDate)}`
            } )`}
            selected={username}
            disabled={!isAllowed}
            onChange={() => {
              setUsername(reservation.username);
              setProfile((prev: IProfile) => ({
                ...prev,
                screen_name: reservation.username,
              }));
            }}
          />
        );
      })}
    </div>
  );
};
