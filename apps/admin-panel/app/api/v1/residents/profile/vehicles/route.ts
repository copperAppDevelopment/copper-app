import { rutasRecursoResidente } from '@/lib/recursosResidente';

export const { POST, PATCH, DELETE } = rutasRecursoResidente({
  tabla: 'vehiculos',
  articulo: 'el vehículo',
  mensajeBorrado: 'Vehículo eliminado con éxito.',
  obligatorios: ['marca', 'placa', 'tipo_vehiculo'],
  aFila: body => ({
    marca: body.marca,
    modelo: body.modelo || null,
    placa: body.placa,
    color: body.color || null,
    tipo_vehiculo: body.tipo_vehiculo,
  }),
});
