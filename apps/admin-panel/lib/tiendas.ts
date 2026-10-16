/**
 * Las fichas de Copper App en las tiendas. Las usan la página de residentes sin acceso web, la
 * de aceptar invitación y el correo de invitación.
 */
export const URL_APP_STORE = "https://apps.apple.com/co/app/copper-app/id6800446218";
export const URL_PLAY_STORE = "https://play.google.com/store/apps/details?id=com.copper.residents";

/** Dónde vive el panel. Los correos necesitan enlaces absolutos. */
export const URL_PANEL = (process.env.URL_PANEL || "https://admin.copperapp.co").replace(/\/+$/, "");

export const URL_LANDING = "https://copperapp.co";
