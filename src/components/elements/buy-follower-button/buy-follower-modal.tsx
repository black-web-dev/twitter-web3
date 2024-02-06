import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";

import { LoadingSpinner } from "@/components/elements/loading-spinner";
import { buyfollower } from "@/features/profile";

import styles from "./styles/buying-modal.module.scss";

export const BuyfollowerModal = ({
  username = "user",
  user_id,
  session_owner_id,
  amount,
  setIsModalOpen,
}: {
  username: string | undefined;
  user_id: string;
  session_owner_id: string;
  amount: number;
  setIsModalOpen: (value: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      user_id,
      session_owner_id,
      amount,
    }: {
      user_id: string;
      session_owner_id: string;
      amount: number;
    }) => {
      return buyfollower(user_id, session_owner_id, amount);
    },

    onSuccess: (data) => {
      console.log("success", data);
    },

    onError: () => {
      console.log("error");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalOpen(false);
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.2 }}
      className={styles.container}
    >
      <h1>{`Buy follower @${username}?`}</h1>
      <p>{`You can purchase this follower for ${amount} cents.`}</p>

      <div className={styles.buttons}>
        <button
          onClick={() => {
            setIsLoading(true);

            mutation.mutate({
              user_id,
              session_owner_id,
              amount: amount,
            });
          }}
          className={`${styles.confirm} ${styles["buyfollower"]} }`}
          disabled={isLoading}
        >
          <div className={styles.title}>Buying follower</div>
          {isLoading && (
            <div className={styles.loading}>
              <LoadingSpinner />
            </div>
          )}
        </button>
        <button
          onClick={() => setIsModalOpen(false)}
          className={styles.cancel}
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};
