import type { JSX } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Table } from "../../components/table/Table";
import { PaginationTable } from "../../components/table/PaginationTable";
import { BodyTableUsers } from "./BodyTableUsers";
import { TUser, TUsersList } from "../../context/UsersProvider";

type TableUsersProps = {
  usersList: TUsersList;
  limit: number;
  setLimit: (limit: number) => void;
  offset: number;
  setOffset: (offset: number) => void;
  handleSort?: (field: keyof TUser) => void;
};

export const TableUsers = ({
  usersList,
  limit,
  offset,
  setLimit,
  setOffset,
  handleSort,
}: TableUsersProps): JSX.Element => {
  const { t } = useTranslation();
  const i18nUsersTable = (key: string): string =>
    t(`users.table.header.${key}`);

  const isPagination = useMemo(() => usersList.count > 10, [usersList]);

  const columns = [
    {
      id: "fullName",
      label: i18nUsersTable("fullName"),
      icon: "swap_vert",
      onclick: () => handleSort?.('first_name'),
    },

    {
      id: "email",
      label: i18nUsersTable("email"),
    },
    {
      id: "phone",
      label: i18nUsersTable("phone"),
      icon: "swap_vert",
      onclick: () => handleSort?.('phone'),
    },
    {
      id: "role",
      label: i18nUsersTable("role"),
      icon: "swap_vert",
      onclick: () => handleSort?.('clinic_role'),
    },
    {
      id: "status",
      label: i18nUsersTable("status"),
      icon: "swap_vert",
      onclick: () => handleSort?.('is_active'),
    },
    {
      id: "more_icon",
      label: '',
      style: {
        width: "60px",
      },
      // onclick: ()=>handleSort,
    },
  ];


  return (
    <div className="relative">

      <Table columns={columns}>
        {usersList.count === 0 ? (
          <tr>
            <td colSpan={columns.length} className="text-center py-4">
              No matches found
            </td>
          </tr>
        ) : (
          <BodyTableUsers
            rows={usersList.results}
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
          total={usersList?.count ?? 0}
          offset={offset}
          setOffset={setOffset}
        />
      )}
    </div>
  );
};
