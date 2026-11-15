function itemComandaParse(itemComanda) {
    const idComanda = String(itemComanda.idComanda ?? "").trim();
    const idCardapio = String(itemComanda.idCardapio ?? "").trim();
    const quantidade = String(itemComanda.quantidade ?? "").trim();
    const precoUnitarioTexto = String(itemComanda.precoUnitario ?? "").trim();
    const quantidadeNumerica = Number(quantidade);
    const precoUnitario = Number(precoUnitarioTexto);

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(idComanda)) throw new Error("idComanda deve ser um UUID válido");
    if (!uuidRegex.test(idCardapio)) throw new Error("idCardapio deve ser um UUID válido");
    if (!Number.isInteger(quantidadeNumerica) || quantidadeNumerica <= 0) {
        throw new Error("quantidade deve ser um número inteiro positivo");
    }
    if (!precoUnitarioTexto || !Number.isFinite(precoUnitario) || precoUnitario < 0) {
        throw new Error("precoUnitario deve ser um número maior ou igual a zero");
    }

    return {
        idComanda,
        idCardapio,
        quantidade,
        precoUnitario: precoUnitarioTexto
    };
}

export { itemComandaParse };