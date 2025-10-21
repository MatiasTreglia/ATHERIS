// Registrar el plugin de ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Pinning de la Sección de Producto
    ScrollTrigger.create({
        trigger: "#producto",
        pin: "#pin-container", 
        start: "top top", 
        end: "bottom bottom", 
    });
    
    // 2. Transiciones de Contenido dentro del Pinning
    gsap.timeline({
         scrollTrigger: {
            trigger: "#producto",
            start: "top top",
            end: "bottom bottom", 
            scrub: 1, 
        }
    })
    // Hito 1: Aparecen los detalles del material (Avance 0 a 1)
    .to("#mascarilla-img", {scale: 1.1, rotation: 5, duration: 1}) 
    
    // Hito 2: Cambiamos el texto (Avance 1 a 2)
    .to("#producto h2", {text: "Material TPU: La Flexibilidad para el Calce", duration: 1, ease: "none"}, 1)
    .to("#producto p", {text: "El TPU (Poliuretano Termoplástico) garantiza la suavidad necesaria para no lastimar la piel del animal.", duration: 1, ease: "none"}, 1)
    
    // Hito 3: Mostramos el talle (Avance 2 a 3)
    .to("#producto h2", {text: "5 Talles Únicos: De XS a XL", duration: 1, ease: "none"}, 2)
    .to("#producto p", {text: "Nuestra tecnología nos permite ofrecer 5 tamaños, asegurando la talla perfecta para cada raza.", duration: 1, ease: "none"}, 2)
    
    // Hito 4: Vuelve al estado inicial para salir (Avance 3 a 4)
    .to("#mascarilla-img", {scale: 1, rotation: 0, duration: 1}, 3);

});

/* ============================================== */
/* FUNCIÓN PARA EL EFECTO FLIP EN MÓVILES (GLOBAL) */
/* ============================================== */
function toggleFlip(card) {
    // Si la tarjeta ya tiene la clase 'flipped', la quitamos. Si no la tiene, la agregamos.
    card.classList.toggle('flipped');
}


// Registrar el plugin de ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Pinning de la Sección de Producto (Si #producto existe)
    if (document.getElementById('producto')) {
        ScrollTrigger.create({
            trigger: "#producto",
            pin: "#pin-container", 
            start: "top top", 
            end: "bottom bottom", 
        });
        
        // 2. Transiciones de Contenido dentro del Pinning
        gsap.timeline({
             scrollTrigger: {
                 trigger: "#producto",
                 start: "top top",
                 end: "bottom bottom", 
                 scrub: 1, 
             }
         })
         // Hito 1: Aparecen los detalles del material (Avance 0 a 1)
         .to("#mascarilla-img", {scale: 1.1, rotation: 5, duration: 1}) 
         
         // Hito 2: Cambiamos el texto (Avance 1 a 2)
         .to("#producto h2", {text: "Material TPU: La Flexibilidad para el Calce", duration: 1, ease: "none"}, 1)
         .to("#producto p", {text: "El TPU (Poliuretano Termoplástico) garantiza la suavidad necesaria para no lastimar la piel del animal.", duration: 1, ease: "none"}, 1)
         
         // Hito 3: Mostramos el talle (Avance 2 a 3)
         .to("#producto h2", {text: "5 Talles Únicos: De XS a XL", duration: 1, ease: "none"}, 2)
         .to("#producto p", {text: "Nuestra tecnología nos permite ofrecer 5 tamaños, asegurando la talla perfecta para cada raza.", duration: 1, ease: "none"}, 2)
         
         // Hito 4: Vuelve al estado inicial para salir (Avance 3 a 4)
         .to("#mascarilla-img", {scale: 1, rotation: 0, duration: 1}, 3);
    }
});