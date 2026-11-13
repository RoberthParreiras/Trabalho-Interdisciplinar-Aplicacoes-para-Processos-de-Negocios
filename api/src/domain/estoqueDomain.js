class ErroValidacaoEstoque extends Error {}

function validarQuantidadeEstoque(quantidade) {
    if (!Number.isInteger(quantidade) || quantidade < 0) {
        throw new ErroValidacaoEstoque("Quantidade deve ser um inteiro maior ou igual a zero.");
    }

    return quantidade;
}

function estoqueParse(estoque) {
    const nomeCapitalizado = estoque.nome.charAt(0).toUpperCase() + estoque.nome.slice(1);
    return {
        ...estoque,
        nome: nomeCapitalizado
    };
}

export { ErroValidacaoEstoque, estoqueParse, validarQuantidadeEstoque };
