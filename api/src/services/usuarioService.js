import prisma from "../infra/db/prisma.js";
import bcrypt from "bcrypt";
import { usuarioParse } from "../domain/usuarioDomain.js";

async function listarUsuarios() {
    try {
        return await prisma.usuario.findMany({
            select: {
                id: true,
                nome: true,
                usuario: true,
                dataCriacao: true,
                dataModificacao: true
            }
        });
    } catch (e) {
        throw "Erro ao listar usuários";
    }
}

async function buscarUsuario(id) {
    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                id: id
            }
        });

        return usuario;
    } catch (e) {
        throw "Erro ao buscar usuário";
    }
}

async function criarUsuario(usuario) {
    try {
        const usuarioParsed = usuarioParse(usuario);

        // Gera o hash da senha
        const senhaHash = await bcrypt.hash(usuarioParsed.senha, 10);

        const usuarioCriado = await prisma.usuario.create({
            data: {
                nome: usuarioParsed.nome,
                usuario: usuarioParsed.usuario,
                senha: senhaHash
            },
            select: {
                id: true,
                nome: true,
                usuario: true,
                dataCriacao: true,
                dataModificacao: true
            }
        });

        return usuarioCriado;
    } catch (e) {
        throw `Erro ao criar usuário: ${e}`;
    }
}

async function loginUsuario(usuario, senha) {
    try {
        const usuarioEncontrado = await prisma.usuario.findUnique({
            where: {
                usuario: usuario
            }
        });

        if (!usuarioEncontrado) {
            return null;
        }

        // Compara a senha digitada com o hash do banco
        const senhaValida = await bcrypt.compare(
            senha,
            usuarioEncontrado.senha
        );

        if (!senhaValida) {
            return null;
        }

        // Não retorna o hash da senha
        const { senha: _, ...usuarioSemSenha } = usuarioEncontrado;

        return usuarioSemSenha;

    } catch (e) {
        throw "Erro ao realizar login";
    }
}

async function alterarUsuario(usuario) {
    try {
        const usuarioExiste = await prisma.usuario.findUnique({
            where: {
                id: usuario.id
            }
        });

        if (!usuarioExiste) {
            return null;
        }

        return await prisma.usuario.update({
            where: {
                id: usuario.id
            },
            data: {
                nome: usuario.nome ?? usuarioExiste.nome,
                usuario: usuario.usuario ?? usuarioExiste.usuario,
                senha: usuario.senha ?? usuarioExiste.senha
            }
        });
    } catch (e) {
        throw "Erro ao alterar usuário";
    }
}

async function deletarUsuario(id) {
    try {
        const usuarioExiste = await prisma.usuario.findUnique({
            where: {
                id: id
            }
        });

        if (!usuarioExiste) {
            return null;
        }

        return await prisma.usuario.delete({
            where: {
                id: id
            }
        });
    } catch (e) {
        throw "Erro ao deletar usuário";
    }
}

export {
    listarUsuarios,
    buscarUsuario,
    criarUsuario,
    loginUsuario,
    alterarUsuario,
    deletarUsuario
};