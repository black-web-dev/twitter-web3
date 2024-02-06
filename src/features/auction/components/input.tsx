import React from "react";

import styles from "./styles/input.module.scss";

export const Input = React.memo(function InnerInput({
  value,
  onUserInput,
  placeholder,
  ...rest
}: {
  value: string | number;
  onUserInput: (input: string) => void;
  error?: boolean | string;
  fontSize?: string;
  align?: "right" | "left";
  className?: string;
} & Omit<React.HTMLProps<HTMLInputElement>, "ref" | "onChange" | "as">) {
  const enforcer = (nextUserInput: string) => {
    onUserInput(nextUserInput);
  };

  return (
    <input
      className={styles.input}
      {...rest}
      value={value}
      onChange={(event) => {
        enforcer(event.target.value.replace(/,/g, "."));
      }}
      inputMode="text"
      title="username"
      autoComplete="off"
      autoCorrect="off"
      type="text"
      placeholder={placeholder || "Cascadia"}
      minLength={42}
      maxLength={42}
      spellCheck="false"
    />
  );
});

export default Input;
