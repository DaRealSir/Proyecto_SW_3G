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
    const selectorEstrofa = document.querySelector("select");

    selectorEstrofa.addEventListener("change", () => {
        const verso = selectorEstrofa.value;
        updateDisplay(verso);
    });

    //const formSelector = document.forms.namedItem('selector');
    const formSelector = document.querySelector('#selector');
    const automatico = formSelector.querySelector('button[name="automatico"]');
    automatico.addEventListener('click', (e) => {
        // Si no incluimos type="button"
        // e.preventDefault() para evitar que se envíe el formulario
        cargarAutomaticamente(0);
    });

    updateDisplay(selectorEstrofa.value);
}

async function updateDisplay(verso) {
    const displayPoema = document.querySelector("pre");

    const url = `${verso}.txt`;

    try {
        /*
         * Invocar `fetch()`, pasando la URL.
         * fetch() devuelve una `Promise`. `await` espera a recibir la respuesta del servidor
         */
        const response = await safeFetch(url);

        /*
         * Si la respuesta es correcta, se carga toda la respuesta.
         * `response.text()` también devuelve una `Promise` que tenemos que esperar.
         */
        const texto = await response.text();

        /*
         * Se muestra el texto en la caja de texto.
         */
        displayPoema.textContent = texto;
    } catch (err) {
        // Captura el error y muestra un mensaje en `displayPoema`
        displayPoema.textContent = `No se ha podido cargar la estrofa: ${err}`;
    }
}

/**
 * 
 * @param {number} [posicion] 
 */
function cargarAutomaticamente(posicion = 0) {
    setTimeout(async () => {
        const selectorEstrofa = document.querySelector("select");
        const estrofas = selectorEstrofa.querySelectorAll("option");
        const estrofaActual = estrofas[posicion].value;
        selectorEstrofa.value = estrofaActual;
        await updateDisplay(estrofaActual);
        if (posicion < estrofas.length - 1) {
            cargarAutomaticamente(posicion+1);
        }
    }, 1*1000);
}