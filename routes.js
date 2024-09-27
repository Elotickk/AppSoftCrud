/*********************************** API REST *************************************/
//

    /*
        GET => http://localhost:3000/cliente => GET

        GET => http://localhost:3000/cliente/pornombre?clientenombre=DANIEL

        GET => (requiere parametro clienteid) => http://localhost:3000/cliente/3 => GET

        GET => (requiere parametro clientecuit) => http://localhost:3000/cliente/porcuit/23240106639 => GET

        POST => (no requiere parametro) => http://localhost:3000/cliente/4  => POST => AGREGA => SE PRUEBA CON POSTMAN

        PUT => (requiere parametro clienteid) => http://localhost:3000/cliente/4  => PUT => MODIFICA => SE PRUEBA CON POSTMAN

        DELETE => (requiere parametro clienteid) => http://localhost:3000/cliente/4 => DELETE => ELIMINA

    */

    /* RECUPERAR TODOS LOS CLIENTES => /cliente                                  */

        /* desde Navegador
            http://localhost:3000/cliente
        */

        /* desde PostMAN 
            1ro) Seleccionar GET
            2do) Pegar la ruta http://localhost:3000/cliente
        */
            const { Pool } = require('pg'); 
            require('dotenv').config();
            
            console.log("DB_USER:", process.env.DB_USER);
            console.log("DB_PASSWORD:", process.env.DB_PASSWORD);

            const pool = new Pool({
                user: 'postgres',        // Usuario de PostgreSQL
                host: 'localhost',        // Dirección del servidor
                database: 'base',   // Nombre de la base de datos
                password: '1234',     // Contraseña del usuario de PostgreSQL
                port: 5432,               // Puerto de PostgreSQL (por defecto es 5432)
                });

            const express = require('express');
            const router = express.Router();

            router.get('/cliente', async (req, res) => {
                try 
                {
                    /* armamos la sentencia SQL dentro de una variable/constante */
                    const sentenciaSQL = 
                        `
                            select 
                                cliente.*,
                                localidad.localidadcp,
                                localidad.localidadnombre,
                                localidad.departamentoid,
                                departamento.departamentonombre
                                    from cliente
                                        inner join localidad
                                            on
                                                cliente.localidadid = localidad.localidadid
                                        inner join departamento
                                            on
                                                localidad.departamentoid = departamento.departamentoid
                        `;
        
                    /* ejecutamos la sentencia SQL en el Servidor de Base de Datos */
                    const resultadoSentenciaSQL = await pool.query(sentenciaSQL); // Consulta SQL
        
                    /* Si todo salió bien, armamos un objeto literal con el resultado de la consulta */
                    Salida = 
                    {
                        result_estado:'ok',
                        result_message:'clientes recuperados',
                        result_rows:resultadoSentenciaSQL.rowCount,
                        result_verbo:'get',
                        result_proceso:'/cliente',
                        result_data:resultadoSentenciaSQL.rows
                    }          
                } 
                catch (error) 
                {
                    /* Si algo salió mal en el proceso de ejecución de la consulta, 
                    creamos un objeto literal y devolvemos el mensaje de error */
        
                    Salida = 
                    {
                        result_estado:'error',
                        result_message:error.message,
                        result_rows:0,
                        result_verbo:'get',
                        result_proceso:'/cliente',
                        result_data:''
                    }          
                }
        
                /* respondemos al front end con el objeto Salida convertido a formato JSON */
                res.json(Salida);
            });
        
        
            /* RECUPERAR TODOS LOS CLIENTES POR NOMBRE => /cliente/pornombre             */
        
                /* desde Navegador
                http://localhost:3000/cliente/pornombre?clientenombre=DANIEL
                */
        
                /* desde PostMAN 
                    1ro) Seleccionar GET
                    2do) Pegar la ruta http://localhost:3000/cliente/pornombre?clientenombre=DANIEL
                    3ro) Elegir la sopala Params => Query Params
                        
                        donde dice key van los nombres de los parametros y los valores,en este caso
                        van 
        
                        clientenombre como key
                        DANIEL como value 
        
                        esto es por dar un ejemplo.
                */
        
                        router.get('/cliente/PorNombre', async (req, res) => {
                            try {
                                // Obtenemos el nombre del cliente desde las query del request
                                const clientenombre = req.query.clientenombre;
                        
                                // Si no se proporciona un nombre, devolver un mensaje de error
                                if (!clientenombre) {
                                    return res.json({
                                        result_estado: 'error',
                                        result_message: 'Debe proporcionar un nombre de cliente para buscar',
                                        result_rows: 0,
                                        result_data: []
                                    });
                                }
                        
                                // Armamos la sentencia SQL con ILIKE para búsqueda insensible a mayúsculas
                                const sentenciaSQL = `
                                    SELECT 
                                        cliente.*,
                                        localidad.localidadcp,
                                        localidad.localidadnombre,
                                        localidad.departamentoid,
                                        departamento.departamentonombre
                                    FROM cliente
                                    INNER JOIN localidad
                                        ON cliente.localidadid = localidad.localidadid
                                    INNER JOIN departamento
                                        ON localidad.departamentoid = departamento.departamentoid
                                    WHERE clientenombre ILIKE $1
                                `;
                        
                                // Ejecutamos la sentencia SQL en el Servidor de Base de Datos con búsqueda parcial
                                const resultadoSentenciaSQL = await pool.query(sentenciaSQL, [`%${clientenombre}%`]);
                        
                                // Si todo salió bien, armamos un objeto literal con el resultado de la consulta
                                const Salida = {
                                    result_estado: 'ok',
                                    result_message: 'Clientes recuperados',
                                    result_rows: resultadoSentenciaSQL.rowCount,
                                    result_verbo: 'get',
                                    result_proceso: '/cliente/PorNombre',
                                    result_data: resultadoSentenciaSQL.rows
                                };
                                
                                // Devolvemos el resultado al cliente
                                res.json(Salida);
                            } catch (error) {
                                // Si algo salió mal en el proceso de ejecución de la consulta
                                const Salida = {
                                    result_estado: 'error',
                                    result_message: error.message,
                                    result_rows: 0,
                                    result_verbo: 'get',
                                    result_proceso: '/cliente/PorNombre',
                                    result_data: []
                                };
                                
                                // Enviamos la respuesta de error
                                res.json(Salida);
                            }
                        });
                        
        
            /* RECUPERAR CLIENTES POR (ID) => /cliente/ID                                */
        
                /* desde Navegador
                    http://localhost:3000/cliente/3
                */
        
                /* desde PostMAN 
                    1ro) Seleccionar GET
                    2do) Pegar la ruta  http://localhost:3000/cliente/3
                */
        
                    router.get('/cliente/:clienteid', async (req, res) => {
                        try 
                        {
                            /* obtenemos de los parametros el clienteid */
                            const clienteid = req.params.clienteid;
        
                            /* creamos la sentencia sql dentro de una variable o constante */
                            const sentenciaSQL = 
                                `
                                    select 
                                        cliente.*,
                                        localidad.localidadcp,
                                        localidad.localidadnombre,
                                        localidad.departamentoid,
                                        departamento.departamentonombre
                                            from cliente
                                                inner join localidad
                                                    on
                                                        cliente.localidadid = localidad.localidadid
                                                inner join departamento
                                                    on
                                                        localidad.departamentoid = departamento.departamentoid
                                                            where
                                                                cliente.clienteid = $1 
                                `;
                
                            /* ejecutaremos la sentencia sql en el Motor de bases de datos pasandole como parametro los datos
                            que necesite el query */
        
                            const resultadoSentenciaSQL = await pool.query(sentenciaSQL,[clienteid]); // Consulta SQL
                
                            /* si todo salió bien armamos un objeto literal con los resultados obtenidos */
        
                            Salida = 
                            {
                                result_estado:'ok',
                                result_message:'clientes recuperados',
                                result_rows:resultadoSentenciaSQL.rowCount,
                                result_verbo:'get',
                                result_proceso:'/cliente/:clienteid',
                                result_data:resultadoSentenciaSQL.rows[0]
                            }          
                        } 
                        catch (error) 
                        {
                            /* 
                                Si algo salió mal en el proceso de ejecución de la consulta, 
                                creamos un objeto literal y devolvemos el mensaje de error 
                            */
        
                            Salida = 
                            {
                                result_estado:'error',
                                result_message:error.message,
                                result_rows:0,
                                result_verbo:'get',
                                result_proceso:'/cliente/:clienteid',
                                result_data:''
                            }          
                        }
        
                        /* respondemos al front end con el objeto Salida convertido a formato JSON */
                        res.json(Salida);
                    });
        
        
            /* RECUPERAR CLIENTES POR (CUIT) => /clienteporcuit/clientecuit              */
            
        
                /* desde Navegador
                    http://localhost:3000/cliente/porcuit/23240106639
                */
        
                /* desde PostMAN 
                    1ro) Seleccionar GET
                    2do) Pegar la ruta  http://localhost:3000/cliente/porcuit/23240106639
                */
        
                    router.get('/cliente/PorCuit/:clientecuit', async (req, res) => {
                        try 
                        {
                            /* obtengo de los parametros el clientecuit */
                            const clientecuit = req.params.clientecuit;
        
                            /* armo la sentencia sql, donde el clientecuit estará en el where como parametro variable */
                            const sentenciaSQL = 
                                `
                                    select 
                                        cliente.*,
                                        localidad.localidadcp,
                                        localidad.localidadnombre,
                                        localidad.departamentoid,
                                        departamento.departamentonombre
                                            from cliente
                                                inner join localidad
                                                    on
                                                        cliente.localidadid = localidad.localidadid
                                                inner join departamento
                                                    on
                                                        localidad.departamentoid = departamento.departamentoid
                                                            where
                                                                cliente.clientecuit = $1
                                `;
                
                            /* a la sentencia sql del paso anterior, la ejecutamos y pasamos como parametro
                            los datos que obtuvimos desde el body, en el orden que correspondan y la ejecutamos 
                            */
        
                            const resultadoSentenciaSQL = await pool.query(sentenciaSQL,[clientecuit]); // Consulta SQL
                
                            
                            /* si todo salió bien armamos un objeto literal con los resultados obtenidos */
        
                            Salida = 
                            {
                                result_estado:'ok',
                                result_message:'clientes recuperados',
                                result_rows:resultadoSentenciaSQL.rowCount,
                                result_verbo:'get',
                                result_proceso:'/clientePorCuit/:clientecuit',
                                result_data:resultadoSentenciaSQL.rows[0]
                            }          
                        } 
                        catch (error) 
                        {
                            /* 
                                Si algo salió mal en el proceso de ejecución de la consulta, 
                                creamos un objeto literal y devolvemos el mensaje de error 
                            */
        
                            Salida = 
                            {
                                result_estado:'error',
                                result_message:error.message,
                                result_rows:0,
                                result_verbo:'get',
                                result_proceso:'/clienteporcuit/:clientecuit',
                                result_data:''
                            }          
                        }
        
                        /* respondemos al front end con el objeto Salida convertido a formato JSON */
                        res.json(Salida);
                    });
        
        // Ruta para obtener todos los productos de la base de datos
        router.get('/producto', async (req, res) => {
            try {
                // Sentencia SQL para obtener todos los productos
                const sentenciaSQL = 'SELECT * FROM producto';
        
                // Ejecutar la consulta
                const resultado = await pool.query(sentenciaSQL);
        
                // Si hay productos, devolverlos
                if (resultado.rowCount > 0) {
                    res.json({
                        result_estado: 'ok',
                        result_message: 'Productos recuperados exitosamente',
                        result_rows: resultado.rowCount,
                        result_data: resultado.rows
                    });
                } else {
                    // Si no hay productos, devolver un mensaje indicando que no hay datos
                    res.json({
                        result_estado: 'ok',
                        result_message: 'No se encontraron productos',
                        result_rows: 0,
                        result_data: []
                    });
                }
            } catch (error) {
                // Si hay un error en la ejecución de la consulta, devolver un error
                res.json({
                    result_estado: 'error',
                    result_message: error.message,
                    result_rows: 0,
                    result_data: []
                });
            }
        });
        
        // Ruta para insertar nuevos productos
        
        router.post('/producto', async (req, res) => {
            try {
                const { productocb, productonombre, productoprecio, productosstock } = req.body;
        
                // Sentencia SQL para insertar un nuevo producto
                const sentenciaSQL = `
                    INSERT INTO producto (productocb,productonombre, productoprecio, productosstock)
                    VALUES ($1, $2, $3, $4) RETURNING *;
                `;

                const resultado = await pool.query(sentenciaSQL, [productocb, productonombre, productoprecio , productosstock]);
        
                // Devolver el producto agregado
                res.json({
                    result_estado: 'ok',
                    result_message: 'Producto agregado exitosamente',
                    result_data: resultado.rows[0]
                });
            } catch (error) {
                res.json({
                    result_estado: 'error',
                    result_message: error.message,
                    result_data: []
                });
            }
        });
        
        router.get('/producto/:id', async (req, res) => {
            try {

                const { id } = req.params;
                
                // Sentencia SQL para obtener el producto por ID
                const sentenciaSQL = 'SELECT * FROM producto WHERE productoid = $1';
                const resultado = await pool.query(sentenciaSQL, [id]);
        
                // Verificar si se encontró el producto
                if (resultado.rowCount > 0) {
                    res.json({
                        result_estado: 'ok',
                        result_data: resultado.rows[0]
                    });
                } else {
                    res.json({
                        result_estado: 'error',
                        result_message: 'Producto no encontrado'
                    });
                }
            } catch (error) {
                res.json({
                    result_estado: 'error',
                    result_message: error.message
                });
            }
        });
// Ruta para editar un producto por ID
        router.put('/producto/:id', async (req, res) => {
        try {
        const { productocb, productonombre, productoprecio, productosstock } = req.body;
        const { id } = req.params; // ID o código de barras del producto que vamos a modificar

        // Sentencia SQL para actualizar el producto
        const sentenciaSQL = `
            UPDATE producto
            SET productocb = $1, productonombre = $2, productoprecio = $3, productosstock = $4
            WHERE productoid = $5 RETURNING *;
        `;

        // Ejecutar la consulta SQL con los nuevos valores
        const resultado = await pool.query(sentenciaSQL, [productocb, productonombre, productoprecio, productosstock, id]);

        // Verificar si el producto fue encontrado y modificado
        if (resultado.rowCount > 0) {
            res.json({
                result_estado: 'ok',
                result_message: 'Producto actualizado exitosamente',
                result_data: resultado.rows[0]
            });
        } else {
            res.json({
                result_estado: 'error',
                result_message: 'Producto no encontrado',
                result_data: []
            });
        }
    } catch (error) {
        res.json({
            result_estado: 'error',
            result_message: error.message,
            result_data: []
        });
    }
});

// Ruta para eliminar un producto por ID
router.delete('/producto/:id', async (req, res) => {
    try {
        const { id } = req.params; // ID del producto que vamos a eliminar

        // Sentencia SQL para eliminar el producto
        const sentenciaSQL = `
            DELETE FROM producto
            WHERE productoid = $1 RETURNING *;
        `;

        // Ejecutar la consulta SQL para eliminar el producto
        const resultado = await pool.query(sentenciaSQL, [id]);

        // Verificar si el producto fue encontrado y eliminado
        if (resultado.rowCount > 0) {
            res.json({
                result_estado: 'ok',
                result_message: 'Producto eliminado exitosamente',
                result_data: resultado.rows[0] // Aquí puedes retornar información del producto eliminado si es necesario
            });
        } else {
            res.status(404).json({
                result_estado: 'error',
                result_message: 'Producto no encontrado',
                result_data: []
            });
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({
            result_estado: 'error',
            result_message: 'Error interno del servidor',
            result_data: []
        });
    }
});
        
        router.get('/producto/PorNombre', async (req, res) => {
            try {
                // Obtener el nombre del producto desde los parámetros de consulta (query)
                const nombreProducto = req.query.nombre;
        
                // Si no se especifica un nombre, devolver un error
                if (!nombreProducto) {
                    return res.json({
                        result_estado: 'error',
                        result_message: 'Debe proporcionar un nombre de producto para buscar',
                        result_rows: 0,
                        result_data: []
                    });
                }
        
                // Sentencia SQL para buscar productos cuyo nombre contenga el valor dado
                const sentenciaSQL = `
                    SELECT * FROM producto 
                    WHERE LOWER(productonombre) LIKE LOWER($1)
                `;
        
                // Ejecutar la consulta, usando '%' para hacer la búsqueda parcial (LIKE)
                const resultado = await pool.query(sentenciaSQL, [`%${nombreProducto}%`]);
        
                // Si se encuentran productos, devolverlos
                if (resultado.rowCount > 0) {
                    res.json({
                        result_estado: 'ok',
                        result_message: 'Productos recuperados exitosamente',
                        result_rows: resultado.rowCount,
                        result_data: resultado.rows
                    });
                } else {
                    // Si no se encontraron productos, devolver un mensaje indicando esto
                    res.json({
                        result_estado: 'ok',
                        result_message: 'No se encontraron productos con ese nombre',
                        result_rows: 0,
                        result_data: []
                    });
                }
            } catch (error) {
                // Si hay un error en la ejecución de la consulta, devolver un error
                res.json({
                    result_estado: 'error',
                    result_message: error.message,
                    result_rows: 0,
                    result_data: []
                });
            }
        });
        
        
        /* -------------------------------------- */
        
        router.get('/', (req, res) => {
            res.send('¡Bienvenido a mi API de clientes y productos!');
        });
        
        
        module.exports = router;
