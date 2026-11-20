import express from "express";

import {
  listarUsuarios,
  buscarUsuario,
  criarUsuario,
  loginUsuario,
  alterarUsuario,
  deletarUsuario,
} from "../services/usuarioService.js";
import { autenticar } from "../infra/middleware/auth.js";

const usuarioRouter = express.Router();

usuarioRouter.get("/me", autenticar, (req, res) => {
  res.status(200).json({ usuario: req.user });
});

usuarioRouter.get("/", autenticar, async (req, res) => {
  try {
    const usuarios = await listarUsuarios();

    return res.status(200).json(usuarios);
  } catch (e) {
    return res.status(500).json({
      mensagem: e,
    });
  }
});

usuarioRouter.get("/:id", autenticar, async (req, res) => {
  try {
    const usuario = await buscarUsuario(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado",
      });
    }

    return res.status(200).json(usuario);
  } catch (e) {
    return res.status(500).json({
      mensagem: e,
    });
  }
});

usuarioRouter.post("/", autenticar, async (req, res) => {
  try {
    const usuario = await criarUsuario(req.body);

    return res.status(201).json(usuario);
  } catch (e) {
    return res.status(500).json({
      mensagem: e,
    });
  }
});

usuarioRouter.post("/login", async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    const { usuarioEncontrado, token } = await loginUsuario(usuario, senha);

    if (!usuarioEncontrado) {
      return res.status(401).json({
        mensagem: "Usuário ou senha inválidos",
      });
    }

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json(usuarioEncontrado);
  } catch (e) {
    return res.status(500).json({
      mensagem: e,
    });
  }
});

usuarioRouter.post('/logout', autenticar, (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
  });

  return res.status(200).json({ mensagem: 'Logout realizado com sucesso' });
});

usuarioRouter.put("/:id", autenticar, async (req, res) => {
  try {
    const usuario = await alterarUsuario({
      id: req.params.id,
      ...req.body,
    });

    if (!usuario) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado",
      });
    }

    return res.status(200).json(usuario);
  } catch (e) {
    return res.status(500).json({
      mensagem: e,
    });
  }
});

usuarioRouter.delete("/:id", autenticar, async (req, res) => {
  try {
    const usuario = await deletarUsuario(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado",
      });
    }

    return res.status(200).json(usuario);
  } catch (e) {
    return res.status(500).json({
      mensagem: e,
    });
  }
});

export default usuarioRouter;
