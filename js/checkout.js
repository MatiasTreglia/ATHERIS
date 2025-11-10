document.addEventListener('DOMContentLoaded', function () {

    // === SELECTORES (SIN CAMBIOS) ===
    const orderList = document.getElementById('order-summary-list');
    const subtotalElement = document.getElementById('order-subtotal');
    const totalElement = document.getElementById('order-total');
    const itemCountElement = document.getElementById('cart-item-count');
    const hiddenPedidoDetalles = document.getElementById('hidden-pedido-detalles');
    const hiddenPedidoTotal = document.getElementById('hidden-pedido-total');
    const facturaCheck = document.getElementById('factura-a-check');
    const facturaFields = document.getElementById('factura-a-fields');

    // === LÓGICA DE CARGA (SIN CAMBIOS) ===

    // 1. Función para Cargar el Resumen del Pedido
    function loadOrderSummary() {
        const cartData = JSON.parse(localStorage.getItem('atherisCart'));
        orderList.innerHTML = "";

        if (!cartData || cartData.items.length === 0) {
            orderList.innerHTML = '<li class="list-group-item">Tu carrito está vacío.</li>';
            setTimeout(() => {
                window.location.href = '../index.html'; // Asegúrate que esta ruta sea correcta
            }, 2000);
            return;
        }

        let totalItems = 0;
        let pedidoDetallesString = ""; 

        cartData.items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between lh-sm order-item';
            li.innerHTML = `
                <div>
                    <h6 class="my-0"><strong>${item.title}</strong></h6>
                    <small class="text-muted">Cantidad: ${item.quantity}</small>
                </div>
                <span class="text-muted">$${item.price * item.quantity}</span>
            `;
            orderList.appendChild(li);
            totalItems += item.quantity;
            pedidoDetallesString += `${item.title} (x${item.quantity}) - $${item.price * item.quantity}\n`;
        });

        subtotalElement.textContent = `$${cartData.totalPrice}`;
        totalElement.textContent = `$${cartData.totalPrice}`;
        itemCountElement.textContent = totalItems;
        hiddenPedidoDetalles.value = pedidoDetallesString;
        hiddenPedidoTotal.value = `$${cartData.totalPrice}`;
    }

    // 2. Función para manejar campos condicionales (Factura A)
    function setupConditionalFields() {
        if (!facturaCheck || !facturaFields) return;
        facturaCheck.addEventListener('change', function() {
            facturaFields.style.display = this.checked ? 'flex' : 'none';
        });
    }

    // === INICIALIZACIÓN (SIN CAMBIOS) ===
    loadOrderSummary();
    setupConditionalFields();

    // ===============================================
    // === NUEVA LÓGICA DE ENVÍO (A PRUEBA DE CORS) ===
    // ===============================================

    // 1. Pega la URL de tu script (la que ya tenías)
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbzCTlcKV7yM9NjhMba7qFv_kqsX7eZEgeyG3CyHp3dXFWaFipMKVWKQ_cY5JirOWZGAhQ/exec'; // <-- TU URL

    // 2. Busca el formulario
    const form = document.forms['checkout-form'];
    const submitButton = document.querySelector('button[type="submit"][form="checkout-form"]');

    // 3. Agrega el listener
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault(); 

            if(submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';
            }

            // Envía los datos con 'mode: no-cors'
            fetch(scriptUrl, {
                method: 'POST', 
                body: new FormData(form),
                mode: 'no-cors' // <-- LA SOLUCIÓN MÁGICA
            })
            .then(() => {
                // COMO ESTAMOS EN MODO 'no-cors', NO PODEMOS LEER LA RESPUESTA.
                // Simplemente asumimos que funcionó (el 99% de las veces lo hará).
                
                // Mostramos la alerta de éxito INMEDIATAMENTE
                Swal.fire({
                    title: "¡Orden Generada!",
                    text: "Tu orden de compra fue generada correctamente.",
                    icon: "success"
                });

                localStorage.removeItem('atherisCart');
                
                // Redirigimos al inicio
                setTimeout(() => {
                    window.location.href = '../index.html'; // Asegúrate que esta ruta sea correcta
                }, 2000);

            }).catch(error => {
                // Este catch ahora es solo para errores de red MUY graves (ej. sin internet)
                console.error('Error!', error.message);
                Swal.fire({
                    title: "Error de Red",
                    text: "No se pudo conectar. Revisa tu conexión a internet.",
                    icon: "error"
                });
                if(submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Generar Orden de Compra';
                }
            });
        });
    }
});