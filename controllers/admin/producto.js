// Constantes para completar las rutas de la API.
const MATERIAL_API = 'services/admin/materiales.php';
const MARCA_API = 'services/admin/marca.php';
const GENERO_API = 'services/admin/genero.php';
const DESCUENTO_API = 'services/admin/descuento.php';
const CATEGORIA_API = 'services/admin/categoria.php';
const PRODUCTO_API = 'services/admin/producto.php';
// Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');
// Constantes para establecer el contenido de la tabla.
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound');
// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');
// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    ID_PRODUCTO = document.getElementById('idProducto'),
    NOMBRE_PRODUCTO = document.getElementById('nombreProducto'),
    CODIGO_INTERNO = document.getElementById('codigoInterno'),
    REFERENCIA_PRO = document.getElementById('referenciaPro'),
    PRECIO = document.getElementById('precioProducto');
    IMAGEN_PRODUCTO = document.getElementById('imagen');


// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'Gestionar productos';
    // Llamada a la función para llenar la tabla con los registros existentes.
    fillTable();
});

// Método del evento para cuando se envía el formulario de buscar.
SEARCH_FORM.addEventListener('submit', (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SEARCH_FORM);
    // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
    fillTable(FORM);
});

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_PRODUCTO.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(PRODUCTO_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        SAVE_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillTable();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});
/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillTable = async (form = null) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRows' : action = 'readAll';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(PRODUCTO_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <tr>
                    <td><img src="${SERVER_URL}images/productos/${row.imagen}" height="50"></td>
                    <td>${row.nombre_producto}</td>
                    <td>${row.codigo_interno}</td>
                    <td>${row.referencia_proveedor}</td>
                    <td>${row.precio}</td>
                    <td></td>
                    <td></td>
                    <td>
                        <button type="button" class="btn btn-info" onclick="openUpdate(${row.id_producto})">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button type="button" class="btn btn-danger" onclick="openDelete(${row.id_producto})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                         <button type="button" class="btn btn-danger" onclick="openCreateDetail(${row.id_producto})">
                         <i class="bi bi-clipboard-plus-fill"></i>
                         </button>
                    </td>
                </tr>
            `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        sweetAlert(4, DATA.error, true);
    }
}



/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Crear producto';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    fillSelect(CATEGORIA_API, 'readAll', 'nombreCategoria');
    fillSelect(DESCUENTO_API, 'readAll', 'nombreDescuento');
    fillSelect(MARCA_API, 'readAll', 'nombreMarca');
    fillSelect(GENERO_API, 'readAll', 'nombre_genero');
    fillSelect(MATERIAL_API, 'readAll', 'nombreMaterial');
}

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/

const openUpdate = async (id) => {
    // Se define una constante tipo objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idProducto', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(PRODUCTO_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar productos';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_PRODUCTO.value = ROW.id_producto;
        NOMBRE_PRODUCTO.value = ROW.nombre_producto;
        CODIGO_INTERNO.value = ROW.codigo_interno;
        REFERENCIA_PRO.value = ROW.referencia_proveedor;
        PRECIO.value = ROW.precio;
        fillSelect(CATEGORIA_API, 'readAll', 'nombreCategoria', ROW.nombre_categoria);
        fillSelect(DESCUENTO_API, 'readAll', 'nombreDescuento', ROW.nombre_descuento);
        fillSelect(MARCA_API, 'readAll', 'nombreMarca', ROW.nombre_marca);
        fillSelect(GENERO_API, 'readAll', 'nombre_genero', ROW.nombre_genero);
        fillSelect(MATERIAL_API, 'readAll', 'nombreMaterial',ROW.nombre_material);
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el producto de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idProducto', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(PRODUCTO_API, 'deleteRow', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            fillTable();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}
