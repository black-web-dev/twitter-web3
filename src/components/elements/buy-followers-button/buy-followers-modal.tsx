import { motion } from "framer-motion";
import { useState } from "react";

import { useBuyFollowers } from "@/features/profile";

import { TextInput } from "../text-input";

import styles from "./styles/buy-modal.module.scss";

export const BuyfollowersModal = ({
  session_owner_id,
  setIsModalOpen,
}: {
  session_owner_id: string;
  setIsModalOpen: (value: boolean) => void;
}) => {
  const mutation = useBuyFollowers();

  const [packages, setPackages] = useState(50);
  const [amount, setAmount] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.2 }}
      className={styles.container}
    >
      <h1>Buy followers</h1>
      <p>Increase your Followers.</p>

      <div className={styles.buttons}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TextInput
            id="packages"
            name="packages"
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                setPackages(0);
                setAmount(0);
              } else {
                const newPackages = parseInt(value);
                setPackages(newPackages);
                if (newPackages < 50) {
                  setAmount(1);
                } else {
                  setAmount(parseInt((newPackages * 0.025).toString()));
                }
              }
            }}
            placeholder="Amount"
            value={`${packages}`}
            maxLength={3}
            isError={packages === 0}
            errorMessage="Package can't be blank"
          />
          <h3 style={{ paddingLeft: "30px", paddingBottom: "15px" }}>
            ${amount}.00
          </h3>
        </div>
        <p>We will deliver {packages}+ Followers to your Account.</p>
        <button
          onClick={() => {
            mutation.mutate({
              session_owner_id,
              packages: packages,
              amount: amount,
            });
            setIsModalOpen(false);
          }}
          className={`${styles.confirm} ${styles["buyfollower"]} }`}
        >
          Buying followers
        </button>
        <button onClick={() => setIsModalOpen(false)} className={styles.cancel}>
          Cancel
        </button>
      </div>
    </motion.div>
  );
};
