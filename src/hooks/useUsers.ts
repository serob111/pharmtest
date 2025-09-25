import { useState, useCallback } from 'react';
import { UserService, UserFilters, CreateUserData } from '../services/userService';
import { TUser, TUsersList, TRole } from '../context/UsersProvider';
import { useAsync } from './useAsync';

export function useUsers() {
  const [selectedProfile, setSelectedProfile] = useState<TUser>({} as TUser);
  const [alertMsgs, setAlertMsgs] = useState<Partial<Record<string, string[]>>>({});

  // Users list with filters
  const [filters, setFilters] = useState<UserFilters>({ limit: 10, offset: 0 });
  const {
    data: usersList,
    loading: usersLoading,
    error: usersError,
    execute: refetchUsers
  } = useAsync(
    () => UserService.getUsers(filters),
    [filters]
  );

  // User roles
  const {
    data: rolesData,
    loading: rolesLoading,
    execute: fetchRoles
  } = useAsync(
    () => UserService.getUserRoles(),
    [],
    { immediate: false }
  );

  const updateFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const createUser = useCallback(async (data: CreateUserData) => {
    try {
      const newUser = await UserService.createUser(data);
      refetchUsers();
      return newUser;
    } catch (error: any) {
      setAlertMsgs(error.response?.data || {});
      throw error;
    }
  }, [refetchUsers]);

  const updateUserFullName = useCallback(async ({ id, firstName, lastName }: { id: number, firstName: string, lastName: string }) => {
    try {
      const updated = await UserService.updateUserName({ id, firstName, lastName });
      setSelectedProfile(updated);
      setAlertMsgs({});
      return updated;
    } catch (error: any) {
      setAlertMsgs(error.response?.data || {});
      throw error;
    }
  }, []);

  const updateUserPhoneNumber = useCallback(async ({ id, phone }: { id: number, phone: string }) => {
    try {
      const updated = await UserService.updateUserPhone(id, phone);
      setSelectedProfile(updated);
      setAlertMsgs({});
      return updated;
    } catch (error: any) {
      setAlertMsgs(error.response?.data || {});
      throw error;
    }
  }, []);

  const updateUserRole = useCallback(async ({ id, role }: { id: number, role: string | number }) => {
    try {
      const updated = await UserService.updateUserRole(id, role);
      setSelectedProfile(updated);
      setAlertMsgs({});
      return updated;
    } catch (error: any) {
      setAlertMsgs(error.response?.data || {});
      throw error;
    }
  }, []);

  const updateUserStatus = useCallback(async ({ id }: { id: number }) => {
    try {
      const updated = await UserService.updateUserStatus(id);
      setSelectedProfile(updated);
      setAlertMsgs({});
      return updated;
    } catch (error: any) {
      setAlertMsgs(error.response?.data || {});
      throw error;
    }
  }, []);

  return {
    // Data
    usersList: usersList || { count: 0, results: [] },
    roles: rolesData?.results || [],
    selectedProfile,
    alertMsgs,

    // Loading states
    usersLoading,
    rolesLoading,

    // Actions
    setSelectedProfile,
    updateFilters,
    createUser,
    updateUserFullName,
    updateUserPhoneNumber,
    updateUserRole,
    updateUserStatus,
    fetchRoles,
    refetchUsers,
    setAlertMsgs,

    // Pagination helpers
    setLimit: (limit: number) => updateFilters({ limit, offset: 0 }),
    setOffset: (offset: number) => updateFilters({ offset }),
    limit: filters.limit || 10,
    offset: filters.offset || 0,
  };
}