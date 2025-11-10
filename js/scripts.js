// Registrar los plugins de GSAP
gsap.registerPlugin(ScrollTrigger, TextPlugin);

document.addEventListener('DOMContentLoaded', function () {

    // ==============================================
    // EFECTO 1, 2, 3, 4 (Mantenidos)
    // ==============================================

    // ... (Todo tu código de GSAP para Header, Ventajas, Producto y Flip Cards queda igual) ...
    // ...
    // ...

    // ==============================================
    // EFECTO 5: LÓGICA DEL CARRITO (Modificado para Orden de Compra)
    // ==============================================

    // --- 1. Selectores del DOM ---
    const talleInputs = document.querySelectorAll('.talle-quantity-input');
    const cartTotalElement = document.getElementById('cart-total');
    // Nuevo selector para el botón de checkout
    const realizarOrdenBtn = document.getElementById('realizar-orden-btn');

    // --- 2. Variable para el temporizador del debounce ---
    let cartUpdateTimer = null;

    // --- 3. Función principal para Actualizar Total del Carrito ---
    function updateCartTotal() {
        let totalPrice = 0;
        let items = []; // Guardaremos los items para localStorage

        // Recolectar items y calcular total
        talleInputs.forEach(input => {
            const quantity = parseInt(input.value) || 0;
            if (quantity > 0) {
                const price = parseFloat(input.getAttribute('data-price')) || 0;
                const title = input.getAttribute('data-talle')
                    ? `Mascarilla Talle ${input.getAttribute('data-talle')}`
                    : input.getAttribute('data-name');

                totalPrice += quantity * price;

                items.push({
                    title: title,
                    quantity: quantity,
                    price: price
                });
            }
        });

        // Actualizar el texto del total en el HTML
        cartTotalElement.textContent = `$${totalPrice}`;

        // Habilitar o deshabilitar el botón de "Realizar orden"
        if (totalPrice > 0) {
            realizarOrdenBtn.classList.remove('disabled');
            realizarOrdenBtn.setAttribute('aria-disabled', 'false');
        } else {
            realizarOrdenBtn.classList.add('disabled');
            realizarOrdenBtn.setAttribute('aria-disabled', 'true');
        }

        // Retornamos los items y el total para que el listener del botón los use
        return { items, totalPrice };
    }

    // --- 4. Listener para guardar en localStorage antes de navegar ---
    realizarOrdenBtn.addEventListener('click', function(e) {
        // Prevenimos la navegación inmediata
        e.preventDefault();

        // Volvemos a calcular el total para asegurar datos frescos
        const cartData = updateCartTotal();

        // Si el total es 0, no hacemos nada (el botón debería estar disabled igual)
        if (cartData.totalPrice === 0) {
            return; 
        }

        // Guardamos los datos en localStorage
        try {
            localStorage.setItem('atherisCart', JSON.stringify(cartData));
            // Ahora sí, navegamos a la página de checkout
            window.location.href = this.href;
        } catch (error) {
            console.error("Error al guardar el carrito en localStorage:", error);
            alert("Hubo un error al procesar tu carrito. Por favor, intenta de nuevo.");
        }
    });

    // --- 5. Escuchar cambios en los inputs (usando debounce) ---
    talleInputs.forEach(input => {
        input.addEventListener('input', () => {
            clearTimeout(cartUpdateTimer);
            // La función SÓLO se ejecutará 400ms después del ÚLTIMO clic.
            cartUpdateTimer = setTimeout(updateCartTotal, 400);
        });
    });

    // --- 6. Inicializar el total al cargar la página ---
    updateCartTotal();

});