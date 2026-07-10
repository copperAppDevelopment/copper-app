import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/authStore';

const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.50.5:3001';

const fetchDashboard = async (token?: string) => {
  if (!token) return null;
  const response = await fetch(`${apiUrl}/api/v1/residents/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Error al cargar dashboard');
  const json = await response.json();
  return json.data;
};

const fetchBalances = async (token?: string) => {
  if (!token) return [];
  const response = await fetch(`${apiUrl}/api/v1/residents/balances`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Error al cargar balances');
  const json = await response.json();
  return json.data;
};

const fetchNotifications = async (token?: string) => {
  if (!token) return [];
  const response = await fetch(`${apiUrl}/api/v1/residents/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Error al cargar notificaciones');
  const json = await response.json();
  return json.data;
};

const fetchRequests = async (token?: string) => {
  if (!token) return [];
  const response = await fetch(`${apiUrl}/api/v1/residents/requests`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Error al cargar solicitudes');
  const json = await response.json();
  return json.data;
};

export function useDashboardData() {
  const token = useAuthStore((state) => state.session?.access_token);
  const queryClient = useQueryClient();

  const { data: dashboard, isLoading: loadingDash, isError: errorDash } = useQuery({
    queryKey: ['dashboard', token],
    queryFn: () => fetchDashboard(token),
    enabled: !!token,
  });

  const { data: balances, isLoading: loadingBal, isError: errorBal } = useQuery({
    queryKey: ['balances', token],
    queryFn: () => fetchBalances(token),
    enabled: !!token,
  });

  const { data: notifications, isLoading: loadingNotif, isError: errorNotif } = useQuery({
    queryKey: ['notifications', token],
    queryFn: () => fetchNotifications(token),
    enabled: !!token,
  });

  const { data: requests, isLoading: loadingReq, isError: errorReq } = useQuery({
    queryKey: ['requests', token],
    queryFn: () => fetchRequests(token),
    enabled: !!token,
  });

  const isLoading = loadingDash || loadingBal || loadingNotif || loadingReq;
  const isError = errorDash || errorBal || errorNotif || errorReq;

  const refetchAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['dashboard', token] }),
      queryClient.invalidateQueries({ queryKey: ['balances', token] }),
      queryClient.invalidateQueries({ queryKey: ['notifications', token] }),
      queryClient.invalidateQueries({ queryKey: ['requests', token] }),
    ]);
  };

  return {
    dashboard,
    balances,
    notifications,
    requests,
    isLoading,
    isError,
    refetchAll,
  };
}
