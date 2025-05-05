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
    const form = document.forms.namedItem('addGame');
    form.addEventListener('submit', addGameSubmit);

    const title = form.elements.namedItem('title');
    title.addEventListener('input', titleAvailable);

    const rating = form.elements.namedItem('rating');
    rating.addEventListener('input', checkRating);


}

/**
 * 
 * @param {SubmitEvent} e 
 */
async function addGameSubmit(e) {
    // No se envía el formulario manualmente
    e.preventDefault();
    const form = e.target;
    try {
        const formData = new FormData(form);
        const response = await postData('/games/addGame', formData);
        //window.location.assign('/usuarios/home');
    } catch (err) {
        if (err instanceof ResponseError) {
            switch (err.response.status) {
                case 400:
                    await displayErrores(err.response);
                    break;
            }
        }
        console.error(`Error: `, err);
    }
}

async function displayErrores(response) {
    const { errors } = await response.json();
    const form = document.forms.namedItem('addGame');
    for (const input of form.elements) {
        if (input.name == undefined || input.name === '') continue;
        const feedback = form.querySelector(`*[name="${input.name}"] ~ span.error`);
        if (feedback == undefined) continue;

        feedback.textContent = '';

        const error = errors[input.name];
        if (error) {
            feedback.textContent = error.msg;
        }
    }
}

function checkRating(e) {
    const rating = e.target;
    const feedback = rating.form.querySelector(`*[name="${rating.name}"] ~ .feedback`);

    if (validRating(rating.value)) {
        rating.setCustomValidity('');
    } else {
        rating.setCustomValidity("Rating must be and integer and >= 0 and <=10 ");
    }

    const isValidRating = rating.checkValidity();
    if (isValidRating) {
        rating.setCustomValidity('');
        feedback.textContent = '✔';
        feedback.style.color = 'green';
    } else {
        feedback.textContent = '⚠';
        document.style.color = 'red';
    }
    // Muestra el mensaje de validación
    rating.reportValidity();
}

function validRating(rating) {
    let intRating = parseInt(rating);
    return Number.isInteger(intRating) && (intRating >= 0 && intRating <= 10);
}

async function titleAvailable(e) {
    const title = e.target;
    try {
        title.setCustomValidity('');
        const feedback = title.form.querySelector(`*[name="${title.name}"] ~ .feedback`);
        feedback.textContent = '';
        if (title.value === '') return;

        const response = await postJson('/api/games/available', {
            title: title.value
        });
        const jsonData = await response.json();
        const estaDisponible = JSON.parse(jsonData);

        if (estaDisponible) {
            title.setCustomValidity('');
            feedback.textContent = '✔';
            feedback.style.color = 'green';
        } else {
            title.setCustomValidity('El titulo ya existe en la base de datos!');
            feedback.textContent = '⚠';
            feedback.style.color = 'red';
        }
    } catch (err) {
        console.error(`Error: `, err);
    }
    title.reportValidity();
}