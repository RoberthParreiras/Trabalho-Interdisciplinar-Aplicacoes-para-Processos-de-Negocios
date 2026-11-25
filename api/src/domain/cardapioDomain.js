class CardapioValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "CardapioValidationError";
  }
}

function cardapioParse(cardapio) {
  if (!cardapio || typeof cardapio !== "object") {
    throw new CardapioValidationError("Dados do item inválidos.");
  }

  const nome = typeof cardapio.nome === "string" ? cardapio.nome.trim() : "";
  const preco = String(cardapio.preco ?? "").trim().replace(",", ".");
  const disponivel =
    cardapio.disponivel === undefined ? true : cardapio.disponivel;

  if (!nome) {
    throw new CardapioValidationError("Informe o nome do item.");
  }

  if (!/^\d+(?:\.\d{1,2})?$/.test(preco)) {
    throw new CardapioValidationError(
      "Informe um preço válido com até duas casas decimais.",
    );
  }

  if (typeof disponivel !== "boolean") {
    throw new CardapioValidationError("A disponibilidade deve ser válida.");
  }

  return { nome, preco, disponivel };
}

export { CardapioValidationError, cardapioParse };
