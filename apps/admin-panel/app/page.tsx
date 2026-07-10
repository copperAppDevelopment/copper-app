import React from 'react';

export default function AdminPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-radial from-slate-900 via-slate-950 to-black text-center">
      <div className="z-10 max-w-4xl w-full items-center justify-between font-mono text-sm flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-slate-800 bg-gradient-to-b from-slate-900/50 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-slate-900/30 lg:p-4">
          Panel de Administración & API &nbsp;
          <code className="font-bold text-amber-500">v1.0.0</code>
        </p>
      </div>

      <div className="relative flex flex-col items-center justify-center my-16">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-orange-400 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
          Copper Admin
        </h1>
        <p className="mt-4 text-slate-400 text-lg md:text-xl max-w-md">
          Sistema de backend centralizado y panel administrativo de propiedad horizontal en Colombia.
        </p>
      </div>

      <div className="grid text-left lg:max-w-5xl lg:w-full lg:grid-cols-3 gap-6">
        <div className="group rounded-2xl border border-slate-800 bg-slate-900/20 px-5 py-4 transition-colors hover:border-slate-700 hover:bg-slate-900/40">
          <h2 className="mb-3 text-2xl font-semibold text-amber-400">
            API Endpoints{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm text-slate-400">
            Rutas REST listas para ser consumidas por la app de React Native y Astro.
          </p>
        </div>

        <div className="group rounded-2xl border border-slate-800 bg-slate-900/20 px-5 py-4 transition-colors hover:border-slate-700 hover:bg-slate-900/40">
          <h2 className="mb-3 text-2xl font-semibold text-amber-400">
            Supabase Client{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm text-slate-400">
            Conectado de forma compartida con el paquete local `@copper/database`.
          </p>
        </div>

        <div className="group rounded-2xl border border-slate-800 bg-slate-900/20 px-5 py-4 transition-colors hover:border-slate-700 hover:bg-slate-900/40">
          <h2 className="mb-3 text-2xl font-semibold text-amber-400">
            Feature Architecture{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm text-slate-400">
            Código desacoplado por características de negocio listas para escalar.
          </p>
        </div>
      </div>
    </main>
  );
}
