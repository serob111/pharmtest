import type { JSX } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Table } from "../table/Table";
import { PaginationTable } from "../table/PaginationTable";
import { TMed, TMedsList, useMeds } from "../../context/MedDirProvider";
import { BodyTableMeds } from "./BodyTableMed";
import NotMedFound from "./NotMedFound";

type TableMedProps = {
  medsList: TMedsList;
  limit: number;
  setLimit: (limit: number) => void;
  offset: number;
  setOffset: (offset: number) => void;
  handleSort?: (field: keyof TMed) => void;
  handleRowClick: (med: TMed) => void
  onEdit?: () => void
};

export const TableMed = ({
  medsList,
  limit,
  offset,
  onEdit,
  handleRowClick,
  setLimit,
  setOffset,
  handleSort,
}: TableMedProps): JSX.Element => {
  const { t } = useTranslation();
  const i18nMedsTable = (key: string): string =>
    t(`med-directory.table.header.${key}`);

  const isPagination = useMemo(() => medsList?.count > 10, [medsList]);

  const columns = [
    {
      id: "brandName",
      label: i18nMedsTable("brandName"),
      icon: "swap_vert",
      onclick: () => handleSort?.('brand_name'),
    },

    {
      id: "dose&unit",
      label: i18nMedsTable("dose&unit"),
    },
    {
      id: "concentration",
      label: i18nMedsTable("concentration"),
    },
    {
      id: "",
      label: '',
    },

  ];

  const {
    loadingMed
  } = useMeds()

  return (
    <div className="relative">
      <div>
        <Table columns={columns}>
          {!loadingMed && medsList.count === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                <NotMedFound />
              </td>
            </tr>
          ) : (
            <BodyTableMeds
              handleRowClick={handleRowClick}
              rows={medsList.results}
              isPagination={isPagination}
              isLoadingSendInvitation={false}
              onEdit={onEdit}
            />
          )}
        </Table>
        {isPagination && (
          <PaginationTable
            limit={limit}
            setLimit={setLimit}
            total={medsList?.count ?? 0}
            offset={offset}
            setOffset={setOffset}

          />
        )}
      </div>
    </div>
  );
};
