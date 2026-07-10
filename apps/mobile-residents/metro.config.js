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

// 3. Interceptar solicitudes de resolución de React de forma estricta
// Esto redirige obligatoriamente cualquier import de 'react' al node_modules local de la app móvil (React 18)
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react' || moduleName.startsWith('react/')) {
    const localReactPath = path.resolve(projectRoot, 'node_modules', moduleName);
    return context.resolveRequest(context, localReactPath, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

// 4. Aliases de respaldo adicionales
config.resolver.extraNodeModules = {
  'react': path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
};

module.exports = config;
