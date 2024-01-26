"use client";
import { usePathname, useRouter } from "next/navigation";

import { BackArrowIcon } from "@/assets/back-arrow-icon";
import { CloseButton } from "@/components/elements/close-button";

import { Search } from "./search";
import styles from "./styles/header.module.scss";

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className={styles.container}>
      {pathname !== "/auction" && (
        <CloseButton
          onClick={() => {
            router.back();
          }}
          ariaLabel="Back"
          title="Back"
        >
          <BackArrowIcon />
        </CloseButton>
      )}

      <Search />
    </div>
  );
};
