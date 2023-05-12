import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./style.module.scss";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
  getSortedRowModel,
} from "@tanstack/react-table";

import { ReactComponent as ArrowIcon } from "../../assets/arrowIcon.svg";
import { ReactComponent as ArrowLeft } from "../../assets/arrowLeft.svg";
import { ReactComponent as ArrowRight } from "../../assets/arrowRight.svg";

import { defaultColumn } from "./DefaultColumn/DefaultColumn";
import { IUserData } from "../../interface/user";
import { useAppSelector } from "../../redux/hooks";
import { Cell } from "../Cell/Cell";
import { Row } from "../Row/Row";
import { HeadCell } from "../HeadCell/HeadCell";
import classNames from "classnames";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

const useSkipper = () => {
  const shouldSkipRef = useRef(true);
  const shouldSkip = shouldSkipRef.current;

  const skip = useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
};

export const TableComponent: React.FC = () => {
  const userData: IUserData[] = useAppSelector((state) => state.userData.users);
  const columns = useMemo<ColumnDef<IUserData>[]>(
    () => [
      {
        accessorFn: (row) => row.id,
        id: "id",
        header: () => "№",
        enableSorting: false,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.name,
        id: "name",
        header: () => "Имя",
        footer: (props) => props.column.id,
      },
      {
        header: "Основная информация",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorFn: (row) => row.id_num,
            id: "id_num",
            header: () => "ID номер",
            enableSorting: false,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.phone,
            id: "phone",
            header: () => "Номер телефона",
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.sex,
            id: "sex",
            header: () => "Пол",
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.birth,
            id: "birth",
            header: () => "Дата рождения",
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.station,
            id: "station",
            header: () => "Станция метро",
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.address,
            id: "address",
            header: () => "Адрес",
            footer: (props) => props.column.id,
          },
        ],
      },
      {
        header: "Банковская информация",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorFn: (row) => row.bank_name,
            id: "bank_name",
            header: () => "Наименование банка",
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.card_num,
            id: "card_num",
            header: () => "Номер карты",
            footer: (props) => props.column.id,
          },
        ],
      },
    ],
    []
  );

  const [data, setData] = useState<IUserData[]>(userData);

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    autoResetPageIndex,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        skipAutoResetPageIndex();
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
    debugTable: false,
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  return (
    <>
      <div className={styles.table_container}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Row isHead key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <HeadCell key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? classNames(styles.cell, styles.cell_touch)
                              : classNames(styles.cell),
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <ArrowIcon className={styles.shevron} />,
                            desc: (
                              <ArrowIcon
                                className={classNames(
                                  styles.shevron,
                                  styles.shevron_rev
                                )}
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </HeadCell>
                  );
                })}
              </Row>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <Row key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Cell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Cell>
                    );
                  })}
                </Row>
              );
            })}
          </tbody>
        </table>
      </div>
      <button onClick={() => table.previousPage()}>
        <ArrowLeft />
      </button>
      {Array.from(Array(table.getPageCount()).keys()).map((el) => (
        <button
          disabled={false}
          onClick={() => table.setPageIndex(el)}
          key={el}
        >
          {el + 1}
        </button>
      ))}
      <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
        <ArrowRight />
      </button>
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {[8, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Показать {pageSize}
          </option>
        ))}
      </select>
    </>
  );
};
