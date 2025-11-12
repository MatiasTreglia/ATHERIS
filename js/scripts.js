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
                start: "top 60%",
                toggleActions: "restart none none reverse",
                // markers: true, 
            }
        });

        // --- SECUENCIA DE ANIMACIÓN USANDO .from() ---

        // Paso 1: Título
        tl.from(title, {
            opacity: 0,
            x: enterFromX,
            duration: 1.0, 
            ease: "power2.out",
        }, 0); // Comienza en el tiempo 0

        // Paso 2: Imagen
        tl.from(image, {
            opacity: 0,
            x: enterFromX * -1,
            duration: 1.0, 
            ease: "power3.out"
        }, 0.2); // Comienza 0.2s después del título

        // Paso 3: Texto
        tl.from(text, {
            opacity: 0,
            x: enterFromX,
            duration: 1.0, 
            ease: "power2.out",
        }, 0.5); // Comienza 0.5s (0.3s después de la imagen)
    });

    // ==============================================
    // EFECTO 3: PRODUCTO (Pinning y Scroll) - Mantenido
    // ==============================================

    // 1. Inicialización de texto
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
    .to("#mascarilla-img", { scale: 1.1, rotation: 5, duration: 1 })
    .to("#producto h2", { text: { value: "<span class='text-primary-color'>Material TPU:</span> La Flexibilidad para el Calce", speed: 0.05 }, duration: 1, ease: "none" }, 1)
    .to("#producto p", { text: { value: "El TPU (Poliuretano Termoplástico) garantiza la suavidad necesaria para no lastimar la piel del animal.", speed: 0.05 }, duration: 1, ease: "none" }, 1)
    .to("#producto h2", { text: { value: "<span class='text-primary-color'>5 Talles Únicos:</span> De XS a XL", speed: 0.05 }, duration: 1, ease: "none" }, 2)
    .to("#producto p", { text: { value: "Nuestra tecnología nos permite ofrecer 5 tamaños, asegurando la talla perfecta para cada raza.", speed: 0.05 }, duration: 1, ease: "none" }, 2)
    .to("#mascarilla-img", { scale: 1, rotation: 0, duration: 1 }, 3);

    // ==============================================
    // NUEVO EFECTO 4: HABILITAR FLIP EN MOBILE (CASOS DE ÉXITO) 
    // ==============================================

    const testimonialCards = document.querySelectorAll('.testimonial-card');

    testimonialCards.forEach(card => {
        // Añadir el listener para el toque/click
        card.addEventListener('click', function (e) {
            // e.preventDefault(); // No es necesario si no es un enlace
            this.classList.toggle('flipped');
        }); 
    }); 

    // ==============================================
    // EFECTO 5: LÓGICA DEL CARRITO (Modificado para Orden de Compra)
    // ==============================================

    // --- 1. Selectores del DOM ---
    const talleInputs = document.querySelectorAll('.talle-quantity-input');
    const cartTotalElement = document.getElementById('cart-total');
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