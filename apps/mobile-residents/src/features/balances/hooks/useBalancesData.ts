import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/authStore';

const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.50.5:3001';

const fetchIndicators = async (token?: string) => {
  if (!token) return null;
  const response = await fetch(`${apiUrl}/api/v1/residents/balances/indicators`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Error al cargar indicadores');
  const json = await response.json();
  return json.data;
};

const fetchHistory = async (token?: string, sortBy: string = 'recent', type: string = 'all') => {
  if (!token) return [];
  const response = await fetch(
    `${apiUrl}/api/v1/residents/balances/history?sortBy=${sortBy}&type=${type}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) throw new Error('Error al cargar historial');
  const json = await response.json();
  return json.data;
};

export function useBalancesData() {
  const token = useAuthStore((state) => state.session?.access_token);

  // Estados locales de filtrado
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');
  const [type, setType] = useState<'all' | 'PAGO' | 'CARGO'>('all');

  // Query para indicadores financieros
  const { data: indicators, isLoading: loadingInd } = useQuery({
    queryKey: ['balancesIndicators', token],
    queryFn: () => fetchIndicators(token),
    enabled: !!token,
  });

  // Query para historial de movimientos
  const { data: history, isLoading: loadingHist } = useQuery({
    queryKey: ['balancesHistory', token, sortBy, type],
    queryFn: () => fetchHistory(token, sortBy, type),
    enabled: !!token,
  });

  const isLoading = loadingInd || loadingHist;

  return {
    indicators,
    history,
    sortBy,
    setSortBy,
    type,
    setType,
    isLoading,
  };
}
