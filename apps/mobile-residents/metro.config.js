const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

// Desde SDK 54 `expo/metro-config` ya detecta el monorepo por su cuenta y trae sus propios
// `watchFolders`. Solo se le añade la raíz, sin pisar lo que traiga: reemplazar el array
// entero es lo que reportaba `expo-doctor`.
const config = getDefaultConfig(projectRoot);

if (!config.watchFolders.includes(workspaceRoot)) {
  config.watchFolders.push(workspaceRoot);
}

// Aquí vivía un `resolveRequest` que forzaba todo import de 'react' al node_modules local,
// porque la móvil iba en React 18 mientras el resto del monorepo ya estaba en React 19.
// Desde Expo SDK 53 la móvil también usa React 19: sobra, y mantenerlo congelaría la
// resolución en una copia vieja.

module.exports = config;
