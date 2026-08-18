import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/authStore';

const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.50.5:3001';

const fetchProfile = async (token?: string) => {
  if (!token) return null;
  const response = await fetch(`${apiUrl}/api/v1/residents/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Error al cargar perfil');
  const json = await response.json();
  return json.data;
};

export function useProfileData() {
  const token = useAuthStore((state) => state.session?.access_token);
  const queryClient = useQueryClient();

  // 1. GET Query
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', token],
    queryFn: () => fetchProfile(token),
    enabled: !!token,
  });

  // Helper de invalidación general
  const invalidateProfile = async () => {
    await queryClient.invalidateQueries({ queryKey: ['profile', token] });
    await queryClient.invalidateQueries({ queryKey: ['dashboard', token] });
  };

  // 2. PATCH Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (payload: {
      nombres: string;
      apellidos: string;
      phone_number?: string;
      tipo_documento: string;
      documento: string;
    }) => {
      const response = await fetch(`${apiUrl}/api/v1/residents/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Error al actualizar perfil');
      return json.data;
    },
    onSuccess: invalidateProfile,
  });

  // 3. POST Upload Photo Mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: async (payload: { fileBase64: string; filename: string }) => {
      const response = await fetch(`${apiUrl}/api/v1/residents/profile/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Error al subir foto');
      return json.relativePath;
    },
    onSuccess: invalidateProfile,
  });

  // --- CRUD Convivientes Mutations ---
  const convivienteMutation = useMutation({
    mutationFn: async (payload: {
      action: 'create' | 'update' | 'delete';
      id?: number;
      nombres?: string;
      apellidos?: string;
      parentesco?: string;
      fecha_nacimiento?: string;
    }) => {
      let method = 'POST';
      let url = `${apiUrl}/api/v1/residents/profile/convivientes`;
      if (payload.action === 'update') method = 'PATCH';
      if (payload.action === 'delete') {
        method = 'DELETE';
        url = `${url}?id=${payload.id}`;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: payload.action !== 'delete' ? JSON.stringify(payload) : undefined,
      });

      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Error al guardar familiar');
      return json.data;
    },
    onSuccess: invalidateProfile,
  });

  // --- CRUD Vehicles Mutations ---
  const vehicleMutation = useMutation({
    mutationFn: async (payload: {
      action: 'create' | 'update' | 'delete';
      id?: number;
      marca?: string;
      modelo?: string;
      placa?: string;
      color?: string;
      tipo_vehiculo?: string;
    }) => {
      let method = 'POST';
      let url = `${apiUrl}/api/v1/residents/profile/vehicles`;
      if (payload.action === 'update') method = 'PATCH';
      if (payload.action === 'delete') {
        method = 'DELETE';
        url = `${url}?id=${payload.id}`;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: payload.action !== 'delete' ? JSON.stringify(payload) : undefined,
      });

      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Error al guardar vehículo');
      return json.data;
    },
    onSuccess: invalidateProfile,
  });

  // --- CRUD Pets Mutations ---
  const petMutation = useMutation({
    mutationFn: async (payload: {
      action: 'create' | 'update' | 'delete';
      id?: number;
      nombre?: string;
      raza?: string;
      especie?: string;
      tamano?: string;
    }) => {
      let method = 'POST';
      let url = `${apiUrl}/api/v1/residents/profile/pets`;
      if (payload.action === 'update') method = 'PATCH';
      if (payload.action === 'delete') {
        method = 'DELETE';
        url = `${url}?id=${payload.id}`;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: payload.action !== 'delete' ? JSON.stringify(payload) : undefined,
      });

      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Error al guardar mascota');
      return json.data;
    },
    onSuccess: invalidateProfile,
  });

  // --- CRUD Employees Mutations ---
  const employeeMutation = useMutation({
    mutationFn: async (payload: {
      action: 'create' | 'update' | 'delete';
      id?: number;
      nombres?: string;
      apellidos?: string;
      cargo?: string;
      documento_ident?: string;
      tipo_documento?: string;
    }) => {
      let method = 'POST';
      let url = `${apiUrl}/api/v1/residents/profile/employees`;
      if (payload.action === 'update') method = 'PATCH';
      if (payload.action === 'delete') {
        method = 'DELETE';
        url = `${url}?id=${payload.id}`;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: payload.action !== 'delete' ? JSON.stringify(payload) : undefined,
      });

      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Error al guardar empleado');
      return json.data;
    },
    onSuccess: invalidateProfile,
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    uploadPhoto: uploadPhotoMutation.mutateAsync,
    isUploadingPhoto: uploadPhotoMutation.isPending,

    // Convivientes
    convivienteMutate: convivienteMutation.mutateAsync,
    isConvivienteMutating: convivienteMutation.isPending,

    // Vehículos
    vehicleMutate: vehicleMutation.mutateAsync,
    isVehicleMutating: vehicleMutation.isPending,

    // Mascotas
    petMutate: petMutation.mutateAsync,
    isPetMutating: petMutation.isPending,

    // Empleados
    employeeMutate: employeeMutation.mutateAsync,
    isEmployeeMutating: employeeMutation.isPending,
  };
}
