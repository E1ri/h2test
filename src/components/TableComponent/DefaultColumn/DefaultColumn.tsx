import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { IUserData } from "../../../interface/user";
import styles from "./style.module.scss";

export const defaultColumn: Partial<ColumnDef<IUserData>> = {
  cell: function Cell({ getValue, row: { index }, column: { id }, table }) {
    const initialValue = getValue();

    const [value, setValue] = useState(initialValue);

    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    if (id === "id" || id === "id_num") {
      return <>{value}</>;
    }

    return (
      <input
        className={styles.input}
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    );
  },
};
