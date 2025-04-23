function showMore(game_id, last_id, offset, where_id) {
    fetch(`/forum/loadThread/${game_id}/${last_id}/${offset}`)
                    .then(response => response.text())
                    .then(html => {
                        const element = document.getElementById(where_id);
                        if (element) {
                            // Reemplaza el contenido HTML
                            element.innerHTML = html;
                        }
                    })
                    .catch(error => console.error("Error en loadMore:", error));
}
//Funciones botones eliminar y responder
function getThreadById(threadId) {
    return threadList.find(thread => thread.id === threadId);
}


// Responder
document.querySelectorAll('.reply-button').forEach(button => {
    button.addEventListener('click', () => {
        const threadId = parseInt(button.dataset.threadId);
        const gameId = parseInt(button.dataset.gameId);

        const post = getThreadById(threadId);
        const form = document.getElementById("replyForm");
        form.action = `/forum/reply/${gameId}/${threadId}`;

        document.getElementById("replyTitle").innerText = post?.title || "(Sin título)";
        document.getElementById("replyDescription").innerText = post?.description || "";
        document.getElementById("replyUser").innerText = "Autor: " + (post?.user_name || "desconocido");

        document.getElementById("replyModal").classList.remove("hidden");
    });
});

// Eliminar
document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', () => {
        const threadId = parseInt(button.dataset.threadId);
        const gameId = parseInt(button.dataset.gameId);

        const post = getThreadById(threadId);
        const form = document.getElementById("deleteForm");
        form.action = `/forum/delete/${gameId}/${threadId}`;

        document.getElementById("deleteTitle").innerText = post?.title || "(Sin título)";
        document.getElementById("deleteDescription").innerText = post?.description || "";
        document.getElementById("deleteUser").innerText = "Autor: " + (post?.user_name || "desconocido");

        document.getElementById("confirmText").value = "";
        document.getElementById("deleteModal").classList.remove("hidden");
    });
});

// Cierre de modales
function closeReplyModal() {
    document.getElementById("replyModal").classList.add("hidden");
}

function closeDeleteModal() {
    document.getElementById("deleteModal").classList.add("hidden");
}

// Validación "DELETE"
document.getElementById("deleteForm").addEventListener("submit", function (e) {
    const confirm = document.getElementById("confirmText").value;
    if (confirm !== "DELETE") {
        e.preventDefault();
        alert("Debes escribir DELETE para confirmar.");
    }
});
