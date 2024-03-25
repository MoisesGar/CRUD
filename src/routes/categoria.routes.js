import { Router } from "express";
import {pool} from  "../db.js"

const router = Router();

router.get('/category', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT ID_CategoriaProducto, Descripcion FROM categoria where Eliminado = 0');
        res.render('categorias/add',{categorias: result});
    } catch (err) {
        console.error('Error al obtener categorias:', err);
        res.status(500).send('Error interno del servidor');
    }
})

router.post('/category', async(req, res) => {
    try {
        const {Descripcion} = req.body
        const newCategorie = {Descripcion}
        await pool.query('INSERT INTO categoria SET ?', [newCategorie]);
        res.redirect('/category');
    } catch (err) {
        res.status(500).json({message:err.message})
    }
 })

 router.get('/category/delete/:id', async(req, res) => {
    try {
        const {id} = req.params
        await pool.query('DELETE FROM categoria WHERE ID_CategoriaProducto = ?', [id]);
        res.redirect('/category');
    } catch (err) {
        res.status(500).json({message:err.message})
    }
 })

 export default router