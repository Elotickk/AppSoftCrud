const cors = require('cors');

// Configuración de CORS para permitir solicitudes de cualquier origen
const corsOptions = {
    origin: '*', // O puedes configurar orígenes específicos: ['http://localhost:3000', 'http://tudominio.com']
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Exportar el middleware de CORS configurado
module.exports = cors(corsOptions);