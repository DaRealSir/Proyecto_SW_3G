document.addEventListener("DOMContentLoaded", () => {
    const forumElement = document.getElementById("forum-container");
    forumElement.addEventListener("click", showMore);
    forumElement.addEventListener("click", showModalReply);
    forumElement.addEventListener("click", showModalDelete);
    forumElement.addEventListener("click", showModalEdit);
    try {
    const modalReply = document.getElementById("replyModal");
    modalReply.addEventListener("click", closeModalReply);
    } catch (error) {
        console.log("Usuario no logueado, no existe el modal de respuesta");
    }
    try {
        const modalDelete = document.getElementById("deleteModal");
        modalDelete.addEventListener("click", closeModalDelete);
    } catch (error) {
        console.log("Usuario no logueado o no es admin, no existe el modal de eliminar");
    }
    try {
        const modalEdit = document.getElementById("editModal");
        modalEdit.addEventListener("click", closeModalEdit);
    } catch (error) {
        console.log("Usuario no logueado o no es admin, no existe el modal de editar");
    }

    
    
    //document.querySelectorAll('.show-reply').forEach( el => {el.addEventListener('click', e => showMore(e,1))});
    //document.querySelectorAll('.show-more').forEach( el => {el.addEventListener('click', e => showMore(e, 0))});
});
function showMore(event) {
    if (!event.target.matches('a.show-more') && !event.target.matches('a.show-reply')) return; // Verifica si el elemento es un enlace de "ver más" o "ver respuestas"

    event.preventDefault(); // Evita el comportamiento por defecto del enlace
    if (event.target.matches('a.show-reply')) {
        where_id = "ver_respuestas-" + event.target.dataset.whereId;
    }else {
        where_id = "ver_mas-" + event.target.dataset.whereId;
    }
    const game_id = event.target.dataset.gameId;
    const last_id = event.target.dataset.lastId;
    const offset = event.target.dataset.offset;
    console.log(`/forum/loadThread/${game_id}/${last_id}/${offset}`);
    fetch(`/forum/loadThread/${game_id}/${last_id}/${offset}`)
                    .then(response => response.text())
                    .then(html => {
                        const element = document.getElementById(where_id);
                        if (element) {
                            // Reemplaza el contenido HTML
                            element.outerHTML = html;                           
                        }
                    })
                    .catch(error => console.error("Error en loadMore:", error));
}
function showModalReply(event) {
    if (!event.target.matches('a.reply-button')) return;
    event.preventDefault(); // Evita el comportamiento por defecto del enlace
    
    const modal = document.getElementById("replyModal");
    modal.style.display = "block";
    const thread_id = event.target.dataset.threadId;
    const game_id = event.target.dataset.gameId;
    const content = document.getElementById("thread-"+thread_id);
    
    //content.getElementById("ver_respuestas-"+thread_id).innerHTML = '';
    const dialog = modal.querySelector(".dialogo");
    if (thread_id != "-1") {
        const title = content.querySelector(".thread-title");
        const username = content.querySelector(".thread-username");
        const message = content.querySelector(".thread-message");
        dialog.outerHTML = `<section class="dialogo" class= "dialogo">
                                <form action="/forum/reply/${game_id}/${thread_id}" method="POST">
                                    <h1 name="reply-title" class = thread-title>${title.innerHTML}</h1>
                                    <p class = thread-username>${username.innerHTML}</p>
                                    <p class = thread-message>${message.innerHTML}</p>
                                    <input type="text" name="reply-message" class="input-modal" id="reply-text" placeholder="Escribe tu respuesta aquí..." required/>
                                    <a class="close-reply-modal" href="#">X</a>
                                    <button type="submit" class="reply-button" id="reply-button" href="#" data-thread-id="${thread_id}">Enviar</button>
                                </form>
                            </section>`;
    } else {
        dialog.outerHTML = `<section class="dialogo" class= "dialogo">
                                <form action="/forum/reply/${game_id}/${thread_id}" method="POST">
                                    <input type="text" name="reply-title" class="input-modal" id="reply-text" placeholder="Escribe el título aquí..." required/>
                                    <input type="text" name="reply-message" class="input-modal" id="reply-text" placeholder="Escribe tu respuesta aquí..." required/>
                                    <a class="close-reply-modal" href="#">X</a>
                                    <button type="submit" class="reply-button" id="reply-button" href="#" data-thread-id="${thread_id}">Enviar</button>
                                </form>
                            </section>`;
    }
                                    
    modal.classList.add("is-active");
}
function closeModalReply(event) {
    if (!event.target.matches('a.close-reply-modal')) return;
    event.preventDefault(); 
    const modal = document.getElementById("replyModal");
    modal.style.display = "none";
    modal.classList.remove("is-active");
}
function showModalDelete(event) {
    if (!event.target.matches('a.delete-button')) return;
    event.preventDefault(); // Evita el comportamiento por defecto del enlace
    
    const modal = document.getElementById("deleteModal");
    modal.style.display = "block";
    const thread_id = event.target.dataset.threadId;
    const game_id = event.target.dataset.gameId;
    const content = document.getElementById("thread-"+thread_id);
    const title = content.querySelector(".thread-title");
    const username = content.querySelector(".thread-username");
    const message = content.querySelector(".thread-message");
    //content.getElementById("ver_respuestas-"+thread_id).innerHTML = '';
    const dialog = modal.querySelector(".dialogo");
    dialog.outerHTML = `<section class="dialogo" class= "dialogo">
                            <form action="/forum/delete/${game_id}/${thread_id}" method="POST">
                                <h1 class = thread-title>${title.innerHTML}</h1>
                                <p class = thread-username>${username.innerHTML}</p>
                                <p class = thread-message>${message.innerHTML}</p>
                                <p> Escribe DELETE para confirmar la eliminación de este mensaje y todas sus respuestas</p>
                                <input type="text" name="confirm-text" class="input-modal" id="reply-text" placeholder="DELETE"></textarea>
                                <a class="close-delete-modal" href="#">X</a>
                                <button type="submit" class="reply-button" id="reply-button" href="#" data-thread-id="${thread_id}">Confirmar Eliminación</button>
                            </form>
                        </section>`;
    modal.classList.add("is-active");
}
function closeModalDelete(event) {
    if (!event.target.matches('a.close-delete-modal')) return;
    event.preventDefault(); 
    const modal = document.getElementById("deleteModal");
    modal.style.display = "none";
    modal.classList.remove("is-active");
}

function showModalEdit(event) {
    if (!event.target.matches('a.edit-button')) return;
    event.preventDefault(); // Evita el comportamiento por defecto del enlace
    
    const modal = document.getElementById("editModal");
    modal.style.display = "block";
    const thread_id = event.target.dataset.threadId;
    const game_id = event.target.dataset.gameId;
    const content = document.getElementById("thread-"+thread_id);
    
    //content.getElementById("ver_respuestas-"+thread_id).innerHTML = '';
    const dialog = modal.querySelector(".dialogo");
    const title = content.querySelector(".thread-title");
    const username = content.querySelector(".thread-username");
    const message = content.querySelector(".thread-message");
    dialog.outerHTML = `<section class="dialogo" class= "dialogo">
                            <form action="/forum/edit/${game_id}/${thread_id}" method="POST">
                                <label>Titulo: </label>
                                <input type="text" name="edit-title" class="input-modal" id="edit-title" placeholder="${title.innerHTML}" value="${title.innerHTML}" required/>                                    
                                <p class = thread-username>${username.innerHTML}</p>
                                <label>Mensaje: </label>
                                <input type="text" name="edit-message" class="input-modal" id="edit-message" placeholder="${message.innerHTML}" value="${message.innerHTML}" required/>
                                <a class="close-edit-modal" href="#">X</a>
                                <button type="submit" class="edit-button" id="edit-button" href="#" data-thread-id="${thread_id}">Modificar</button>
                            </form>
                        </section>`;
                              
    modal.classList.add("is-active");
}
function closeModalEdit(event) {
    if (!event.target.matches('a.close-edit-modal')) return;
    event.preventDefault(); 
    const modal = document.getElementById("editModal");
    modal.style.display = "none";
    modal.classList.remove("is-active");
}