import { motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";

import { Progressbar } from "@/components/designs/progressbar";
import { EllipsisWrapper } from "@/components/elements/ellipsis-wrapper";
import { TryAgain } from "@/components/elements/try-again";
import { UserName } from "@/features/profile";

import { useSearch } from "../hooks/use-search";
import { useSearchStore } from "../stores/use-search";

import styles from "./styles/search-results-modal.module.scss";

export const SearchResultsModal = ({
  query,
  handleSearch,
}: {
  query: string;
  handleSearch: (path: string) => void;
}) => {
  const closeResultsModal = useSearchStore((state) => state.closeResultsModal);
  const options: HTMLOptionElement[] = Array.from(
    document.querySelectorAll("#search-results-dropdown div[role=option]"),
  );
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const { data, isError, isLoading } = useSearch(query);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Tab") {
        closeResultsModal();
      }

      if (e.key === "ArrowDown") {
        const option =
          options[
            currentIndex === null || currentIndex === options.length - 1
              ? 0
              : currentIndex + 1
          ];

        if (currentIndex !== null) {
          if (option) {
            option.scrollIntoView({
              block: "nearest",
              inline: "nearest",
              behavior: "smooth",
            });
          }
        }

        e.preventDefault();
        setCurrentIndex((prev) => {
          if (prev === null) return 0;
          else return prev === options.length - 1 ? 0 : prev + 1;
        });
      }

      if (e.key === "ArrowUp") {
        const option =
          options[
            currentIndex === null || currentIndex === 0
              ? options.length - 1
              : currentIndex - 1
          ];

        if (currentIndex !== null) {
          if (option) {
            option.scrollIntoView({
              block: "nearest",
              inline: "nearest",
              behavior: "smooth",
            });
          }
        }

        e.preventDefault();
        setCurrentIndex((prev) => {
          return !prev ? options.length - 1 : prev - 1;
        });
      }

      if (e.key === "Enter") {
        if (!query) {
          return;
        } else if (currentIndex === null) {
          handleSearch(`/reservation/search?query=${query}`);
        } else {
          e.preventDefault();
          const href = options[currentIndex]?.getAttribute("data-href");
          if (href) {
            handleSearch(href);
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIndex],
  );

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const container = document.getElementById("search-form");

      if (container && !container.contains(target)) {
        closeResultsModal();
      }
    },
    [closeResultsModal],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClick);
    };
  }, [handleClick, handleKeyDown]);

  useEffect(() => {
    setCurrentIndex(null);
  }, [query]);

  if (isError) return <TryAgain />;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      aria-multiselectable="false"
      role="listbox"
      id="search-results-dropdown"
      className={`${styles.container}`}
    >
      <div className={styles.progressbar}>
        {!!query && isLoading && <Progressbar />}
      </div>
      {!query ? (
        <div className={styles.placeholder}>
          Try searching for people, topics, or keywords
        </div>
      ) : (
        <div className={styles.results}>
          <SearchResult
            href={`/search?query=${query}`}
            selected={currentIndex === 0}
            handleSearch={handleSearch}
          >
            <span className={styles.link}>Search for &quot;{query}&quot;</span>
          </SearchResult>

          <div className={styles.border}></div>

          {data?.reservations && data?.reservations?.length > 0 && (
            <div className={styles.reservation}>
              {data?.reservations?.map((reservation, index) => {
                return (
                  <SearchResult
                    key={reservation?.id}
                    selected={currentIndex === index + 1}
                    href={`/reservation/${reservation?.username}`}
                    handleSearch={handleSearch}
                  >
                    <span className={styles.username}>
                      <span className={styles.info}>
                        <EllipsisWrapper>
                          <UserName name={reservation?.username} />
                        </EllipsisWrapper>
                      </span>
                    </span>
                  </SearchResult>
                );
              })}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

const SearchResult = ({
  children,
  selected,
  href,
  handleSearch,
}: {
  children: React.ReactNode;
  selected: boolean;
  href: string;
  handleSearch: (path: string) => void;
}) => {
  return (
    <div
      role="option"
      aria-selected={selected}
      data-href={href}
      data-role="option"
      tabIndex={0}
      className={`${styles.option} ${selected ? styles.selected : ""}`}
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          handleSearch(href);
        }}
      >
        {children}
      </button>
    </div>
  );
};
