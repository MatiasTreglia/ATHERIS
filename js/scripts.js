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


    // ==============================================
    // EFECTO 5: LÓGICA DE MERCADO PAGO (SUSPENDIDA)
    // ==============================================
    /*
    
    // --- 1. Configuración de Mercado Pago ---
    const publicKey = "APP_USR-ef78f184-d13d-4e97-9c11-eaac5a5bf896";
    const mp = new MercadoPago(publicKey);
    const bricksBuilder = mp.bricks();
    let currentWalletBrick = null; // Para guardar la instancia del botón

    // --- 2. Selectores del DOM ---
    const talleInputs = document.querySelectorAll('.talle-quantity-input');
    const cartTotalElement = document.getElementById('cart-total');
    const walletContainer = 'walletBrick_container'; // ID del div contenedor

    // ⭐️ NUEVO: Variable para el temporizador del debounce
    let paymentUpdateTimer = null;

    // --- 3. Función principal para Actualizar Carrito y Botón de Pago ---
    async function updateCartAndPayment() {
        let totalPrice = 0;
        const items = [];

        // Recolectar items y calcular total
        talleInputs.forEach(input => {
            const quantity = parseInt(input.value) || 0;
            if (quantity > 0) {
                const price = parseFloat(input.getAttribute('data-price')) || 0;

                // El input del Kit no tiene 'data-talle', usamos 'data-name'
                const title = input.getAttribute('data-talle')
                    ? `Mascarilla Talle ${input.getAttribute('data-talle')}`
                    : input.getAttribute('data-name'); // "Kit Completo (5 Mascarillas)"

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

        // Si no hay items, no hacemos nada más (podrías ocultar el botón)
        if (items.length === 0) {
            // Si el botón ya existe, lo destruimos
            if (currentWalletBrick) {
                currentWalletBrick.unmount();
                currentWalletBrick = null;
            }
            // Limpiamos el contenedor por si acaso
            document.getElementById(walletContainer).innerHTML = "";
            return;
        }

        try {
            // --- 4. Llamar al Backend para crear la preferencia ---
            const response = await fetch('http://localhost:3000/create_preference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: items }) // Enviar los items al backend
            });

            if (!response.ok) {
                throw new Error('Error al crear la preferencia');
            }

            const data = await response.json();
            const preferenceId = data.preference_id;

            // --- 5. Renderizar el Botón de Pago (Wallet Brick) ---
            renderWalletBrick(preferenceId);

        } catch (error) {
            console.error("Error en el proceso de pago:", error);
            // Mostrar un error al usuario
            document.getElementById(walletContainer).innerHTML = "<p class='text-danger'>Error al generar el botón de pago. Intente de nuevo.</p>";
        }
    }

    // --- 6. Función para Renderizar/Actualizar el Botón de MP ---
    async function renderWalletBrick(preferenceId) {
        if (currentWalletBrick) {
            currentWalletBrick.unmount();
            currentWalletBrick = null;
        }

        document.getElementById(walletContainer).innerHTML = "";

        currentWalletBrick = await bricksBuilder.create("wallet", walletContainer, {
            initialization: {
                preferenceId: preferenceId,
            },
            customization: {
                texts: {
                    valueProp: 'smart_option',
                },
            }
        });
    }

    // --- 7. Escuchar cambios en los inputs ---

    // ⭐️ CAMBIO PRINCIPAL AQUÍ ⭐️
    talleInputs.forEach(input => {
        // Usamos 'input' en lugar de 'change' para capturar cada clic de flecha
        input.addEventListener('input', () => {
            // 1. Limpiamos cualquier temporizador anterior
            clearTimeout(paymentUpdateTimer);

            // 2. Creamos un nuevo temporizador
            // La función SÓLO se ejecutará 400ms después del ÚLTIMO clic.
            paymentUpdateTimer = setTimeout(updateCartAndPayment, 400);
        });
    });

    // --- 8. Inicializar el total (y el botón si hay valores precargados) ---
    updateCartAndPayment();
    
    */

}); // Fin del DOMContentLoaded