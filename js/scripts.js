// Registrar los plugins de GSAP
gsap.registerPlugin(ScrollTrigger, TextPlugin);

document.addEventListener('DOMContentLoaded', function () {

    // ==============================================
    // 1. HEADER (Desvanecimiento)
    // ==============================================
    gsap.to("#inicio .container", {
        scrollTrigger: {
            trigger: "#inicio",
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
        },
        opacity: 0,
        y: -100,
        scale: 0.9,
        ease: "power1.in",
    });

    // ==============================================
    // 2. VENTAJAS (Optimizado por Dispositivo)
    // ==============================================
    let mm = gsap.matchMedia();

    mm.add("(min-width: 992px)", () => {
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
            tl.from(title, { opacity: 0, x: enterFromX, duration: 1 }, 0)
              .from(image, { opacity: 0, x: enterFromX * -1, duration: 1 }, 0.2)
              .from(text, { opacity: 0, x: enterFromX, duration: 1 }, 0.5);
        });
    });

    mm.add("(max-width: 991px)", () => {
        const advantageRows = gsap.utils.toArray("[data-scroll-item]");
        advantageRows.forEach((row) => {
            gsap.from(row, {
                scrollTrigger: {
                    trigger: row,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power2.out"
            });
        });
    });

    // ==============================================
    // 3. PRODUCTO (Pinning y Scroll)
    // ==============================================
    ScrollTrigger.create({
        trigger: "#producto-pin",
        pin: "#pin-container",
        start: "top top",
        end: "bottom bottom",
    });

    // ==============================================
    // 4. ANIMACIÓN CONTACTO (ZOOM IN ESTABLE)
    // ==============================================
    gsap.from("#contacto .contact-card", {
        scrollTrigger: {
            trigger: "#contacto",
            start: "top 85%", 
            toggleActions: "play none none none"
        },
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: "expo.out",
        clearProps: "scale,opacity",
        onComplete: () => {
            gsap.set("#contacto .contact-card", { clearProps: "transform" });
        }
    });

    // ==============================================
    // 5. ANIMACIÓN COMPRAR (ZOOM IN PERMANENTE)
    // ==============================================
    gsap.from("#comprar .col-lg-5, #comprar .mt-5", {
        scrollTrigger: {
            trigger: "#comprar",
            start: "top 85%",
            toggleActions: "play none none none",
            once: true 
        },
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "back.out(1.2)",
        onComplete: function() {
            gsap.set(this.targets(), { clearProps: "transform" });
        }
    });

    // ==============================================
    // 6. TESTIMONIOS (FLIP CARDS)
    // ==============================================
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.addEventListener('click', function () {
            this.classList.toggle('flipped');
        }); 
    }); 

    // ==============================================
    // 7. LÓGICA DEL CARRITO (Actualización Visual)
    // ==============================================
    const talleInputs = document.querySelectorAll('.talle-quantity-input');
    const cartTotalElement = document.getElementById('cart-total');
    const realizarOrdenBtn = document.getElementById('realizar-orden-btn');

    function updateCartTotal() {
        let totalPrice = 0;
        talleInputs.forEach(input => {
            const quantity = parseInt(input.value) || 0;
            const price = parseFloat(input.getAttribute('data-price')) || 0;
            totalPrice += quantity * price;
        });
        if(cartTotalElement) cartTotalElement.textContent = `$${totalPrice}`;
        if(realizarOrdenBtn) {
            totalPrice > 0 ? realizarOrdenBtn.classList.remove('disabled') : realizarOrdenBtn.classList.add('disabled');
        }
    }

    talleInputs.forEach(input => {
        input.addEventListener('input', updateCartTotal);
    });

    // ==============================================
    // 8. ENVÍO DE FORMULARIO DE CONTACTO
    // ==============================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = document.getElementById('contact-submit-btn');
            const originalText = btn.textContent;
            
            btn.disabled = true;
            btn.textContent = 'Enviando...';

            const scriptURL = 'https://script.google.com/macros/s/AKfycbwTU5MIKPgHkQFQn11aJu9EYUmTroFv8SDwRstVxssdSt1GJY9Ns5eA_XU4yU8igM934g/exec';

            fetch(scriptURL, {
                method: 'POST',
                body: new FormData(contactForm)
            })
            .then(response => {
                Swal.fire({ 
                    title: "¡Enviado!", 
                    text: "Nos pondremos en contacto pronto.",
                    icon: "success", 
                    confirmButtonColor: '#6096ba' 
                });
                contactForm.reset();
            })
            .catch(error => {
                Swal.fire({ 
                    title: "Error", 
                    text: "No se pudo enviar el mensaje.",
                    icon: "error" 
                });
            })
            .finally(() => {
                btn.disabled = false;
                btn.textContent = originalText;
            });
        });
    }

    // ==============================================
    // 9. GUARDAR CARRITO Y REDIRIGIR AL CHECKOUT
    // ==============================================
    if (realizarOrdenBtn) {
        realizarOrdenBtn.addEventListener('click', function (e) {
            e.preventDefault(); // Evitamos que el enlace actúe antes de guardar

            let itemsParaComprar = [];
            let precioTotal = 0;

            talleInputs.forEach(input => {
                const quantity = parseInt(input.value) || 0;
                if (quantity > 0) {
                    const title = input.getAttribute('data-talle');
                    const price = parseFloat(input.getAttribute('data-price'));
                    
                    itemsParaComprar.push({
                        title: title,
                        quantity: quantity,
                        price: price
                    });
                    precioTotal += quantity * price;
                }
            });

            if (itemsParaComprar.length > 0) {
                // Guardamos en localStorage
                const cartData = {
                    items: itemsParaComprar,
                    totalPrice: precioTotal
                };
                localStorage.setItem('atherisCart', JSON.stringify(cartData));

                // Ahora sí, redirigimos
                window.location.href = './html/checkout.html';
            } else {
                Swal.fire({
                    title: "Carrito vacío",
                    text: "Por favor selecciona al menos un producto.",
                    icon: "info",
                    confirmButtonColor: '#6096ba'
                });
            }
        });
    }

}); // Cierre correcto de DOMContentLoaded

// Inicializar AOS
AOS.init({
    duration: 1000,
    once: true,
    disable: 'mobile'
});