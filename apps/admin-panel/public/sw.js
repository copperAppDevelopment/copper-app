// Service worker del panel. Existe para que el panel se pueda instalar y para mostrar una
// pantalla «Sin conexión» en vez del error del navegador.
//
// A propósito NO guarda en caché nada más: el panel muestra saldos y datos personales que
// cambian todo el tiempo, y un dato viejo o guardado en el dispositivo es peor que ninguno.
// Solo se interceptan las navegaciones; la API, Supabase y los archivos de `_next` van
// directo a la red.
//
// Al cambiar `offline.html` o este archivo, sube la versión para que se descarte la caché vieja.
const CACHE = "copper-offline-v1";
const PAGINA_OFFLINE = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll([PAGINA_OFFLINE, "/icons/icon-192.png"]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((c) => c !== CACHE).map((c) => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(PAGINA_OFFLINE))
  );
});
