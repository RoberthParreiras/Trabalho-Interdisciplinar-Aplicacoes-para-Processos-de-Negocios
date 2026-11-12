import prisma from "../infra/db/prisma.js";
import { itemComandaParse } from "../domain/itemComandaDomain.js";

async function listarItensComanda() {
    try {
        return await prisma.itemComanda.findMany();
    } catch (e) {
        throw "Erro ao listar itens da comanda";
    }
}

async function getItemComanda(id) {
    try {
        return await prisma.itemComanda.findUnique({
            where: { id }
        });
    } catch (e) {
        throw "Erro ao procurar item da comanda";
    }
}

async function criarItemComanda(itemComanda) {
    const itemComandaParsed = itemComandaParse(itemComanda);

    try {
        return await prisma.itemComanda.create({
            data: itemComandaParsed
        });
    } catch (e) {
        throw "Erro ao criar item da comanda";
    }
}

async function alterarItemComanda(itemComanda) {
    let itemComandaExiste;

    try {
        itemComandaExiste = await prisma.itemComanda.findUnique({
            where: { id: itemComanda.id }
        });
    } catch (e) {
        throw "Erro ao procurar item da comanda";
    }

    if (!itemComandaExiste) return null;

    const itemComandaParsed = itemComandaParse(itemComanda);

    try {
        return await prisma.itemComanda.update({
            where: { id: itemComanda.id },
            data: itemComandaParsed
        });
    } catch (e) {
        throw "Erro ao alterar item da comanda";
    }
}

async function deletarItemComanda(id) {
    try {
        const itemComandaExiste = await prisma.itemComanda.findUnique({
            where: { id }
        });

        if (!itemComandaExiste) return null;

        return await prisma.itemComanda.delete({
            where: { id }
        });
    } catch (e) {
        throw "Erro ao deletar item da comanda";
    }
}

export { listarItensComanda, getItemComanda, criarItemComanda, alterarItemComanda, deletarItemComanda };