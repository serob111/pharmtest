import type { JSX } from "react";

import type { Column } from "./HeaderTable";

import { HeaderTable } from "./HeaderTable";

type TableProps = {
  columns: Column[];
  children: React.ReactNode;
};

export const Table = ({ columns, children }: TableProps): JSX.Element => {
  return (
    <table className="border-spacing-0 w-full table-fixed border-separate ">
      <HeaderTable columns={columns} />
      <div className="m-1"/>
      <tbody className="">{children}</tbody>
    </table>
  );
};
