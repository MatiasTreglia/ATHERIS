document.addEventListener('DOMContentLoaded', function () {

    // === SELECTORES ===
    const orderList = document.getElementById('order-summary-list');
    const subtotalElement = document.getElementById('order-subtotal');
    const totalElement = document.getElementById('order-total');
    const itemCountElement = document.getElementById('cart-item-count');
    const hiddenPedidoDetalles = document.getElementById('hidden-pedido-detalles');
    const hiddenPedidoTotal = document.getElementById('hidden-pedido-total');
    const facturaCheck = document.getElementById('factura-a-check');
    const facturaFields = document.getElementById('factura-a-fields');

    // === 1. CARGAR RESUMEN DEL PEDIDO ===
    function loadOrderSummary() {
        const cartData = JSON.parse(localStorage.getItem('atherisCart'));
        orderList.innerHTML = "";

        // Si el carrito está vacío, solo mostramos el mensaje. 
        // NO redirigimos aquí para que el usuario pueda volver a comprar sin ser expulsado.
        if (!cartData || !cartData.items || cartData.items.length === 0) {
            orderList.innerHTML = '<li class="list-group-item text-center">Tu carrito está vacío.</li>';
            if(itemCountElement) itemCountElement.textContent = "0";
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

        if(subtotalElement) subtotalElement.textContent = `$${cartData.totalPrice}`;
        if(totalElement) totalElement.textContent = `$${cartData.totalPrice}`;
        if(itemCountElement) itemCountElement.textContent = totalItems;
        if(hiddenPedidoDetalles) hiddenPedidoDetalles.value = pedidoDetallesString;
        if(hiddenPedidoTotal) hiddenPedidoTotal.value = `$${cartData.totalPrice}`;
    }

    // === 2. MANEJAR CAMPOS DE FACTURA A ===
    function setupConditionalFields() {
        if (!facturaCheck || !facturaFields) return;

        const cuitInput = document.querySelector('[name="cuit"]');
        const condicionIvaInput = document.querySelector('[name="condicion_iva"]');

        facturaCheck.addEventListener('change', function() {
            const isChecked = this.checked;
            facturaFields.style.display = isChecked ? 'flex' : 'none';

            // Requerir solo si el checkbox está marcado
            if (cuitInput) cuitInput.required = isChecked;
            if (condicionIvaInput) condicionIvaInput.required = isChecked;
        });
    }

    // === INICIALIZACIÓN ===
    loadOrderSummary();
    setupConditionalFields();

    // === 3. LÓGICA DE ENVÍO (GOOGLE SHEETS) ===
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbym7Yel4JCoUBlah0jBC8WHnwgN7eRzD8xWKsTD5ta5bu1VNf2mNYJQu8kRexpkps6NYA/exec';

    const form = document.forms['checkout-form'];
    const submitButton = document.querySelector('button[type="submit"][form="checkout-form"]');

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault(); 

            // Verificar si el carrito existe antes de enviar
            if (!localStorage.getItem('atherisCart')) {
                Swal.fire({ title: "Carrito vacío", text: "No hay productos para procesar.", icon: "warning" });
                return;
            }

            if(submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Procesando Orden...';
            }

            fetch(scriptUrl, {
                method: 'POST', 
                body: new FormData(form),
                mode: 'no-cors' 
            })
            .then(() => {
                // ÉXITO: Mostramos la alerta
                Swal.fire({
                    title: "¡Orden Generada!",
                    text: "Tu orden de compra fue enviada. Nos contactaremos pronto.",
                    icon: "success",
                    confirmButtonColor: '#6096ba'
                }).then(() => {
                    // LIMPIEZA: Solo ocurre después de que el usuario acepta el mensaje de éxito
                    localStorage.removeItem('atherisCart');
                    window.location.href = '../index.html'; 
                });
            })
            .catch(error => {
                console.error('Error!', error.message);
                Swal.fire({
                    title: "Error de Red",
                    text: "No se pudo conectar con el servidor.",
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