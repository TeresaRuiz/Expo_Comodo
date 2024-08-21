<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla CATEGORIA.
 */
class CategoriaHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;

    protected $descripcion = null;


    protected $imagen = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/productos/';

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_categoria, nombre_categoria, imagen
                FROM tb_categorias
                WHERE nombre_categoria LIKE ?
                ORDER BY nombre_categoria';
        $params = array($value);
        return Database::getRows($sql, $params);
    }
    
  
    
    public function createRow()
    {
    $sql = 'INSERT INTO tb_categorias(nombre_categoria, imagen)
            VALUES(?, ?)';
    $params = array($this->nombre, $this->imagen);
    return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT id_categoria, nombre_categoria, imagen
                FROM tb_categorias
                ORDER BY nombre_categoria';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT id_categoria, nombre_categoria, imagen
                FROM tb_categorias
                WHERE id_categoria = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function readFilename()
    {
        $sql = 'SELECT imagen
                FROM tb_categorias
                WHERE id_categoria = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }
    

    public function updateRow()
    {
        $sql = 'UPDATE tb_categorias
                SET imagen = ?, nombre_categoria = ?
                WHERE id_categoria = ?';
        $params = array($this->imagen, $this->nombre, $this->id);
        return Database::executeRow($sql, $params);
    }
    

    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_categorias
                WHERE id_categoria = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    public function readAllCategorias()
    {
        $sql = 'SELECT c.id_categoria, c.nombre_categoria, c.imagen
            FROM tb_categorias c
            JOIN tb_productos p ON c.id_categoria = p.id_categoria
            JOIN tb_detalles_productos dp ON p.id_producto = dp.id_producto
            GROUP BY c.id_categoria, c.nombre_categoria, c.imagen
            HAVING COUNT(dp.id_detalle_producto) > 0
            ORDER BY c.nombre_categoria';
        return Database::getRows($sql);
    }
    public function readTopProductos()
    {
        $sql = 'SELECT p.nombre_producto, SUM(dr.cantidad) AS total_vendido
            FROM tb_detalles_reservas dr
            INNER JOIN tb_detalles_productos dp ON dr.id_detalle_producto = dp.id_detalle_producto
            INNER JOIN tb_productos p ON dp.id_producto = p.id_producto
            WHERE p.id_categoria = ?
            GROUP BY p.nombre_producto
            ORDER BY total_vendido DESC
            LIMIT 5';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }

}
