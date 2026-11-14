import prisma from "../infra/db/prisma.js"
import { categoriaParse } from "../domain/categoriaDomain.js";

async function listarCategorias() {
    try {
        const categorias = await prisma.categoria.findMany();
        
        if (!categorias) return null;

        return categorias;
    } catch (e) {
        throw "Error ao listar categorias";
    }    
}

async function getCategoria(id) {
    try {
        const categoria = await prisma.categoria.findUnique({
            where: {
                id: id
            }
        });

        if (!categoria) return null;

        return categoria;
    } catch (e) {
        throw "Error ao procurar pela categoria";
    }
}

async function criarCategoria(categoria) {
    const categoriaParsed = categoriaParse(categoria);

    try {
        const categoria = await prisma.categoria.create({
            data: {
                nome: categoriaParsed
            }
        });

        return categoria;
    } catch (e) {
        throw `Error ao criar categoria ${e}`;
    }
}

async function alterarCategoria(categoria) {
    const categoriaExiste = await prisma.categoria.findUnique({
        where: {
            id: categoria.id
        }
    });

    if (!categoriaExiste) return null;

    const categoriaParsed = categoriaParse(categoria);

    try {

        const categoriaModificada = await prisma.categoria.update({
            where: {
                id: categoria.id
            },
            data: {
                nome: categoriaParsed
            }
        });

        return categoriaModificada;
    } catch (e) {
        throw "Error ao modificar categoria";
    }
}

async function deletarCategoria(id) {
    try {
        const categoriaExiste = await prisma.categoria.findUnique({
            where: {
                id: id
            }
        });

        if (!categoriaExiste) return null;

        const categoria = await prisma.categoria.delete({
            where: {
                id: id
            }
        });

        return categoria;
    } catch (e) {
        throw "Error ao deletar categoria";
    }
}

export { listarCategorias, getCategoria, criarCategoria, alterarCategoria, deletarCategoria };
