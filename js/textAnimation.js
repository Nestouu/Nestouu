document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.getElementById("wrapper");
    const title = document.getElementById("title");
    const subtitle = document.getElementById("subtitle");

    // Vitesse de déplacement (en pixels par intervalle)
    const speed = 3.5;

    // Position initiale et direction (x, y) pour chaque élément
    const titleState = {
        x: Math.random() * (wrapper.offsetWidth - title.offsetWidth),
        y: Math.random() * (wrapper.offsetHeight - title.offsetHeight),
        dx: Math.random() < 0.5 ? speed : -speed,
        dy: Math.random() < 0.5 ? speed : -speed
    };

    const subtitleState = {
        x: Math.random() * (wrapper.offsetWidth - subtitle.offsetWidth),
        y: Math.random() * (wrapper.offsetHeight - subtitle.offsetHeight),
        dx: Math.random() < 0.5 ? speed : -speed,
        dy: Math.random() < 0.5 ? speed : -speed
    };

    // Fonction pour déplacer un élément de manière linéaire
    const moveElement = (state, element, wrapperWidth, wrapperHeight) => {
        // Mettre à jour les positions
        state.x += state.dx;
        state.y += state.dy;

        // Inverser la direction si l'élément atteint les limites
        if (state.x <= 0 || state.x >= wrapperWidth - element.offsetWidth) {
            state.dx *= -1;
        }
        if (state.y <= 0 || state.y >= wrapperHeight - element.offsetHeight) {
            state.dy *= -1;
        }

        // Appliquer la nouvelle position
        element.style.transform = `translate(${state.x}px, ${state.y}px)`;
    };

    // Animation continue
    const animateTexts = () => {
        const wrapperWidth = wrapper.offsetWidth;
        const wrapperHeight = wrapper.offsetHeight;

        moveElement(titleState, title, wrapperWidth, wrapperHeight);
        moveElement(subtitleState, subtitle, wrapperWidth, wrapperHeight);

        requestAnimationFrame(animateTexts);
    };

    // Démarrer l'animation
    animateTexts();
});
