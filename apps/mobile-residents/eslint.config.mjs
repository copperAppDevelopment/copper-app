import tseslint from "typescript-eslint";

/**
 * Por ahora solo vigila el tamaño de los archivos (ver «Convenciones de Código» en el README).
 * Se usa únicamente el parser de TypeScript, sin reglas recomendadas: activarlas de golpe
 * llenaría el lint de avisos ajenos a esta regla.
 */
export default tseslint.config(
  {
    ignores: ["node_modules/", ".expo/", "android/", "ios/", "dist/", "expo-env.d.ts"],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: { parser: tseslint.parser },
    rules: {
      "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    // Deuda heredada: ya superaban el límite cuando se activó la regla. Se quitan de esta lista
    // al dividirlos; no se agregan archivos nuevos.
    files: ["app/(tabs)/miPerfil.tsx", "app/chatRoom.tsx", "app/register.tsx"],
    rules: { "max-lines": "off" },
  },
);
