const $sidebarMenu = document.getElementById("aside");
const $sidebar__close = document.getElementById("sidebar__close");

const $openCarrito = document.getElementById("carrito");

$openCarrito.addEventListener("click", () => {
    $sidebarMenu.classList.add("sidebar--show");
})

$sidebar__close.addEventListener("click", () => {
    $sidebarMenu.classList.remove("sidebar--show");
})