import { type JSX } from "react";
import { cn, parseDateString } from "../../lib/utils";
import { TooltipCell } from "../table/TooltipCell";
import Button from "../shared/ui/Button/baseBtn";
import { IconMaterial } from "../shared/iconMaterial/IconMaterial";
import DropdownMenu from "../dropdown/DropDownMenu";
import { TDevice } from "../../types/deviceTypes";
import { useDevices } from "../../hooks/useDevices";
import Badge from "../shared/ui/Badge";


type BodyTableProps = {
  id?: string | null;
  rows: TDevice[];
  handleRowClick: (device: TDevice) => void
  isPagination?: boolean;
  isLoadingSendInvitation: boolean;
  onRowClick?: (id: string) => void;
  handleClickInviteButton: (id: string) => void;
};

export const BodyTableDevices = ({
  rows,
  isPagination,
  handleRowClick,
}: BodyTableProps): JSX.Element => {
  const baseCellClassName = cn(
    "p-[12px] typo-body-small-deviceium-14 text-black text-sm text-primary-light",
    "align-middle min-w-0",
  );
  const {
    selectedDevice
  } = useDevices()
  return (
    <>
      {rows.map((device, index) => {
        return (
          <tr
            key={device.id}
            onClick={() => handleRowClick(device)}
            className={`cursor-pointer hover:bg-gray-50
            ${selectedDevice?.id === device?.id ? 'bg-background-light-gray' : ''}`}
          >
            <td
              className={cn(
                baseCellClassName,
                "relative overflow-hidden",
                selectedDevice?.id === device?.id ? "border-l-[2px] border-primeblue" : ""
              )}
            >
              <div className="rounded-l-lg flex items-center group h-full w-full">
                {device.name}
                <IconMaterial
                  filled
                  icon="chevron_right"
                  className="cursor-pointer hidden group-hover:block"
                  size={16}
                  iconColor="var(--tokens-text-secondary-text)" />
              </div>
            </td>

            <td className={cn(baseCellClassName)}>
              <TooltipCell content={device.manufacturer} />
            </td>

            <td className={cn(baseCellClassName)}>
              <TooltipCell content={device.model} />
            </td>

            <td className={cn(baseCellClassName)}>
              <TooltipCell content={device.department} />
            </td>

            <td className={cn(baseCellClassName)}>
              <TooltipCell content={parseDateString(device.created_stamp as unknown as string).toLocaleString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })} />
            </td>
            <td className={cn(baseCellClassName)}>
              <Badge
                status={device.status}
              />
               
            </td>
            <td className={cn(baseCellClassName)}>
            <TooltipCell content={parseDateString(device.last_health_check as unknown as string).toLocaleString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })} />
            </td>

          </tr>

        );
      })}
    </>
  );
};
