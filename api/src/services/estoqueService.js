import prisma from "../infra/db/prisma.js";
import { estoqueParse, validarQuantidadeEstoque } from "../domain/estoqueDomain.js";

async function listarEstoques() {
    try {
        const estoques = await prisma.estoque.findMany();

        if (!estoques) return null;

        return estoques;
    } catch (e) {
        throw "Error ao listar estoques";
    }
}

async function getEstoque(id) {
    try {
        const estoque = await prisma.estoque.findUnique({
            where: {
                id: id
            }
        });

        if (!estoque) return null;

        return estoque;
    } catch (e) {
        throw "Error ao procurar pelo estoque";
    }
}

async function criarEstoque(estoque) {
    const estoqueParsed = estoqueParse(estoque);

    try {
        const estoqueCriado = await prisma.estoque.create({
            data: {
                nome: estoqueParsed.nome,
                idCategoria: estoqueParsed.idCategoria,
                quantidade: estoqueParsed.quantidade,
                estoqueMinimo: estoqueParsed.estoqueMinimo
            }
        });

        return estoqueCriado;
    } catch (e) {
        throw `Error ao criar estoque ${e}`;
    }
}

async function alterarEstoque(estoque) {
    validarQuantidadeEstoque(estoque.quantidade);

    const estoqueExiste = await prisma.estoque.findUnique({
        where: {
            id: estoque.id
        }
    });

    if (!estoqueExiste) return null;

    const estoqueParsed = estoqueParse(estoque);
    try {
        const estoqueModificado = await prisma.estoque.update({
            where: {
                id: estoque.id
            },
            data: {
                nome: estoqueParsed.nome,
                idCategoria: estoqueParsed.idCategoria,
                quantidade: estoqueParsed.quantidade,
                estoqueMinimo: estoqueParsed.estoqueMinimo
            }
        });

        return estoqueModificado;
    } catch (e) {
        throw "Error ao modificar estoque";
    }
}

async function deletarEstoque(id) {
    try {
        const estoqueExiste = await prisma.estoque.findUnique({
            where: {
                id: id
            }
        });

        if (!estoqueExiste) return null;

        const estoque = await prisma.estoque.delete({
            where: {
                id: id
            }
        });

        return estoque;
    } catch (e) {
        throw "Error ao deletar estoque";
    }
}

export { listarEstoques, getEstoque, criarEstoque, alterarEstoque, deletarEstoque };
