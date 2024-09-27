const express = require('express');

// Función para configurar todos los middlewares
const setupMiddlewares = (app) => {

    // Procesar cuerpos de solicitudes JSON
    app.use(express.json());

    // Procesar cuerpos de solicitudes en formato 'text/plain'
    app.use(express.text());

    // Procesar cuerpos de solicitudes URL-encoded (formularios HTML)
    app.use(express.urlencoded({ extended: false }));

    // Sirve archivos estáticos (HTML, CSS, JS, imágenes)
    app.use(express.static("frontend"));
};

module.exports = setupMiddlewares;
