// Registrar los plugins de GSAP
gsap.registerPlugin(ScrollTrigger, TextPlugin);

document.addEventListener('DOMContentLoaded', function () {

    // ==============================================
    // EFECTO 1: HEADER (Desvanecimiento) - Mantenido
    // ==============================================
    gsap.to("#inicio .container", {
        scrollTrigger: {
            trigger: "#inicio",
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
            // markers: true, // Descomenta para depurar
        },
        opacity: 0,
        y: -100,
        scale: 0.9,
        ease: "power1.in",
    });

// ==============================================
// EFECTO 2: VENTAJAS (Entrada Secuencial Lenta y Escalonada)
// ==============================================

const advantageRows = gsap.utils.toArray("[data-scroll-item]");

advantageRows.forEach((row, i) => {

    // 1. Determinamos la dirección de entrada
    const isOdd = i % 2 !== 0; // Fila Impar (1, 3, 5...)
    const enterFromX = isOdd ? 100 : -100; // La dirección del texto/tarjeta

    // 2. Selectores de los elementos internos
    const title = row.querySelector(".advantage-title");
    const text = row.querySelector(".advantage-text");
    const image = row.querySelector(".advantage-image");

    // 3. Creamos la Timeline para la secuencia de entrada
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: row,
            
            // 👇 AQUÍ ESTÁN LOS AJUSTES 👇

            // 1. Punto de "Aparición" (bajando)
            start: "top 70%", 
            
            // 2. Punto de "Desaparición" (subiendo)
            end: "top 40%", 
            
            // 3. Nuevas acciones para los 2 puntos
            toggleActions: "restart none reverse reset",
            scrub: 7,
            
            // 4. Descomenta "markers" para ver las líneas de start y end
            // markers: true, 
        }
    });

    // --- SECUENCIA DE ANIMACIÓN USANDO .from() ---

    // Paso 1: Título (Entrada más rápida para captar la atención)
    tl.from(title, {
        opacity: 0,
        x: enterFromX,
        duration: 1.0,
        ease: "power2.out",
    }, 0); // Comienza en el tiempo 0

    // Paso 2: Imagen (Entra después del título, con una duración más larga para un movimiento visible)
    tl.from(image, {
        opacity: 0,
        x: enterFromX * -1, // Sigue entrando desde el lado opuesto
        duration: 1.5,
        ease: "power3.out"
    }, 0.2); // Comienza 0.2s después del título

    // Paso 3: Texto (Entra después de la imagen, con una duración moderada)
    tl.from(text, {
        opacity: 0,
        x: enterFromX,
        duration: 1.2,
        ease: "power2.out",
    }, 0.5); // Comienza 0.5s después del título (y 0.3s después de la imagen)
});

    // ==============================================
    // EFECTO 3: PRODUCTO (Pinning y Scroll) - Mantenido
    // ==============================================

    // 1. Inicialización de texto (Asegura el punto de partida del TextPlugin)
    gsap.set("#producto h2", { text: { value: "<span class='text-primary-color'>Calce</span> Ergonómico Perfecto", ease: "none" } });
    gsap.set("#producto p", { text: { value: "Nuestras máscaras, diseñadas por veterinarios y fabricadas con precisión 3D, garantizan un sellado hermético fundamental para la oxigenación efectiva en pacientes de todas las especies.", ease: "none" } });


    // 2. PINNING
    ScrollTrigger.create({
        trigger: "#producto-pin",
        pin: "#pin-container",
        start: "top top",
        end: "bottom bottom",
    });

    // 3. Transiciones de Contenido
    gsap.timeline({
        scrollTrigger: {
            trigger: "#producto-pin",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
        }
    })
        // Hito 1: Aparecen los detalles del material (Avance 0 a 1)
        .to("#mascarilla-img", { scale: 1.1, rotation: 5, duration: 1 })

        // Hito 2: Cambiamos el texto (Avance 1 a 2)
        .to("#producto h2", { text: { value: "<span class='text-primary-color'>Material TPU:</span> La Flexibilidad para el Calce", speed: 0.05 }, duration: 1, ease: "none" }, 1)
        .to("#producto p", { text: { value: "El TPU (Poliuretano Termoplástico) garantiza la suavidad necesaria para no lastimar la piel del animal.", speed: 0.05 }, duration: 1, ease: "none" }, 1)

        // Hito 3: Mostramos el talle (Avance 2 a 3)
        .to("#producto h2", { text: { value: "<span class='text-primary-color'>5 Talles Únicos:</span> De XS a XL", speed: 0.05 }, duration: 1, ease: "none" }, 2)
        .to("#producto p", { text: { value: "Nuestra tecnología nos permite ofrecer 5 tamaños, asegurando la talla perfecta para cada raza.", speed: 0.05 }, duration: 1, ease: "none" }, 2)

        // Hito 4: Vuelve al estado inicial para salir (Avance 3 a 4)
        .to("#mascarilla-img", { scale: 1, rotation: 0, duration: 1 }, 3);

    // ==============================================
    // NUEVO EFECTO 4: HABILITAR FLIP EN MOBILE (CASOS DE ÉXITO) 
    // ==============================================

    const testimonialCards = document.querySelectorAll('.testimonial-card');

    testimonialCards.forEach(card => {
        // Añadir el listener para el toque/click
        card.addEventListener('click', function (e) {
            // Prevenir que el click se propague si es un enlace, aunque en general no lo es
            // e.preventDefault(); 

            // Solo activar en touch/mobile (evitamos conflicto con el :hover de desktop)
            // Se asume que el max-width: 992px cubre la mayoría de los casos touch
            if (window.innerWidth < 992) {
                this.classList.toggle('flipped');
            }
        });
    });

    // ==============================================
    // EFECTO 5: LÓGICA DEL CARRITO Y MERCADO PAGO (Modificado)
    // ==============================================

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

}); // <-- ¡ESTE CIERRE FALTABA Y LIMPIÉ LOS ESPACIOS INVÁLIDOS!