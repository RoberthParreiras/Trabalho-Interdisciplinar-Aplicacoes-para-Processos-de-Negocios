import prisma from "../infra/db/prisma.js"
import { fiadoParse } from "../domain/fiadoDomain.js";

async function listarFiados() {
    try {
        const fiados = await prisma.fiado.findMany();
        
        if (!fiados) return null;

        return fiados;
    } catch (e) {
        throw "Error ao listar fiados";
    }    
}

async function getFiado(id) {
    try {
        const fiado = await prisma.fiado.findUnique({
            where: {
                id: id
            }
        });

        if (!fiado) return null;

        return fiado;
    } catch (e) {
        throw "Error ao procurar pelo fiado";
    }
}

async function criarFiado(fiado) {
    const fiadoParsed = fiadoParse(fiado);

    try {
        const fiado = await prisma.fiado.create({
            data: {
                nome: fiadoParsed
            }
        });

        return fiado;
    } catch (e) {
        throw "Error ao criar fiado";
    }
}

async function alterarFiado(fiado) {
    const fiadoExiste = await prisma.fiado.findUnique({
        where: {
            id: fiado.id
        }
    });

    if (!fiadoExiste) return null;

    const categoriaParsed = fiadoParse(categoria);

    try {

        const fiadoModificado = await prisma.fiado.update({
            where: {
                id: fiado.id
            },
            data: {
                nome: categoriaParsed
            }
        });

        return fiadoModificado;
    } catch (e) {
        throw "Error ao modificar categoria";
    }
}

async function deletarFiado(id) {
    try {
        const fiadoExiste = await prisma.fiado.findUnique({
            where: {
                id: id
            }
        });

        if (!fiadoExiste) return null;

        const fiado = await prisma.fiado.delete({
            where: {
                id: id
            }
        });

        return fiado;
    } catch (e) {
        throw "Error ao deletar fiado";
    }
}

export { listarFiados, getFiado, criarFiado, alterarFiado, deletarFiado };
