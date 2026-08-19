import { rutasRecursoResidente } from '@/lib/recursosResidente';

export const { POST, PATCH, DELETE } = rutasRecursoResidente({
  tabla: 'empleados_servicio',
  articulo: 'el empleado de servicio',
  mensajeBorrado: 'Empleado de servicio eliminado con éxito.',
  // `apellidos` no es obligatorio aquí, a diferencia de convivientes.
  obligatorios: ['nombres', 'cargo', 'documento_ident', 'tipo_documento'],
  aFila: body => ({
    nombres: body.nombres,
    apellidos: body.apellidos || null,
    cargo: body.cargo,
    documento_ident: body.documento_ident,
    tipo_documento: body.tipo_documento,
  }),
});
