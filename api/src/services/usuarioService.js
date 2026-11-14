import prisma from "../infra/db/prisma.js";

async function listarUsuarios() {
    try {
        return await prisma.usuario.findMany();
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
        const usuarioCriado = await prisma.usuario.create({
            data: {
                nome: usuario.nome,
                usuario: usuario.usuario,
                senha: usuario.senha
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

        if (usuarioEncontrado.senha !== senha) {
            return null;
        }

        return usuarioEncontrado;
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