import { Router } from "express";
import {pool} from '../db.js'

const router = Router();

router.get('/', async (req, res) => {
    res.render('index')
})

router.get('/add', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT ID_CategoriaProducto, Descripcion FROM categoria where Eliminado = 0');
        res.render('productos/add',{categorias: result});
    } catch (err) {
        console.error('Error al obtener categorias:', err);
        res.status(500).send('Error interno del servidor');
    }
})

router.post('/add', async(req, res) => {
    try {
        const {Descripcion, Precio, Cantidad, Stock_Min, Stock_Max, ID_CategoriaProducto} = req.body
        const newProduct = {Descripcion, Precio, Cantidad, Stock_Min, Stock_Max, ID_CategoriaProducto}
        await pool.query('INSERT INTO productos SET ?', [newProduct]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})

router.get('/list', async (req, res) => {
    try {
        const [result] = await pool.query(`select ID_Productos, productos.Descripcion, Precio, Cantidad, Stock_Min, Stock_Max,categoria.Descripcion as Categoria
        from productos
        inner join categoria on productos.ID_CategoriaProducto = categoria.ID_CategoriaProducto
        where productos.Eliminado = 0`)
        res.render('productos/list', {productos: result});
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})

router.get('/recover', async (req, res) => {
    try {
        const [result] = await pool.query(`select ID_Productos, productos.Descripcion, Precio, Cantidad, Stock_Min, Stock_Max,categoria.Descripcion as Categoria
        from productos
        inner join categoria on productos.ID_CategoriaProducto = categoria.ID_CategoriaProducto
        where productos.Eliminado = 1`)
        res.render('productos/recover', {productos: result});
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})

router.get('/edit/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const [Producto] = await pool.query('SELECT * FROM Productos WHERE ID_Productos = ?' , [id]);
        const [result] = await pool.query('SELECT ID_CategoriaProducto, Descripcion FROM categoria where Eliminado = 0 and ID_CategoriaProducto != ?', [Producto[0].ID_CategoriaProducto]);
        const [Categoria] = await pool.query('SELECT ID_CategoriaProducto, Descripcion FROM categoria where Eliminado = 0 and ID_CategoriaProducto = ?', [Producto[0].ID_CategoriaProducto]);
        const ProductoEdit = Producto[0];
        res.render('productos/edit', {Productos: ProductoEdit, Categorias: result, Categoria: Categoria[0]});
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})

router.post('/edit/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {Descripcion, Precio, Cantidad, Stock_Min, Stock_Max, ID_CategoriaProducto} = req.body
        const EditProducto = {Descripcion, Precio, Cantidad, Stock_Min, Stock_Max, ID_CategoriaProducto}
        await pool.query('UPDATE Productos SET ? WHERE ID_Productos = ?', [EditProducto,id]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})

router.get('/delete/:id', async (req, res) => {
    try {
        const {id} = req.params;
        await pool.query('UPDATE Productos SET Eliminado = 1 WHERE ID_Productos = ?', [id]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})

router.get('/recover/:id', async (req, res) => {
    try {
        const {id} = req.params;
        await pool.query('UPDATE Productos SET Eliminado = 0 WHERE ID_Productos = ?', [id]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})

router.get('/drop/:id', async (req, res) => {
    try {
        const {id} = req.params;
        await pool.query('DELETE FROM Productos WHERE Eliminado = 1 and ID_Productos = ?', [id]);
        res.redirect('/recover');
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})

export default router
