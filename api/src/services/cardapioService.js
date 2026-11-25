import prisma from "../infra/db/prisma.js";
import { cardapioParse } from "../domain/cardapioDomain.js";

async function listarCardapios() {
  return prisma.cardapio.findMany({
    orderBy: { nome: "asc" },
  });
}

async function getCardapio(id) {
  return prisma.cardapio.findUnique({
    where: { id },
  });
}

async function criarCardapio(cardapio) {
  return prisma.cardapio.create({
    data: cardapioParse(cardapio),
  });
}

async function alterarCardapio(id, cardapio) {
  const cardapioExiste = await getCardapio(id);

  if (!cardapioExiste) return null;

  return prisma.cardapio.update({
    where: { id },
    data: cardapioParse(cardapio),
  });
}

async function deletarCardapio(id) {
  const cardapioExiste = await getCardapio(id);

  if (!cardapioExiste) return null;

  return prisma.cardapio.delete({
    where: { id },
  });
}

export {
  listarCardapios,
  getCardapio,
  criarCardapio,
  alterarCardapio,
  deletarCardapio,
};
