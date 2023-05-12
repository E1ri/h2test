import React from "react";
import styles from "./style.module.scss";
import classNames from "classnames";

interface IRow {
  children: React.ReactNode;
  isHead?: boolean;
}

export const Row: React.FC<IRow> = ({ children, isHead }) => {
  return (
    <tr
      className={classNames({
        [styles.row]: !isHead,
        [styles.row__default]: true,
      })}
    >
      {children}
    </tr>
  );
};
