import type { JSX } from "react";
import { cn } from "../../lib/utils";
import { FullNameCeil } from "./FullNameCeil";
import { TooltipCell } from "../table/TooltipCell";
import Badge from "../shared/ui/Badge";
import { TUser } from "../../types/userTypes";
import Button from "../shared/ui/Button/baseBtn";
import { IconMaterial } from "../shared/iconMaterial/IconMaterial";

type BodyTableProps = {
  id?: string | null;
  rows: TUser[];
  isPagination?: boolean;
  isLoadingSendInvitation: boolean;
  onRowClick?: (id: string) => void;
  handleClickInviteButton: (id: string) => void;
  rowClick: (user: TUser) => void;
};

export const BodyTableUsers = ({
  rows,
  isPagination,
  rowClick,
}: BodyTableProps): JSX.Element => {
  const baseCellClassName = cn(
    "p-[12px] typo-body-small-medium-14 text-black text-sm text-primary-light",
    "align-middle min-w-0",
  );

  const handleSelectUser = (user: TUser) => {
    if (user.is_active) {
      rowClick(user);
    }
  }

  return (
    <>
      {rows.map((user, index) => {
        if (user === undefined || user === null) return null;
        return (
          <tr onClick={() => { handleSelectUser(user) }} key={user.id} className="cursor-pointer group">
            <td
              className={cn(
                baseCellClassName,
                isPagination === false &&
                index === rows.length - 1 &&
                "rounded-bl-2xl",
              )}
            >
              <FullNameCeil size="sm" showRole={false} className="group-hover:bg-red-100 bg-background-light-gray" user={user} />
            </td>

            <td
              className={cn(
                baseCellClassName,
                user.email === undefined ||
                (user.email === null &&
                  "text-black"),
              )}
            >
              <TooltipCell
                content={user.email}
              />
            </td>
            <td
              className={cn(
                baseCellClassName,
                user.phone === undefined ||
                (user.phone === null &&
                  "text-black"),
              )}
            >
              <TooltipCell
                content={user.phone as string}
              />
            </td>
            <td
              className={cn(
                baseCellClassName,
                user.clinic_role === undefined ||
                (user.clinic_role === null &&
                  "text-black"),
              )}
            >
              <TooltipCell
                content={user.clinic_role}
              />
            </td>

            <td
              className={baseCellClassName}
            >
              <Badge status={user.is_active} />
            </td>
            <td
              className={baseCellClassName}
            >
              <Button className="bg-white border text-black" size="xs">
                <IconMaterial
                  filled
                  icon='more_vert'
                  className="cursor-pointer"
                  size={16}
                  iconColor="text-black"
                />
              </Button>
            </td>
          </tr>
        );
      })}
    </>
  );
};