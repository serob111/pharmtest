import { type JSX } from "react";
import { cn, parseDateString } from "../../lib/utils";
import { TooltipCell } from "../table/TooltipCell";
import { IconMaterial } from "../shared/iconMaterial/IconMaterial";
import { TPrescription } from "../../types/prescriptionTypes";
import { usePrescriptions } from "../../hooks/usePrescriptions";
import Badge from "../shared/ui/Badge";


type BodyTableProps = {
  id?: string | null;
  rows: TPrescription[];
  handleRowClick: (prescription: TPrescription) => void
  isPagination?: boolean;
  isLoadingSendInvitation: boolean;
  onRowClick?: (id: string) => void;
  handleClickInviteButton: (id: string) => void;
};

export const BodyTablePrescriptions = ({
  rows,
  handleRowClick,
}: BodyTableProps): JSX.Element => {
  const baseCellClassName = cn(
    "p-[12px] typo-body-small-medium-14 text-black text-sm text-primary-light",
    "align-middle min-w-0",
  );
  const {
    selectedPrescription
  } = usePrescriptions()
  return (
    <>
      {rows.map((prescription, index) => {
        return (
          <tr
            key={index}
            onClick={() => handleRowClick(prescription)}
            className={`cursor-pointer hover:bg-gray-50
            ${selectedPrescription?.prescription_id === prescription?.prescription_id ? 'bg-background-light-gray' : ''}`}
          >
            <td
              className={cn(
                baseCellClassName,
                "relative overflow-hidden",
                selectedPrescription?.prescription_id === prescription?.prescription_id ? "border-l-[2px] border-primeblue" : ""
              )}
            >
              <div className="rounded-l-lg flex items-center group h-full w-full">
                {prescription.prescription_id}
                <IconMaterial
                  filled
                  icon="chevron_right"
                  className="cursor-pointer hidden group-hover:block"
                  size={16}
                  iconColor="var(--tokens-text-secondary-text)" />
              </div>
            </td>

            <td className={cn(baseCellClassName)}>
              <TooltipCell content={
                parseDateString(prescription.created_stamp as unknown as string).toLocaleString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                })
              } />
            </td>

            <td className={cn(baseCellClassName)}>
              <Badge
                status={prescription.status}
              />
            </td>

            <td className={cn(baseCellClassName)}>
              <TooltipCell content={prescription.his_created_date} />
            </td>

           
            <td className={cn(baseCellClassName)}>
              <TooltipCell content={prescription.his_hospital_pharmacy_stock_id} />
            </td>

          </tr>

        );
      })}
    </>
  );
};
