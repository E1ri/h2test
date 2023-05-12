import React from "react";
import styles from "./style.module.scss";

interface ICell {
  children: React.ReactNode;
}

export const Cell: React.FC<ICell> = ({ children }) => {
  return <td className={styles.cell}>{children}</td>;
};
