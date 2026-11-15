import express from "express";
import {
    listarItensComanda,
    getItemComanda,
    criarItemComanda,
    alterarItemComanda,
    deletarItemComanda
} from "../services/itemComandaService.js";

const router = express.Router();

router.get('/', async (req, res) => {
    const itensComanda = await listarItensComanda();
    res.json(itensComanda);
});

router.get('/:id', async (req, res) => {
    const itemComanda = await getItemComanda(req.params.id);

    if (!itemComanda) {
        return res.status(404).json({ mensagem: "Item da comanda não encontrado" });
    }

    res.json(itemComanda);
});

router.post('/', async (req, res) => {
    try {
        const itemComandaCriado = await criarItemComanda({
            idComanda: req.body.idComanda,
            idCardapio: req.body.idCardapio,
            quantidade: req.body.quantidade,
            precoUnitario: req.body.precoUnitario
        });

        res.status(201).json(itemComandaCriado);
    } catch (e) {
        if (e instanceof Error) {
            return res.status(400).json({ mensagem: e.message });
        }

        res.status(500).json({ mensagem: e });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const itemComandaAlterado = await alterarItemComanda({
            id: req.params.id,
            idComanda: req.body.idComanda,
            idCardapio: req.body.idCardapio,
            quantidade: req.body.quantidade,
            precoUnitario: req.body.precoUnitario
        });

        if (!itemComandaAlterado) {
            return res.status(404).json({ mensagem: "Item da comanda não encontrado" });
        }

        res.json(itemComandaAlterado);
    } catch (e) {
        if (e instanceof Error) {
            return res.status(400).json({ mensagem: e.message });
        }

        res.status(500).json({ mensagem: e });
    }
});

router.delete('/:id', async (req, res) => {
    const itemComandaDeletado = await deletarItemComanda(req.params.id);

    if (!itemComandaDeletado) {
        return res.status(404).json({ mensagem: "Item da comanda não encontrado" });
    }

    res.json({ mensagem: "Item da comanda removido com sucesso" });
});

export default router;