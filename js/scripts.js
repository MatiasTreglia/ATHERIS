// scripts.js (Frontend)
// Registrar los plugins de GSAP
gsap.registerPlugin(ScrollTrigger, TextPlugin);

document.addEventListener('DOMContentLoaded', function () {

    // ==============================================
    // 0. CONFIGURACIÓN E INICIALIZACIÓN DE VARIABLES
    // ==============================================

    const talleQuantityInputs = document.querySelectorAll('.talle-quantity-input');
    const kitQuantityInput = document.getElementById('kit-quantity');
    const kitPriceUnit = 50; 
    const finalCheckoutBtn = document.getElementById('final-checkout-btn');
    const cartTotalDisplay = document.getElementById('cart-total');

    // ✅ PUBLIC KEY INTEGRADA
    const PUBLIC_KEY = "APP_USR-ef78f184-d13d-4e97-9c11-eaac5a5bf896"; 

    // URL del servidor de Node.js.
    const BACKEND_URL = "http://localhost:3000/create_preference"; 

    // ==============================================
    // 1. LÓGICA DE CARRITO Y TOTAL
    // ==============================================

    function updateCart() {
        let currentTotal = 0;
        
        const kitQuantity = parseInt(kitQuantityInput.value) || 0;
        currentTotal += kitQuantity * kitPriceUnit;
        
        talleQuantityInputs.forEach(input => {
            const quantity = parseInt(input.value) || 0;
            const price = parseInt(input.dataset.price); 
            currentTotal += (quantity * price);
        });
        
        cartTotalDisplay.textContent = `$${currentTotal}`;

        if (currentTotal > 0) {
            finalCheckoutBtn.classList.remove('disabled');
        } else {
            finalCheckoutBtn.classList.add('disabled');
        }
    }

    function getCartDetails() {
        const items = [];

        const kitQuantity = parseInt(kitQuantityInput.value) || 0;
        if (kitQuantity > 0) {
            items.push({
                title: "Kit Completo (5 Mascarillas)",
                unit_price: kitPriceUnit,
                quantity: kitQuantity
            });
        }

        talleQuantityInputs.forEach(input => {
            const quantity = parseInt(input.value) || 0;
            const price = parseInt(input.dataset.price); 
            const talle = input.dataset.talle;

            if (quantity > 0) {
                items.push({
                    title: `Mascarilla Individual Talle ${talle}`,
                    unit_price: price,
                    quantity: quantity
                });
            }
        });
        return items;
    }

    kitQuantityInput.addEventListener('input', updateCart);
    talleQuantityInputs.forEach(input => {
        input.addEventListener('input', updateCart);
    });

    updateCart();


    // ==============================================
    // 3. ANIMACIONES GSAP (MANTENIDAS)
    // ==============================================
    
    // ... (El código de animaciones GSAP se mantiene sin cambios) ...
    // EFECTO 1: HEADER (Desvanecimiento) 
    gsap.to("#hero .container", {
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
        },
        opacity: 0,
        y: -100,
        scale: 0.9,
        ease: "power1.in",
    });

    // EFECTO 2: VENTAJAS (Entrada Secuencial)
    const advantageRows = gsap.utils.toArray("[data-scroll-item]");
    advantageRows.forEach((row, i) => {
        const isOdd = i % 2 !== 0; 
        const enterFromX = isOdd ? 100 : -100;
        const title = row.querySelector(".advantage-title");
        const text = row.querySelector(".advantage-text");
        const image = row.querySelector(".advantage-image");
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: row,
                start: "top 75%",
                toggleActions: "play none none reverse",
            }
        });
        tl.from(title, { opacity: 0, x: enterFromX, duration: 1.0, ease: "power2.out",}, 0); 
        tl.from(image, { opacity: 0, x: enterFromX * -1, duration: 1.5, ease: "power3.out"}, 0.2); 
        tl.from(text, { opacity: 0, x: enterFromX, duration: 1.2, ease: "power2.out",}, 0.5); 
    });

    // EFECTO 3: PRODUCTO (Pinning y Scroll)
    if (document.getElementById('producto-pin')) {
        gsap.set("#producto h2", { text: { value: "<span class='text-primary-color'>Calce</span> Ergonómico Perfecto", ease: "none" } });
        gsap.set("#producto p", { text: { value: "Nuestras máscaras, diseñadas por veterinarios y fabricadas con precisión 3D, garantizan un sellado hermético fundamental para la oxigenación efectiva en pacientes de todas las especies.", ease: "none" } });

        ScrollTrigger.create({ trigger: "#producto-pin", pin: "#pin-container", start: "top top", end: "bottom bottom",});

        gsap.timeline({
            scrollTrigger: { trigger: "#producto-pin", start: "top top", end: "bottom bottom", scrub: 1,}
        })
            .to("#mascarilla-img", { scale: 1.1, rotation: 5, duration: 1 })
            .to("#producto h2", { text: { value: "<span class='text-primary-color'>Material TPU:</span> La Flexibilidad para el Calce", speed: 0.05 }, duration: 1, ease: "none" }, 1)
            .to("#producto p", { text: { value: "El TPU (Poliuretano Termoplástico) garantiza la suavidad necesaria para no lastimar la piel del animal.", speed: 0.05 }, duration: 1, ease: "none" }, 1)
            .to("#producto h2", { text: { value: "<span class='text-primary-color'>5 Talles Únicos:</span> De XS a XL", speed: 0.05 }, duration: 1, ease: "none" }, 2)
            .to("#producto p", { text: { value: "Nuestra tecnología nos permite ofrecer 5 tamaños, asegurando la talla perfecta para cada raza.", speed: 0.05 }, duration: 1, ease: "none" }, 2)
            .to("#mascarilla-img", { scale: 1, rotation: 0, duration: 1 }, 3);
    }

    // EFECTO 4: HABILITAR FLIP EN MOBILE (CASOS DE ÉXITO) 
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.addEventListener('click', function (e) {
            if (window.innerWidth < 992) {
                this.classList.toggle('flipped');
            }
        });
    });

});