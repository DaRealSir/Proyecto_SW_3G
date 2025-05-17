
/*
 * Inicializamos el JS cuando se ha terminado de procesar todo el HTML de la página.
 *
 * Al incluir <script> al final de la página podríamos invocar simplemente a init().
 */
document.addEventListener('DOMContentLoaded', init);

/**
 * Inicializa la página
 */
function init() {
    const listaNotificaciones = document.querySelector('ul.notificaciones');

    const notificaciones = new EventSource("/notificaciones/global");

    notificaciones.addEventListener('open', e => {
    });

    notificaciones.addEventListener('error', e => {
        if (e.eventPhase === EventSource.CLOSED) {
        }
        else {
        }
    });

    notificaciones.addEventListener('message', e => {
        listaNotificaciones.appendChild(createElement('li', {}, e.data));
    });
}
