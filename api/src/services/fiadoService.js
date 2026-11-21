import prisma from "../infra/db/prisma.js";
import { fiadoParse, fiadoParseEditar } from "../domain/fiadoDomain.js";

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
        id: id,
      },
    });

    if (!fiado) return null;

    return fiado;
  } catch (e) {
    throw "Error ao procurar pelo fiado";
  }
}

async function criarFiado(fiado) {
  try {
    const fiadoParsed = fiadoParse(fiado);

    const fiadoCriado = await prisma.fiado.create({
      data: {
        nome: fiadoParsed.nome,
        cpf: fiadoParsed.cpf,
        valor: fiadoParsed.valor,
        dataVencimento: new Date(fiadoParsed.dataVencimento),
      },
    });
    return fiadoCriado;
  } catch (e) {
    throw `Error ao criar fiado: ${e}`;
  }
}

async function alterarFiado(fiado) {
  const fiadoExiste = await prisma.fiado.findUnique({
    where: {
      id: fiado.id,
    },
  });

  if (!fiadoExiste) return null;

  const fiadoParsed = fiadoParseEditar(fiado);

  try {
    const fiadoModificado = await prisma.fiado.update({
      where: {
        id: fiado.id,
      },
      data: {
        nome: fiadoParsed.nome ? fiadoParsed.nome : fiadoExiste.nome,
        valor: fiadoParsed.valor ? fiadoParsed.valor : fiadoExiste.valor,
        dataVencimento: fiadoParsed.dataVencimento
          ? fiadoParsed.dataVencimento
          : fiadoExiste.dataVencimento,
      },
    });

    return fiadoModificado;
  } catch (e) {
    throw e;
  }
}

async function deletarFiado(id) {
  try {
    const fiadoExiste = await prisma.fiado.findUnique({
      where: {
        id: id,
      },
    });

    if (!fiadoExiste) return null;

    const fiado = await prisma.fiado.delete({
      where: {
        id: id,
      },
    });

    return fiado;
  } catch (e) {
    throw "Error ao deletar fiado";
  }
}

export { listarFiados, getFiado, criarFiado, alterarFiado, deletarFiado };
