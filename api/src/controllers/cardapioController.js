import express from "express";
import {
  alterarCardapio,
  criarCardapio,
  deletarCardapio,
  getCardapio,
  listarCardapios,
} from "../services/cardapioService.js";
import { CardapioValidationError } from "../domain/cardapioDomain.js";
import { autenticar } from "../infra/middleware/auth.js";

const router = express.Router();
router.use(autenticar);

function responderErro(res, error, operacao) {
  if (error instanceof CardapioValidationError) {
    return res.status(400).json({ mensagem: error.message });
  }

  console.error(`Erro ao ${operacao} item do cardápio:`, error);
  return res.status(500).json({
    mensagem: `Não foi possível ${operacao} o item do cardápio.`,
  });
}

router.get("/", async (req, res) => {
  try {
    return res.json(await listarCardapios());
  } catch (error) {
    return responderErro(res, error, "listar");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cardapio = await getCardapio(req.params.id);

    if (!cardapio) {
      return res.status(404).json({ mensagem: "Item do cardápio não encontrado." });
    }

    return res.json(cardapio);
  } catch (error) {
    return responderErro(res, error, "buscar");
  }
});

router.post("/", async (req, res) => {
  try {
    const cardapio = await criarCardapio(req.body);
    return res.status(201).json(cardapio);
  } catch (error) {
    return responderErro(res, error, "criar");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const cardapio = await alterarCardapio(req.params.id, req.body);

    if (!cardapio) {
      return res.status(404).json({ mensagem: "Item do cardápio não encontrado." });
    }

    return res.json(cardapio);
  } catch (error) {
    return responderErro(res, error, "alterar");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const cardapio = await deletarCardapio(req.params.id);

    if (!cardapio) {
      return res.status(404).json({ mensagem: "Item do cardápio não encontrado." });
    }

    return res.json({ mensagem: "Item do cardápio removido com sucesso." });
  } catch (error) {
    return responderErro(res, error, "excluir");
  }
});

export default router;
