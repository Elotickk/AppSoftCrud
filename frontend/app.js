// Referencia al botón y al contenedor donde se mostrarán los productos
const botonCargar = document.getElementById('cargarProductos');
const listaProductos = document.getElementById('listaProductos');
const formAgregarProducto = document.getElementById('formAgregarProducto');
const formEditarProducto = document.getElementById('formEditarProducto');



formAgregarProducto.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional
    const nombrecb = document.getElementById('nombrecb').value;
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const stock = document.getElementById('stock').value;

    try {
        // Realizar la solicitud POST al endpoint para agregar un nuevo producto
        const response = await fetch('http://localhost:3000/producto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productocb: nombrecb,
                productonombre: nombre,
                productoprecio: parseFloat(precio),
                productosstock: parseInt(stock),
            }),
        });

        const data = await response.json();

        if (data.result_estado === 'ok') {
            // Limpiar el formulario
            formAgregarProducto.reset();
            alert('Producto agregado exitosamente');
        } else {
            alert('Error al agregar el producto: ' + data.result_message);
        }
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        alert('Error al agregar el producto');
    }
});


botonCargar.addEventListener('click', async () => {
    try {
        // Realizar la solicitud GET al endpoint para obtener todos los productos
        const response = await fetch('http://localhost:3000/producto');
        const data = await response.json();

        // Limpiar el contenedor de productos antes de mostrar nuevos datos
        listaProductos.innerHTML = '';

        if (data.result_estado === 'ok' && data.result_rows > 0) {
            // Recorrer los productos y mostrarlos en la página
            data.result_data.forEach(producto => {
                const divProducto = document.createElement('div');
                divProducto.classList.add('producto');
                divProducto.id = `producto-${producto.productoid}`;

                // Generar el HTML para cada producto, incluyendo el botón de eliminar
                divProducto.innerHTML = `
                    <h3 class="productocb">${producto.productocb}</h3>
                    <h3 class="productonombre">${producto.productonombre}</h3>
                    <p class="productoprecio">Precio: $${producto.productoprecio}</p>
                    <p class="productosstock">Stock: ${producto.productosstock}</p>
                    <button class="btnEditar" data-id="${producto.productoid}">Editar</button>
                    <button class="btnEliminar" data-id="${producto.productoid}">Eliminar</button>
                `;

                // Añadir el producto al DOM
                listaProductos.appendChild(divProducto);
            });

            // Asignar el evento "click" a los botones de edición
            document.querySelectorAll('.btnEditar').forEach(boton => {
                boton.addEventListener('click', (event) => {
                    const idProducto = event.target.getAttribute('data-id');
                    cargarFormularioEdicion(idProducto);
                });
            });

            // Asignar el evento "click" a los botones de eliminación
            document.querySelectorAll('.btnEliminar').forEach(boton => {
                boton.addEventListener('click', (event) => {
                    const idProducto = event.target.getAttribute('data-id');
                    eliminarProducto(idProducto);
                });
            });
        } else {
            listaProductos.innerHTML = '<p>No se encontraron productos</p>';
        }
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        listaProductos.innerHTML = '<p>Error al cargar los productos</p>';
    }
});



const cargarFormularioEdicion = async (idProducto) => {
    try {
        // Realizar una solicitud GET para obtener los datos del producto seleccionado
        const response = await fetch(`http://localhost:3000/producto/${idProducto}`);
        const data = await response.json();

        if (data.result_estado === 'ok') {
            const producto = data.result_data;

            // Llenar el formulario con los datos del producto seleccionado
            document.getElementById('editarNombrecb').value = producto.productocb;
            document.getElementById('editarNombre').value = producto.productonombre;
            document.getElementById('editarPrecio').value = producto.productoprecio;
            document.getElementById('editarStock').value = producto.productosstock;
            document.getElementById('editarIdProducto').value = producto.productoid;

            // Mostrar el formulario de edición
            document.getElementById('formEditarProducto').style.display = 'block';

            // Manejar el evento click para el botón de guardar cambios
            document.getElementById('btnGuardarCambios').onclick = async () => {
                // Obtener los valores actualizados del formulario
                const productocb = document.getElementById('editarNombrecb').value;
                const productonombre = document.getElementById('editarNombre').value;
                const productoprecio = document.getElementById('editarPrecio').value;
                const productosstock = document.getElementById('editarStock').value;

                try {
                    // Realizar la solicitud PUT al endpoint para actualizar el producto
                    const response = await fetch(`http://localhost:3000/producto/${idProducto}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            productocb,
                            productonombre,
                            productoprecio: parseFloat(productoprecio),  // Convertir el precio a float
                            productosstock: parseInt(productosstock),  // Convertir el stock a entero
                        }),
                    });

                    const data = await response.json();

                    if (data.result_estado === 'ok') {
                        alert('Producto actualizado exitosamente');

                        // Actualizar los valores en el DOM
                        document.querySelector(`#producto-${idProducto} .productocb`).textContent = productocb;
                        document.querySelector(`#producto-${idProducto} .productonombre`).textContent = productonombre;
                        document.querySelector(`#producto-${idProducto} .productoprecio`).textContent = `Precio: $${productoprecio}`;
                        document.querySelector(`#producto-${idProducto} .productosstock`).textContent = `Stock: ${productosstock}`;
                    } else {
                        alert('Error al actualizar el producto: ' + data.result_message);
                    }
                } catch (error) {
                    console.error('Error al actualizar el producto:', error);
                    alert('Error al actualizar el producto');
                }
            };
        } else {
            alert('Error al cargar los datos del producto: ' + data.result_message);
        }
    } catch (error) {
        console.error('Error al cargar el producto:', error);
        alert('Error al cargar el producto');
    }
};

//Funcion para eliminar el producto
const eliminarProducto = async (idProducto) => {
    const confirmar = confirm("¿Estás seguro de que deseas eliminar este producto?");
    
    if (confirmar) {
        try {
            // Realizar la solicitud DELETE al servidor
            const response = await fetch(`http://localhost:3000/producto/${idProducto}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.result_estado === 'ok') {
                // Eliminar el producto del DOM
                document.getElementById(`producto-${idProducto}`).remove();
                alert('Producto eliminado exitosamente');
            } else {
                alert('Error al eliminar el producto: ' + data.result_message);
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            alert('Error al eliminar el producto');
        }
    }
};
