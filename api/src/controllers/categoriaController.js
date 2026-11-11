import express from "express";
import { listarCategorias, getCategoria, criarCategoria, alterarCategoria, deletarCategoria } from "../services/categoriaService.js";

const router = express.Router();

router.get('/', async (req, res) => {
    const categorias = await listarCategorias();

    if (!categorias) {
        return res.status(404).json({
            mensagem: "Lista de categorias não encontrada"
        });
    }

    res.json(categorias);
});

router.get('/:id', async (req, res) => {
    const categoriaEncontrada = await getCategoria(req.params.id);

    if (!categoriaEncontrada) {
        return res.status(404).json({
            mensagem: "Categoria não encontrada"
        });
    }

    res.json(categoriaEncontrada);
});

router.post('/', async (req, res) => {
    const categoria = {
        nome: req.body.nome,
    }

    const categoriaCriada = await criarCategoria(categoria);

    res.status(201).json(categoriaCriada);
});

router.put('/:id', async (req, res) => {
    const categoria = {
        id: req.params.id,
        nome: req.body.nome
    }

    const categoriaAlterada = await alterarCategoria(categoria);
    
    if (!categoriaAlterada) {
        return res.status(404).json({
            mensagem: "Categoria não encontrada"
        });
    }

    res.json(categoriaAlterada);
});

router.delete('/:id', async (req, res) => {
    const categoriaDeletada = await deletarCategoria(req.params.id);

    if (!categoriaDeletada) {
        return res.status(404).json({
            mensagem: "Categoria não encontrada"
        });
    }

    res.json({mensagem: "Categoria removida com sucesso"});
});

export default router;