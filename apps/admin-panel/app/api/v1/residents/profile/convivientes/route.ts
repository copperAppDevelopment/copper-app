import { rutasRecursoResidente } from '@/lib/recursosResidente';

export const { POST, PATCH, DELETE } = rutasRecursoResidente({
  tabla: 'convivientes',
  articulo: 'el familiar',
  mensajeBorrado: 'Familiar eliminado con éxito.',
  obligatorios: ['nombres', 'apellidos', 'parentesco'],
  aFila: body => ({
    nombres: body.nombres,
    apellidos: body.apellidos,
    parentesco: body.parentesco,
    fecha_nacimiento: body.fecha_nacimiento || null,
  }),
});
