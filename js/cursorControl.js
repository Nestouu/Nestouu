document.addEventListener('DOMContentLoaded', () => {
    const canvasContainer = document.getElementById('squidcontainer');
    const customCursor = document.createElement('img');

    // Configurer l'image du curseur
    customCursor.src = 'path/to/squid.png'; // Remplacez par le chemin de votre image
    customCursor.alt = 'Cursor Image';
    customCursor.style.position = 'absolute';
    customCursor.style.width = '50px'; // Ajustez la taille de l'image
    customCursor.style.height = '50px';
    customCursor.style.pointerEvents = 'none';
    customCursor.style.transform = 'translate(-50%, -50%)';
    customCursor.style.display = 'none'; // Masque le curseur au départ
    document.body.appendChild(customCursor);

    // Déplacement du curseur
    document.addEventListener('mousemove', (e) => {
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;
    });

    // Afficher l'image du curseur lorsque la souris entre dans le canvas
    canvasContainer.addEventListener('mouseenter', () => {
        customCursor.style.display = 'block';
    });

    // Cacher l'image du curseur lorsque la souris quitte le canvas
    canvasContainer.addEventListener('mouseleave', () => {
        customCursor.style.display = 'none';
    });
});