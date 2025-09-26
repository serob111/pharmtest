import { type JSX } from "react";
import { cn } from "../../lib/utils";
import { TooltipCell } from "../table/TooltipCell";
import { IconMaterial } from "../shared/iconMaterial/IconMaterial";
import { TMed } from "../../types/medTypes";
import DropdownMenu from "../dropdown/DropDownMenu";


type BodyTableProps = {
  id?: string | null;
  rows: TMed[];
  handleRowClick: (med: TMed) => void
  isPagination?: boolean;
  isLoadingSendInvitation: boolean;
  onEdit?: () => void;
  selectedMed?: TMed | null;
};

export const BodyTableMeds = ({
  rows,
  handleRowClick,
  onEdit,
  selectedMed
}: BodyTableProps): JSX.Element => {
  const baseCellClassName = cn(
    "p-[12px] typo-body-small-medium-14 text-black text-sm text-primary-light",
    "align-middle min-w-0",
  );
  return (
    <>
      {rows.map((med) => {
        return (
          <tr
            key={med.id}
            onClick={() => handleRowClick(med)}
            className={`cursor-pointer hover:bg-gray-50
            ${selectedMed?.id === med?.id ? 'bg-background-light-gray' : ''}`}
          >
            <td
              className={cn(
                baseCellClassName,
                "relative overflow-hidden",
                selectedMed?.id === med?.id ? "border-l-[2px] border-primeblue" : ""
              )}
            >
              <div className="rounded-l-lg flex items-center group h-full w-full">
                {med.brand_name}
                <IconMaterial
                  filled
                  icon="chevron_right"
                  className="cursor-pointer hidden group-hover:block"
                  size={16}
                  iconColor="var(--tokens-text-secondary-text)" />
              </div>
            </td>

            <td className={cn(baseCellClassName)}>
              <TooltipCell content={med.dose_and_unit} />
            </td>

            <td className={cn(baseCellClassName)}>
              <TooltipCell content={med.concentration} />
            </td>

            <td className={`${baseCellClassName} relative  rounded-r-lg `}>
              <div className="flex justify-end items-center h-full w-full">
                <DropdownMenu
                  onEdit={onEdit}
                  onDetailView={() => handleRowClick(med)}
                />
              </div>
            </td>
          </tr>

        );
      })}
    </>
  );
};
