/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Un `next build` escribe en el mismo `.next/` que usa `next dev`, y deja al servidor de
  // desarrollo pidiendo chunks que ya no existen (404 en main-app.js). Con
  // `NEXT_DIST_DIR=.next-verify next build` se puede verificar sin pisarlo.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  transpilePackages: ['@copper/database'],
  // `@react-pdf/renderer` solo corre en el servidor, al generar la cuenta de cobro. Sin esto
  // el bundler intenta empaquetarlo para el navegador y arrastra sus dependencias de Node.
  serverExternalPackages: ['@react-pdf/renderer'],
  // pdfkit carga las fuentes estándar a la carta y con un alias de su `package.json`
  // (`require('#standard-fonts/Helvetica')`). El rastreo de archivos de Next no sigue ese
  // `require`, así que en Vercel el paquete de la función salía sin `Helvetica.cjs` y la cuenta
  // de cobro fallaba con MODULE_NOT_FOUND. En local no se nota: `node_modules` está entero.
  //
  // Solo para la ruta que genera el PDF. La ruta del store de pnpm va con comodín para no
  // atarse a la versión de pdfkit.
  outputFileTracingIncludes: {
    '/api/v1/residents/cuenta-cobro': [
      '../../node_modules/.pnpm/pdfkit@*/node_modules/pdfkit/js/standard-fonts/**/*',
    ],
  },
  devIndicators: false,
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
