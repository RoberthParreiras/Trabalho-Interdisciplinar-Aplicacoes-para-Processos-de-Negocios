import express from "express";
import { listarEstoques, getEstoque, criarEstoque, alterarEstoque, deletarEstoque } from "../services/estoqueService.js";

const router = express.Router();

router.get('/', async (req, res) => {
    const estoques = await listarEstoques();

    if (!estoques) {
        return res.status(404).json({
            erro: "Estoques não encontrados"
        });
    }

    res.json(estoques);
});

router.get('/:id', async (req, res) => {
    const estoqueEncontrado = await getEstoque(req.params.id);

    if (!estoqueEncontrado) {
        return res.status(404).json({
            erro: "Estoque não encontrado"
        });
    }

    res.json(estoqueEncontrado);
});

router.post('/', async (req, res) => {
    const estoque = {
        nome: req.body.nome,
        id_categoria: req.body.id_categoria ?? req.body.idCategoria,
        Quantidade: req.body.Quantidade
    };

    const estoqueCriado = await criarEstoque(estoque);

    res.status(201).json(estoqueCriado);
});

router.put('/:id', async (req, res) => {
    const estoque = {
        id: req.params.id,
        nome: req.body.nome,
        id_categoria: req.body.id_categoria ?? req.body.idCategoria,
        Quantidade: req.body.Quantidade
    };

    const estoqueAlterado = await alterarEstoque(estoque);

    if (!estoqueAlterado) {
        return res.status(404).json({
            erro: "Estoque não encontrado"
        });
    }

    res.json(estoqueAlterado);
});

router.delete('/:id', async (req, res) => {
    const estoqueDeletado = await deletarEstoque(req.params.id);

    if (!estoqueDeletado) {
        return res.status(404).json({
            erro: "Estoque não encontrado"
        });
    }

    res.json({ mensagem: "Estoque removido com sucesso" });
});

export default router;
