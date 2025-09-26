import type { JSX } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Table } from "../table/Table";
import { PaginationTable } from "../table/PaginationTable";
import NotPrescriptionFound from "./NotPrescriptionFound";
import { TPrescription, TPrescriptionsList } from "../../context/PrescriptionProvider";
import { BodyTablePrescriptions } from "./BodyTablePrescription";

type TablePrescriptionProps = {
  filterNotFound: boolean
  prescriptionsList: TPrescriptionsList;
  limit: number;
  setLimit: (limit: number) => void;
  offset: number;
  setOffset: (offset: number) => void;
  handleSort?: (field: keyof TPrescription) => void;
  handleRowClick: (prescription: TPrescription) => void
};

export const TablePrescription = ({
  prescriptionsList,
  limit,
  offset,
  handleRowClick,
  setLimit,
  setOffset,
  handleSort,
}: TablePrescriptionProps): JSX.Element => {
  const { t } = useTranslation();
  const i18nPrescriptionsTable = (key: string): string =>
    t(`prescription-directory.table.header.${key}`);

  const isPagination = useMemo(() => prescriptionsList?.count > 10, [prescriptionsList]);

  const columns = [
    {
      id: "prescription_id",
      label: i18nPrescriptionsTable("id"),
      icon: "swap_vert",
      onclick: () => handleSort?.('prescription_id'),
    },

    {
      id: "created",
      label: i18nPrescriptionsTable("created"),
      icon: "swap_vert",
      onclick: () => handleSort?.("created_stamp"),
    },
    {
      id: "status",
      label: i18nPrescriptionsTable("status"),
      icon: "swap_vert",
      onclick: () => handleSort?.('status'),
    },
    {
      id: "his_created_date",
      label: i18nPrescriptionsTable("his-created"),
      icon: "swap_vert",
      onclick: () => handleSort?.('his_created_date'),
    },
    // {
    //   id: "his_status",
    //   label: i18nPrescriptionsTable("his-status"),

    // },

    {
      id: "his_hospital_pharmacy_stock_id",
      label: i18nPrescriptionsTable("stock-id"),
    },

  ];


  return (
    <div className="relative mt-4">
      <Table columns={columns}>
        {prescriptionsList.count === 0 ? (
          <tr>
            <td colSpan={columns.length} className="text-center py-4">
              <NotPrescriptionFound />
            </td>
          </tr>
        ) : (
          <BodyTablePrescriptions
            handleRowClick={handleRowClick}
            rows={prescriptionsList.results}
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
          total={prescriptionsList?.count ?? 0}
          offset={offset}
          setOffset={setOffset}
        />
      )}
    </div>
  );
};
