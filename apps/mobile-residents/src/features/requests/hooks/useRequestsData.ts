import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/authStore';

const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.50.5:3001';

interface NewRequestPayload {
  titulo_solicitud: string;
  descripcion: string;
  solicitud_tipo: string;
  ubicacion?: string;
}

const fetchRequests = async (token?: string) => {
  if (!token) return [];
  const response = await fetch(`${apiUrl}/api/v1/residents/requests`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Error al cargar solicitudes');
  const json = await response.json();
  return json.data;
};

const createRequest = async (payload: NewRequestPayload, token?: string) => {
  if (!token) throw new Error('Sesión no encontrada');
  const response = await fetch(`${apiUrl}/api/v1/residents/requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Error al radicar solicitud');
  return json.data;
};

export function useRequestsData() {
  const token = useAuthStore((state) => state.session?.access_token);
  const queryClient = useQueryClient();

  // Consulta de solicitudes
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['requests', token],
    queryFn: () => fetchRequests(token),
    enabled: !!token,
  });

  // Mutación para crear solicitud
  const createMutation = useMutation({
    mutationFn: (payload: NewRequestPayload) => createRequest(payload, token),
    onSuccess: async () => {
      // Invalidar caché de solicitudes y de dashboard para mantener coherencia en las visualizaciones
      await queryClient.invalidateQueries({ queryKey: ['requests', token] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard', token] });
    },
  });

  return {
    requests,
    isLoading,
    error,
    createRequest: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
