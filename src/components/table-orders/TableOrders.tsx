import type { JSX } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Table } from "../table/Table";
import { PaginationTable } from "../table/PaginationTable";
import NotOrderFound from "./NotOrdersFound";
import { TOrder, TOrdersList } from "../../types/orderTypes";
import { BodyTableOrders } from "./BodyTableOrders";

type TableOrderProps = {
  filterNotFound: boolean
  ordersList: TOrdersList;
  limit: number;
  setLimit: (limit: number) => void;
  offset: number;
  setOffset: (offset: number) => void;
  handleSort?: (field: keyof TOrder) => void;
  handleRowClick: (order: TOrder) => void
};

export const TableOrder = ({
  ordersList,
  limit,
  offset,
  handleRowClick,
  handleSort,
  setLimit,
  setOffset,
}: TableOrderProps): JSX.Element => {
  const { t } = useTranslation();
  const i18nOrdersTable = (key: string): string =>
    t(`orders-directory.table.header.${key}`);

  const isPagination = useMemo(() => ordersList?.count > 10, [ordersList]);

  const columns = [
    {
      id: "order_name",
      label: i18nOrdersTable("order_name"),
    },

    {
      id: "patient-name",
      label: i18nOrdersTable("patient-name"),
    },
    {
      id: "due-date",
      label: i18nOrdersTable("due-date"),
    },
    {
      id: "device",
      label: i18nOrdersTable("device"),
    },
    // {
    //   id: "container-type",
    //   label: i18nOrdersTable("container-type"),
    // },
    {
      id: "event-type",
      label: i18nOrdersTable("event-type"),
    },
    {
      id: "medical_system_status",
      label: i18nOrdersTable("status"),
      icon: "swap_vert",
      onclick: () => handleSort?.('medical_system_status'),
    }
  ];


  return (
    <div className="relative mt-4">
      <Table columns={columns}>
        {ordersList.count === 0 ? (
          <tr>
            <td colSpan={columns.length} className="text-center py-4">
              <NotOrderFound />
            </td>
          </tr>
        ) : (
          <BodyTableOrders
            handleRowClick={handleRowClick}
            rows={ordersList.results}
            isPagination={isPagination}
            isLoadingSendInvitation={false}
            handleClickInviteButton={() => { }}
          />
        )}
      </Table>
      {isPagination && (
        <PaginationTable
          limit={limit}
          setLimit={setLimit}
          total={ordersList?.count ?? 0}
          offset={offset}
          setOffset={setOffset}
        />
      )}
    </div>
  );
};
