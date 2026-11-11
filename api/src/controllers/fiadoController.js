import express from "express";
import { listarFiados, getFiado, criarFiado, alterarFiado, deletarFiado } from "../services/fiadoService.js";

const router = express.Router();

router.get('/', async (req, res) => {
    const fiados = await listarFiados();

    if (!fiados) {
        return res.status(404).json({
            mensagem: "Lista de fiados não encontrada"
        });
    }

    res.json(fiados);
});

router.get('/:id', async (req, res) => {
    const fiadoEncontrado = await getFiado(req.params.id);

    if (!fiadoEncontrado) {
        return res.status(404).json({
            mensagem: "Fiado não encontrado"
        });
    }

    res.json(fiadoEncontrado);
});

router.post('/', async (req, res) => {
    const fiado = {
        nome: req.body.nome,
        cpf: req.body.cpf,
        valor: req.body.valor
    }

    const fiadoCriado = await criarFiado(fiado);

    res.status(201).json(fiadoCriado);
});

router.put('/:id', async (req, res) => {
    const fiado = {
        id: req.params.id,
        nome: req.body.nome,
        valor: req.body.valor
    }

    const fiadoAlterado = await alterarFiado(fiado);
    
    if (!fiadoAlterado) {
        return res.status(404).json({
            mensagem: "Fiado não encontrado"
        });
    }

    res.json(fiadoAlterado);
});

router.delete('/:id', async (req, res) => {
    const fiadoDeletado = await deletarFiado(req.params.id);

    if (!fiadoDeletado) {
        return res.status(404).json({
            mensagem: "Fiado não encontrado"
        });
    }

    res.json({mensagem: "Fiado removido com sucesso"});
});

export default router;