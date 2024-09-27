console.log("Esto será la aplicación web");

    /* importo la clase express */
    const ClaseExpress = require('express');

    /* creo una instancia de la clase express para poder
    configurar y trabajar con el servidor */

    const ServidorWeb = ClaseExpress();

    /* Importar middlewares personalizados */
    const setupMiddlewares = require('./middlewares/middlewares');
    const corsMiddleware = require('./middlewares/cors');
    
    // Configurar middlewares
    setupMiddlewares(ServidorWeb); // Configurar otros middlewares
    ServidorWeb.use(corsMiddleware); // Configurar CORS
    
    // Importar las rutas
    const routes = require('./routes');
    ServidorWeb.use(routes);
    
    // Configurar el puerto
    const PORT = 3000;
    
    // Iniciar el servidor
    ServidorWeb.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });