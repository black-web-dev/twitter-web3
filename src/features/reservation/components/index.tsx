"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { useReserve } from "../hooks/use-create-reservation";

import { Button } from "./button";
import Input from "./input";
import { Reservations } from "./reservations";
import styles from "./styles/index.module.scss";

export const Reservation = () => {
  const { data: session } = useSession();
  const [username, setUsername] = useState<string>("");

  const { mutate, isPending } = useReserve({
    setUsername,
  });

  return (
    <div className={styles.container}>
      <div className={styles.title}>Username Reservation</div>

      <div className={styles.form}>
        <Input
          className={styles.input}
          placeholder="Username"
          value={username?.toString() || ""}
          onUserInput={(value) => setUsername(value)}
        />
        <Button
          isLoading={isPending}
          onClick={() => mutate({ username, user_id: session?.user.id })}
        />
      </div>

      <Reservations />
    </div>
  );
};

export default Reservation;
