const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Observar todos los archivos en el monorepo para seguir enlaces simbólicos
config.watchFolders = [workspaceRoot];

// 2. Configurar rutas de búsqueda de node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Aquí vivía un `resolveRequest` que forzaba todo import de 'react' al node_modules local,
// porque la móvil iba en React 18 mientras el resto del monorepo ya estaba en React 19.
// Desde Expo SDK 53 la móvil también usa React 19: sobra, y mantenerlo congelaría la
// resolución en una copia vieja.

module.exports = config;
