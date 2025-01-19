document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    canvas.style.position = "absolute";
    canvas.style.pointerEvents = "none";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cursor = {
        x: -50, // Position initiale en dehors de l'écran
        y: -50,
        image: new Image(),
        size: 100 // Taille de l'image
    };

    // Charger l'image
    cursor.image.src = "./img/squid.png"; // Assurez-vous que l'image `squid.png` est accessible dans votre projet

    // Mettre à jour la taille du canvas lors du redimensionnement
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Mettre à jour la position du curseur
    window.addEventListener("mousemove", (e) => {
        cursor.x = e.clientX;
        cursor.y = e.clientY;
    });

    // Fonction de dessin de l'image du curseur
    function drawCursor() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dessiner l'image centrée sur la position du curseur
        if (cursor.image.complete) {
            ctx.drawImage(
                cursor.image,
                cursor.x - cursor.size / 2, // Centrer l'image
                cursor.y - cursor.size / 2,
                cursor.size,
                cursor.size
            );
        }

        requestAnimationFrame(drawCursor);
    }

    drawCursor();
});
