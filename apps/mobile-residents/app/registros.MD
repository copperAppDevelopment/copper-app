Esto hay en vista_dashboard_resident:
[
    {
        "user_id": "cb6d56c8-c27b-43a9-8a78-7655e3d32fa0",
        "nombre_completo": "Paula Cabrera",
        "conjunto_id": "55050d2a-5bb7-44ee-a28b-b7194fb15a79",
        "conjunto_nombre": "Lusitania ",
        "apartamento_id": "da5988e4-4cc2-4a78-a925-fe61dfa456f8",
        "numero_apartamento": "1",
        "direccion_apartamento": "Calle 50 #92-56 - casa 1",
        "saldo_total": 1485207.00,
        "saldo_en_contra": 1485207.00,
        "saldo_a_favor": 0,
        "proximo_vencimiento": "2026-06-30",
        "link_pago": "https://www.avalpaycenter.com/wps/portal/portal-de-pagos/web/banco-avvillas/que-puedo-pagar?isCategory=false&idCategory=6",
        "ultimo_pago": "2026-04-13"
    }
]
por ejemplo para esta view en apps\mobile-residents\src\features\dashboard\components\WelcomeCard.tsx se está mostrando el UID del apartamento cuando debería mostrarse numero_apartamento y la dirección concatenadas, así como el nombre del conjunto

esto en solicitudes:
[
    {
        "id": "8096c267-4ed9-4263-9730-2a4f8d09de93",
        "residente_id": "9f4621af-f029-4fac-b432-33952f9671e8",
        "conjunto_id": "55050d2a-5bb7-44ee-a28b-b7194fb15a79",
        "solicitud_tipo": "Plomería",
        "titulo_solicitud": "Fuga en la ducha",
        "descripcion": "hay una fuga en la parte trasera de la ducha cerca a los cables",
        "ubicacion": "Baño",
        "solicitud_prioridad": "baja",
        "fecha_solicitud": "2026-01-27T00:00:00+00:00",
        "fecha_atencion_solicitud": "2026-01-26T19:00:00+00:00",
        "solicitud_estado": "asignadas",
        "asignado_admin_conjunto_id": "aaba3bba-9eb7-4870-8fa3-cf4e1d3eba88",
        "created_at": "2026-01-23T12:11:56.46+00:00",
        "updated_at": "2026-05-05T22:26:17.412+00:00",
        "admin_comentario": "Prueba 2 de comentario - Se asigna Corrección a Andres",
        "fecha_atencion_viable": true,
        "hora_atencion": null,
        "costo": 20000,
        "fecha_preferida": "2026-01-27T00:00:00+00:00"
    },

    Como puedes ver acá se filtra por el residente_id que es diferente al user id por eso yo antes en flutter guardaba en una appstate el id de ese residente al hacer login para usarlo para filtrar

Esto sale en notifications:
    {
        "id": 41,
        "created_at": "2026-01-03T03:59:11.780557+00:00",
        "title": "Notificación de envío.",
        "content": "Tienes un envío pendiente por recoger de Mercado libre",
        "big-Image": null,
        "userIds": [
            "cb6d56c8-c27b-43a9-8a78-7655e3d32fa0"
        ],
        "roles": null,
        "conjunto_id": null,
        "tipo_notificacion": "general",
        "enviado_por": null,
        "fecha_envio": "2026-01-03T03:59:11.780557+00:00",
        "leida": true,
        "visita_id": null,
        "comunicado_id": null
    },
y esto en la vista de saldos por concepto:
[
    {
        "user_id": "cb6d56c8-c27b-43a9-8a78-7655e3d32fa0",
        "residente_id": "9f4621af-f029-4fac-b432-33952f9671e8",
        "apartamento_id": "da5988e4-4cc2-4a78-a925-fe61dfa456f8",
        "concepto_id": "3b4a9761-ad49-4835-9e12-cfd57a262f6a",
        "codigo": "MORA",
        "nombre": "Cobro de mora",
        "total_cargos": 9800.00,
        "total_pagado": 0,
        "saldo": 9800.00,
        "proximo_vencimiento": "2026-07-31"
    },
    {
        "user_id": "cb6d56c8-c27b-43a9-8a78-7655e3d32fa0",
        "residente_id": "9f4621af-f029-4fac-b432-33952f9671e8",
        "apartamento_id": "da5988e4-4cc2-4a78-a925-fe61dfa456f8",
        "concepto_id": "9ccc2251-eb56-46ae-ad5b-db86c2ca2a68",
        "codigo": "ADMIN",
        "nombre": "Cobro de administración",
        "total_cargos": 1475407.00,
        "total_pagado": 0,
        "saldo": 1475407.00,
        "proximo_vencimiento": "2026-06-30"
    }
]