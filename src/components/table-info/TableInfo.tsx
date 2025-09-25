import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { Table } from "../table/Table";
import { BodyTableInfo } from "./BodyTableInfo";

type TableOrderProps = {
  infoList: any;
};

export const TableInfo = ({
  infoList,
}: TableOrderProps): JSX.Element => {
  const { t } = useTranslation();
  const i18nOrdersTable = (key: string): string =>
    t(`orders-directory.tableinfo.header.${key}`);


  const columns = [
    {
      id: "medicine_name",
      label: i18nOrdersTable("medicine_name"),
    },

    {
      id: "category",
      label: i18nOrdersTable("category"),
    },
    {
      id: "dosage",
      label: i18nOrdersTable("dosage"),
    },
    {
      id: "dosage-unit",
      label: i18nOrdersTable("dosage-unit"),
    },
    {
      id: "amount",
      label: i18nOrdersTable("amount"),
    },
    {
      id: "unit",
      label: i18nOrdersTable("unit"),
    },
    {
      id: "concentration",
      label: i18nOrdersTable("concentration"),
    },
    {
      id: "density",
      label: i18nOrdersTable("density"),
    }
  ];


  return (
    <div className="relative mt-4">
      <Table columns={columns}>
          <BodyTableInfo
            rows={infoList}
          />
      </Table>
    </div>
  );
};
