import { rutasRecursoResidente } from '@/lib/recursosResidente';

export const { POST, PATCH, DELETE } = rutasRecursoResidente({
  tabla: 'mascotas',
  articulo: 'la mascota',
  mensajeBorrado: 'Mascota eliminada con éxito.',
  obligatorios: ['nombre', 'especie', 'tamano'],
  aFila: body => ({
    nombre: body.nombre,
    raza: body.raza || null,
    especie: body.especie,
    tamano: body.tamano,
  }),
});
