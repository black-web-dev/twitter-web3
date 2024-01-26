import React from "react";

import styles from "./styles/radio-button.module.scss";

export const RadioButton = ({
  text,
  onChange,
  selected,
  disabled,
  name,
}: {
  text: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  disabled?: boolean;
  selected: string;
}) => {
  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="radio"
        value={name}
        name={name}
        checked={selected === name}
        id={name}
        onChange={onChange}
        disabled={disabled}
      />
      <label
        className={`${styles.label} ${disabled && styles.disabled}`}
        htmlFor={name}
      >
        {text}
      </label>
    </div>
  );
};
