import { useMemo, useState } from 'react';
import Header from '../../components/header/Header';
import { TableUsers } from '../../components/table-user/TableUser';
import { TUser, useUsers } from '../../context/UsersProvider';
import { useDashboard } from '../../context/DashboardProvider';

export default function Users() {
  const { usersList, limit, setLimit, offset, setOffset } = useUsers();
  const [sortConfig, setSortConfig] = useState<{
    field: keyof TUser | null;
    direction: 'asc' | 'desc';
  }>({
    field: null,
    direction: 'asc',
  });

  const handleSort = (field: keyof TUser) => {
    setSortConfig((prev) => {
      const direction = prev.direction === 'asc' ? 'desc' : 'asc';
      return { field, direction };
    });
  };

  const paginatedUsersList = useMemo(() => {
    const sortedUsers = [...usersList.results];
    if (sortConfig.field) {
      sortedUsers.sort((a, b) => {
        const aVal = a?.[sortConfig.field!];
        const bVal = b?.[sortConfig.field!];

        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();

        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return {
      ...usersList,
      results: sortedUsers,
    };
  }, [usersList, sortConfig, offset, limit]);

  return (
    <div className="relative h-screen flex flex-col overflow-hidden">
      <Header
        title="Users" 
        create={'/users/creating/new'} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto mt-5">
          <TableUsers
            offset={offset}
            setOffset={setOffset}
            handleSort={handleSort}
            setLimit={setLimit}
            usersList={paginatedUsersList}
            limit={limit}
          />
        </div>
      </div>
    </div>
  );
}