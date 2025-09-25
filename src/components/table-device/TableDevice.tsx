import type { JSX } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Table } from "../table/Table";
import { PaginationTable } from "../table/PaginationTable";
import NotDeviceFound from "./NotDeviceFound";
import { TDevice, TDevicesList } from "../../context/DeviceProvider";
import { BodyTableDevices } from "./BodyTableDevice";
import NotDeviceFilterFound from "./NotDeviceFilterFound";

type TableDeviceProps = {
  filterNotFound: boolean
  devicesList: TDevicesList;
  limit: number;
  setLimit: (limit: number) => void;
  offset: number;
  setOffset: (offset: number) => void;
  handleSort?: (field: keyof TDevice) => void;
  handleRowClick: (device: TDevice) => void
};

export const TableDevice = ({
  devicesList,
  limit,
  offset,
  filterNotFound,
  handleRowClick,
  setLimit,
  setOffset,
  handleSort,
}: TableDeviceProps): JSX.Element => {
  const { t } = useTranslation();
  const i18nDevicesTable = (key: string): string =>
    t(`device-directory.table.header.${key}`);

  const isPagination = useMemo(() => devicesList?.count > 10, [devicesList]);

  const columns = [
    {
      id: "name",
      label: i18nDevicesTable("name"),
      icon: "swap_vert",
      onclick: () => handleSort?.('name'),
    },

    {
      id: "manufacturer",
      label: i18nDevicesTable("manufacturer"),
      icon: "swap_vert",
      onclick: () => handleSort?.('manufacturer'),
    },
    {
      id: "model",
      label: i18nDevicesTable("model"),
    },
    {
      id: "department",
      label: i18nDevicesTable("department"),
      icon: "swap_vert",
      onclick: () => handleSort?.('department'),
    },
    {
      id: "created_stamp",
      label: i18nDevicesTable("created_stamp"),
      icon: "swap_vert",
      onclick: () => handleSort?.('created_stamp'),
    },
    {
      id: "status",
      label: i18nDevicesTable("status"),
      icon: "swap_vert",
      onclick: () => handleSort?.('status'),
    },
    {
      id: "last_health_check",
      label: i18nDevicesTable("last_health_check"),
      icon: "swap_vert",
      onclick: () => handleSort?.('last_health_check'),
    },

  ];


  return (
    <div className="relative">
      <Table columns={columns}>
        {devicesList.count === 0 ? (
          <tr>
            <td colSpan={columns.length} className="text-center py-4">
              {
                filterNotFound ?
                  <NotDeviceFilterFound />
                  :
                  <NotDeviceFound />
              }
            </td>
          </tr>
        ) : (
          <BodyTableDevices
            handleRowClick={handleRowClick}
            rows={devicesList.results}
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
          total={devicesList?.count ?? 0}
          offset={offset}
          setOffset={setOffset}
        />
      )}
    </div>
  );
};
