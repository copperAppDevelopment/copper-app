# Documentación para migración Expo SDK 52 → actual (soporte 16 KB + OneSignal)

Investigación hecha el 10 de septiembre de 2026 para completar el corte de conocimiento del agente (mayo 2026) antes de que ejecute la migración. Todas las cifras de versiones vienen del registro de npm en tiempo real y de los changelogs oficiales de Expo/OneSignal.

## 1. Estado del requisito de Google (ya es obligatorio, no hay más prórroga)

- Google exigió apps nuevas/actualizaciones en Android 15+ (API 35+) desde el **31 de agosto de 2025**.
- El soporte de páginas de 16 KB pasó a ser obligatorio el **1 de noviembre de 2025**, con una prórroga que algunos desarrolladores pudieron solicitar hasta el **31 de mayo de 2026**.
- Esa prórroga ya venció. A fecha de hoy (10 sept 2026) el requisito es obligatorio sin excepción, así que el Error 2 que reporta Play Store ya no admite postergarlo.

Fuente: [Google Play Developer Community — clarificación sobre la prórroga del 31 de mayo de 2026](https://support.google.com/googleplay/android-developer/thread/369751886/clarification-on-16-kb-page-size-extension-and-monitoring-for-issues-before-may-31-2026?hl=en)

## 2. Versión de Expo SDK vigente

| SDK | React Native | React | Fecha de release | Notas clave |
|---|---|---|---|---|
| 52 (actual del proyecto) | 0.76 | 18 | nov 2024 | Sin soporte 16 KB |
| 53 | 0.79 | 19 | abr 2025 | New Architecture **default** (aún se puede desactivar); primer SDK con soporte 16 KB completo desde `expo@53.0.14` |
| 54 | 0.81 | 19.1 | ago 2025 | Última versión que todavía admite Legacy Architecture; aviso oficial de que SDK 55 la elimina |
| 55 | 0.83 | 19.2 | feb 2026 | Legacy Architecture **eliminada por completo**; `newArchEnabled` se quita de `app.json` (ya no es una opción) |
| 56 | 0.85 | 19.2 | may 2026 | Hermes v1 default; Node mínimo 20.19.4; Xcode mínimo 26.4; cambios breaking (ver abajo) |
| **57 (última estable)** | **0.86** | 19.2 | **30 jun 2026** | Upgrade "mínimo", RN 0.86 declarado sin breaking changes respecto a 0.85 |
| 58 | — | — | en preview (canary del 9-10 sept 2026) | Todavía no estable — no usar como destino de esta migración |

**Recomendación de destino:** Expo SDK 57 (la última estable confirmada por el registro de npm, `expo@57.0.21`, publicada el 8 de sept de 2026). No saltar a SDK 58 mientras siga en preview/canary.

Fuentes: [Expo SDK 53 changelog](https://expo.dev/changelog/sdk-53) · [Expo SDK 54 changelog](https://expo.dev/changelog/sdk-54) · [Expo SDK 55 changelog](https://expo.dev/changelog/sdk-55) · [Expo SDK 56 changelog](https://expo.dev/changelog/sdk-56) · [Expo SDK 57 changelog](https://expo.dev/changelog/sdk-57) · [Expo SDK reference (compatibilidad RN/React/Node)](https://docs.expo.dev/versions/latest/) · npm registry (`expo`, consultado en vivo)

## 3. Guía oficial de upgrade: hacerlo de a un SDK a la vez

La guía oficial de Expo es explícita: **"We recommend upgrading SDK versions incrementally, one at a time"** — no recomienda saltar directo de 52 a 57. Pasos por cada salto:

1. `npm install expo@^<siguiente-sdk>`
2. `npx expo install --fix` y `npx expo-doctor` para alinear todas las dependencias nativas (incluye `react-native-screens`, `react-native-safe-area-context`, `expo-camera`, `expo-image-picker`, `expo-document-picker`, etc. — no hay que fijarlas a mano, `expo install --fix` las pone en la versión que ese SDK espera)
3. Si el proyecto usa Continuous Native Generation (prebuild), borrar `android/` e `ios/` y regenerarlos; si es manual, `npx pod-install`
4. Revisar el changelog de esa versión puntual por breaking changes antes de seguir al siguiente salto

Orden sugerido para este proyecto: **52 → 53 → 54 → 55 → 56 → 57**, compilando y probando en dispositivo real después de cada salto (al menos después de 53, 55 y 57, que son los que traen cambios de arquitectura).

Fuente: [Upgrade Expo SDK - Expo documentation](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)

## 4. New Architecture: dejó de ser opcional

Esto es más grande de lo que parece en el diagnóstico original:

- SDK 53: New Architecture pasa a ser el default, pero `newArchEnabled: false` todavía funciona como opt-out.
- SDK 54: Expo avisa oficialmente que es la **última** versión que soporta Legacy Architecture.
- **SDK 55: Legacy Architecture se elimina del todo.** La clave `newArchEnabled` desaparece de `app.json` porque ya no hay nada que alternar.

Conclusión práctica: el proyecto no puede llegar a SDK 55+ (necesario para el soporte de 16 KB estable y para las versiones recientes de OneSignal) manteniendo `newArchEnabled: false`. Hay que migrar a New Architecture sí o sí, no es negociable ni es un efecto secundario evitable de subir de SDK.

Fuentes: [Expo SDK 53 changelog](https://expo.dev/changelog/sdk-53) · [Expo SDK 54 changelog](https://expo.dev/changelog/sdk-54) · [Expo SDK 55 changelog](https://expo.dev/changelog/sdk-55) · [React Native's New Architecture - Expo Docs](https://docs.expo.dev/guides/new-architecture/)

## 5. react-native-onesignal: versión mínima real para New Architecture

Del `MIGRATION_GUIDE.md` oficial del SDK:

- **react-native-onesignal 5.4.x requiere React Native 0.79+** porque el registro de TurboModules vía `codegenConfig.ios.modulesProvider` se introdujo en RN 0.79 (o sea, Expo SDK 53+).
- Si el proyecto se quedara en RN 0.76–0.78 (Expo 52), la recomendación de OneSignal es quedarse en **5.3.x**, que usa el bridge legacy y funciona con New Architecture solo vía capa de interoperabilidad — pero como este proyecto va a subir a SDK 53+ de todos modos, no aplica quedarse ahí.
- Había un bug reportado (issue #1834, "No token returned after enabling RN new architecture", sobre v5.2.13 en Expo 53) donde el push token volvía `null` en iOS y Android con New Architecture activa. **Ese issue está cerrado** a la fecha de esta investigación.
- Versión más reciente publicada en npm (consultada en vivo, 10 sept 2026): **react-native-onesignal 5.5.11** (release del mismo 10 de sept de 2026). La rama 5.5.x ya trae varios releases posteriores al fix de New Architecture, así que apuntar a `^5.5.11` en vez de fijar la 5.1.3 que tiene el proyecto hoy.

Recomendación concreta: al llegar a SDK 53 en la migración, subir `react-native-onesignal` a la última `5.5.x` (correr `npm view react-native-onesignal version` al momento de ejecutar la migración, porque este paquete publica seguido) y validar el token push en dispositivo real inmediatamente después, ya que ese fue justamente el punto de falla reportado por otros usuarios.

Fuentes: [MIGRATION_GUIDE.md — OneSignal/react-native-onesignal](https://github.com/OneSignal/react-native-onesignal/blob/main/MIGRATION_GUIDE.md) · [Issue #1834](https://github.com/OneSignal/react-native-onesignal/issues/1834) · npm registry (`react-native-onesignal`, consultado en vivo)

## 6. onesignal-expo-plugin: confirmación del `mode`

Se confirma el hallazgo del otro agente: el README oficial del plugin dice explícitamente que `mode` controla el entorno de la entitlement de APNs en iOS:

```json
{
  "plugins": [
    ["onesignal-expo-plugin", { "mode": "production" }]
  ]
}
```

- `"development"` → apunta al sandbox de APNs (solo sirve para builds de desarrollo/TestFlight interno con certificados de desarrollo).
- `"production"` → **obligatorio** para builds que se distribuyen por App Store; si se deja en `"development"` los iPhones que instalan desde la tienda no reciben push, que es exactamente el síntoma que ya vieron con el error "You must configure iOS notifications in your OneSignal settings".

Última versión publicada del plugin (npm, consultada en vivo): **onesignal-expo-plugin 2.7.1**. Vale la pena subirlo también en el mismo paso, no solo cambiar el `mode`.

Fuente: [onesignal-expo-plugin README](https://github.com/OneSignal/onesignal-expo-plugin/blob/main/README.md) · npm registry (`onesignal-expo-plugin`, consultado en vivo)

## 7. react-native-screens / react-native-safe-area-context

No hace falta fijarlas a mano en `package.json`: son dependencias nativas que Expo resuelve automáticamente por SDK con `npx expo install --fix` en cada salto de versión. Últimas versiones publicadas en npm al momento de esta investigación (solo como referencia, no para fijar manualmente): `react-native-screens@4.27.0`, `react-native-safe-area-context@5.9.1`. Si después de `expo install --fix` alguna queda desalineada respecto a lo que Expo Doctor espera, `npx expo-doctor` lo señala explícitamente.

## 8. `kotlinVersion` fijado en `app.json`

No se encontró ningún requisito vigente de fijar `kotlinVersion` a mano vía `expo-build-properties` para el soporte de 16 KB ni para las versiones actuales de SDK: Expo gestiona las versiones compatibles de Kotlin/AGP/NDK internamente por cada SDK. La recomendación práctica es **quitar el pin `"1.9.25"`** al empezar la migración y dejar que cada SDK use su versión de Kotlin por defecto; solo volver a fijarlo si alguna librería nativa específica del proyecto lo exige explícitamente (y en ese caso, fijarlo a la versión que esa librería pida para el SDK de destino, no a la que tenía antes).

## 9. Verificación de alineación de 16 KB antes de subir el artefacto

Confirmado, es el flujo correcto:

```bash
# script oficial de Expo/Android para revisar librerías .so
bash check_elf_alignment.sh /ruta/al-artefacto.apk | grep -E '(arm64-v8a|x86_64).*UNALIGNED'
```

- El script está en el repo de Expo: [`check_elf_alignment.sh`](https://github.com/expo/fyi/blob/main/assets/android-16kb-page-sizes/check_elf_alignment.sh)
- Alternativa sin línea de comandos: Play Console tiene un "App Bundle Explorer" que marca directamente qué librerías nativas del AAB subido no están alineadas.
- Punto de referencia rápido: con `expo@53.0.14` o superior más `npx expo install --fix`, las librerías que vienen de paquetes Expo/RN ya deberían salir alineadas; lo que suele quedar sin alinear son dependencias nativas de terceros que el propio proyecto agregó y que no se actualizan solas (ahí es donde hay que revisar caso por caso, ej. una librería nativa que el proyecto tenga fuera de las mencionadas en el diagnóstico original).

Fuente: [android-16kb-page-sizes.md — expo/fyi](https://github.com/expo/fyi/blob/main/android-16kb-page-sizes.md)

## 10. Resumen para el agente que ejecuta la migración

1. Destino confirmado: **Expo SDK 57** (última estable, no usar SDK 58 mientras esté en preview).
2. Camino: incremental, **52 → 53 → 54 → 55 → 56 → 57**, con `npx expo install --fix` + `npx expo-doctor` en cada salto, y build + prueba en dispositivo real al menos después de los saltos a 53, 55 y 57.
3. New Architecture: se vuelve obligatoria al llegar a SDK 55 (se elimina `newArchEnabled` de `app.json`). Hay que asumir la migración a New Architecture como parte del plan, no como un riesgo aparte — hacerla ya al llegar a SDK 53 en vez de posponerla, para no tener dos migraciones grandes encadenadas.
4. `react-native-onesignal`: subir a la última `5.5.x` (verificar la versión exacta al momento de correr la migración) en cuanto el proyecto esté en RN 0.79+ (SDK 53+). Probar el push token en dispositivo real justo después — fue un punto de falla documentado de otros proyectos en el mismo salto.
5. `onesignal-expo-plugin`: actualizar a la última versión (2.7.1 o superior al momento de migrar) y cambiar `mode` a `"production"` antes de cualquier build de release.
6. `react-native-screens` y `react-native-safe-area-context`: no fijarlas a mano, dejar que `expo install --fix` las resuelva por SDK.
7. `kotlinVersion: "1.9.25"` en `app.json`: quitar el pin al iniciar la migración; solo refijar si una librería puntual lo exige para el SDK de destino.
8. El `@ts-expect-error` por choque de tipos React 18/19 en `_layout.tsx` probablemente se vuelve innecesario en cuanto todo el árbol de dependencias (incluido Expo Router) quede alineado en React 19 (ya en SDK 53) — revisar si se puede quitar después de cada salto, no solo al final.
9. Verificar alineación con `check_elf_alignment.sh` sobre el AAB/APK final antes de subir a Play Store, y como respaldo, revisar el App Bundle Explorer de Play Console.
10. El requisito de Google ya no tiene prórroga vigente (venció el 31 de mayo de 2026), así que no hay margen para posponer el Error 2.