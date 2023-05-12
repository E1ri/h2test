import React from "react";
import styles from "./style.module.scss";

interface IHeadCell {
  children: React.ReactNode;
  colSpan: number;
  rowSpan?: number;
}

export const HeadCell: React.FC<IHeadCell> = ({
  children,
  colSpan,
  rowSpan,
}) => {
  return (
    <th rowSpan={rowSpan} className={styles.head_cell} colSpan={colSpan}>
      {children}
    </th>
  );
};
